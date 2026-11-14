import { matchesProject, type FilterProject } from './project-matches';
for (const root of document.querySelectorAll<HTMLElement>('[data-project-list]')) {
  const form = root.querySelector<HTMLFormElement>('[data-filters]');
  const count = root.querySelector<HTMLElement>('[data-result-count]');
  const empty = root.querySelector<HTMLElement>('[data-no-results]');
  if (!form || !count || !empty) continue;
  const cards = [...root.querySelectorAll<HTMLElement>('[data-project-card]')].map((element) => ({ element, data: { title: element.dataset.title ?? '', summary: element.dataset.summary ?? '', category: element.dataset.category ?? '', tags: JSON.parse(element.dataset.tags ?? '[]') } as FilterProject }));
  function update() {
    const values = new FormData(form!);
    const filters = { query: String(values.get('query') ?? ''), category: String(values.get('category') ?? ''), tags: values.getAll('tag').map(String) };
    let visible = 0;
    for (const card of cards) { card.element.hidden = !matchesProject(card.data, filters); if (!card.element.hidden) visible++; }
    count!.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    empty!.hidden = visible > 0 || cards.length === 0;
  }
  form.hidden = false;
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  update();
}
