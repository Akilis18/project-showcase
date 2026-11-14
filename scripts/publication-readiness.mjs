import { readdir, readFile } from 'node:fs/promises';
const directory = new URL('../src/content/projects/', import.meta.url);
const entries = (await readdir(directory)).filter((file) => file.endsWith('.json'));
if (entries.length < 3) throw new Error(`Publication requires at least three verified real projects; found ${entries.length}. Local builds remain available.`);
for (const file of entries) {
  const { links } = JSON.parse(await readFile(new URL(file, directory), 'utf8'));
  const urls = Object.values(links ?? {}).filter(Boolean);
  if (!urls.length) throw new Error(`${file}: no public project link`);
  const results = await Promise.all(urls.map(async (url) => {
    try {
      if (new URL(url).protocol !== 'https:') return false;
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      await response.body?.cancel();
      return response.ok;
    } catch { return false; }
  }));
  if (!results.some(Boolean)) throw new Error(`${file}: could not verify any working public link; check access or network availability`);
  results.forEach((ok, index) => { if (!ok) console.warn(`${file}: unavailable link: ${urls[index]}`); });
}
console.log(`${entries.length} project entries have a reachable link. Verify factual accuracy and image rights before publishing.`);
