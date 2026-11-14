import { getCollection, type CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export const categories = ['AI / ML', 'Web Development', 'Game', 'Research', 'Other'] as const;
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const canonicalTags = new Map<string, string>();
  for (const { data } of projects) for (const tag of data.tags) {
    const key = tag.toLowerCase();
    const known = canonicalTags.get(key);
    if (known && known !== tag) throw new Error(`Use a consistent tag spelling: ${known} / ${tag}`);
    canonicalTags.set(key, tag);
  }
  return projects.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}
export const statusLabels = { completed: 'Completed', 'in-progress': 'In progress', archived: 'Archived' };
