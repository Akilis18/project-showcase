// Uses the installed Edge browser and Node built-ins; no browser test dependency.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, writeFile, readdir, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, sep, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { once } from 'node:events';

const dist = resolve('dist');
const base = '/project-showcase';
const contentDirectory = resolve('src/content/projects');
const projects = await Promise.all((await readdir(contentDirectory)).filter((file) => file.endsWith('.json')).map(async (file) => JSON.parse(await readFile(join(contentDirectory, file), 'utf8'))));
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!path.startsWith(`${base}/`)) { response.writeHead(404).end(); return; }
    const relative = path.slice(base.length);
    const file = resolve(dist, `.${relative}${relative.endsWith('/') ? 'index.html' : ''}`);
    if (!file.startsWith(dist + sep)) { response.writeHead(403).end(); return; }
    const content = await readFile(file);
    response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' })[extname(file)] ?? 'application/octet-stream');
    response.end(content);
  } catch { response.writeHead(404).end(); }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
const profile = await mkdtemp(join(tmpdir(), 'showcase-edge-'));
const browser = spawn(process.env.EDGE_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  let endpoint;
  const deadline = Date.now() + 20000;
  while (!endpoint && Date.now() < deadline) {
    try { endpoint = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; }
    catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  assert.ok(endpoint, 'Edge debugging endpoint started');
  const targets = await (await fetch(`http://127.0.0.1:${endpoint}/json`)).json();
  socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await once(socket, 'open');
  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  const failedRequests = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) { const task = pending.get(message.id); if (task) { pending.delete(message.id); message.error ? task.reject(new Error(JSON.stringify(message.error))) : task.resolve(message.result); } }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failedRequests.push(message.params.response.url);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(id, { resolve: (value) => { clearTimeout(timeout); resolve(value); }, reject: (error) => { clearTimeout(timeout); reject(error); } });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function navigate(path) {
    await send('Page.navigate', { url: `${origin}${base}${path}` });
    for (let i = 0; i < 60; i++) {
      if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(base + path)} && !document.querySelector('[data-filters][hidden]')`)) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error(`Page did not become ready: ${path}`);
  }
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/');
  const projectCount = await evaluate(`document.querySelectorAll('#projects [data-project-card]').length`);
  assert.ok(projectCount >= 3);
  assert.equal(projectCount, projects.length);
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('main h2')].map(x=>x.textContent)`), ['Featured Projects', 'All Projects', 'About Me', 'Skills / Tech Stack', 'Contact / Social']);
  assert.equal(await evaluate(`document.querySelector('.hero a[href="#contact"]') !== null`), true);
  assert.equal(await evaluate(`document.querySelectorAll('#projects img').length`), 0);
  assert.equal(await evaluate(`document.querySelector('[data-tag-disclosure]').open`), false);
  assert.equal(await evaluate(`document.querySelectorAll('section:first-of-type + section [data-project-card]').length`), Math.min(3, projectCount));
  await mkdir('docs/evidence', { recursive: true });
  await writeFile('docs/evidence/home-desktop.png', Buffer.from((await send('Page.captureScreenshot', { captureBeyondViewport: true })).data, 'base64'));
  const visible = () => evaluate(`[...document.querySelectorAll('#projects [data-project-card]')].filter(x=>!x.hidden).map(x=>x.dataset.title)`);
  async function query(value) { await evaluate(`{const q=document.querySelector('[name=query]');q.value=${JSON.stringify(value)};q.dispatchEvent(new Event('input',{bubbles:true}));}`); }
  await query('CANVAS'); assert.ok((await visible()).length >= 2);
  await query('不存在的搜尋'); assert.equal((await visible()).length, 0);
  assert.equal(await evaluate(`document.querySelector('[data-no-results]').hidden`), false);
  await evaluate(`document.querySelector('[data-filters]').reset()`); assert.equal((await visible()).length, projectCount);
  await evaluate(`const category=document.querySelector('[name=category]');category.value='Game';category.dispatchEvent(new Event('change',{bubbles:true}));`);
  assert.deepEqual((await visible()).sort(), projects.filter((project)=>project.category === 'Game').map((project)=>project.title).sort());
  await query('OpenCV'); assert.equal((await visible()).length, 0);
  await evaluate(`document.querySelector('[data-filters]').reset()`);
  await evaluate(`for(const x of document.querySelectorAll('[name=tag]')){x.checked=['Python','JavaScript'].includes(x.value)};document.querySelector('[data-filters]').dispatchEvent(new Event('change',{bubbles:true}));`);
  assert.deepEqual((await visible()).sort(), projects.filter((project)=>project.tags.some((tag)=>['Python','JavaScript'].includes(tag))).map((project)=>project.title).sort());
  assert.equal(await evaluate(`document.querySelector('[data-selected-count]').textContent`), '(2 selected)');
  assert.equal(await evaluate(`document.querySelector('[data-active-tags]').hidden`), false);
  assert.equal(await evaluate(`document.querySelector('[data-active-tags]').textContent.includes('Python')`), true);
  await evaluate(`document.querySelector('[data-tag-disclosure] summary').focus()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
  assert.equal(await evaluate(`document.querySelector('[data-tag-disclosure]').open`), true);
  await evaluate(`document.querySelector('[name=tag][value=Python]').focus()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  assert.equal(await evaluate(`document.querySelector('[data-selected-count]').textContent`), '(1 selected)');
  assert.deepEqual((await visible()).sort(), projects.filter((project)=>project.tags.includes('JavaScript')).map((project)=>project.title).sort());
  await evaluate(`document.querySelector('[data-tag-disclosure]').open=false;document.querySelector('[data-filters]').reset()`);
  assert.equal(await evaluate(`document.querySelector('[data-selected-count]').textContent`), '(0 selected)');
  assert.equal(await evaluate(`document.querySelector('[data-active-tags]').hidden`), true);
  await evaluate(`document.querySelector('[data-filters]').reset();document.activeElement?.blur();document.body.focus()`);
  await send('Page.navigate', { url: `${origin}${base}/` }); await new Promise((r)=>setTimeout(r,300));
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate(`document.activeElement.textContent`), 'Skip to content');
  for (const width of [320, 375, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `No home overflow at ${width}px`);
    await evaluate(`document.querySelector('[data-tag-disclosure]').open=true`);
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `No expanded-filter overflow at ${width}px`);
    await evaluate(`document.querySelector('[data-tag-disclosure]').open=false`);
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate(`document.activeElement?.blur()`);
  await writeFile('docs/evidence/home-mobile.png', Buffer.from((await send('Page.captureScreenshot', { captureBeyondViewport: true })).data, 'base64'));
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate(`getComputedStyle(document.documentElement).scrollBehavior`), 'auto');
  const links = await evaluate(`[...document.querySelectorAll('#projects h3 a')].map(x=>new URL(x.href).pathname.slice(${base.length}))`);
  for (const link of links) {
    await navigate(link);
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('.prose h2')].map(x=>x.textContent)`), ['Overview','Key Features','Tech Stack','Development / Implementation','Results / Limitations']);
    for (const width of [320, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `No detail overflow ${link} ${width}px`);
    }
    await evaluate(`Promise.all([...document.images].map(async x=>{x.loading='eager';await x.decode()}))`);
    assert.equal(await evaluate(`[...document.images].every(x=>x.complete && x.naturalWidth > 0 && !!x.alt)`), true);
    const project = projects.find((project) => link === `/projects/${project.id}/`);
    assert.equal(await evaluate(`document.querySelectorAll('.gallery').length`), project.gallery?.length ? 1 : 0);
    assert.equal(await evaluate(`document.querySelectorAll('.prose .actions a').length`), Object.values(project.links).filter(Boolean).length);
  }
  await navigate('/404.html');
  assert.equal(await evaluate(`document.title`), 'Page not found — Project Showcase');
  await navigate('/');
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await send('Page.reload'); await new Promise((r)=>setTimeout(r,300));
  assert.equal(await evaluate(`document.querySelectorAll('#projects [data-project-card]').length`), projectCount);
  assert.equal(await evaluate(`document.querySelector('[data-filters]').hidden`), true);
  assert.deepEqual(exceptions, []); assert.deepEqual(failedRequests, []);
  console.log(`Browser checks passed: ${projectCount} projects; search/category/tag OR and AND/reset/empty state; direct routes; gallery present/absent; 320–1440px; keyboard skip link; reduced motion; no-JS fallback; no failed requests or runtime errors.`);
  await send('Browser.close');
} finally {
  socket?.close(); browser.kill(); server.close();
  await new Promise((r)=>setTimeout(r,300));
  const resolvedProfile = resolve(profile);
  if (resolvedProfile.startsWith(resolve(tmpdir()) + sep) && resolvedProfile.includes('showcase-edge-')) await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(()=>{});
}
