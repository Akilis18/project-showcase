export interface FilterProject { title: string; summary: string; category: string; tags: string[] }
export interface Filters { query: string; category: string; tags: string[] }
export function matchesProject(project: FilterProject, filters: Filters): boolean {
  const searchable = [project.title, project.summary, ...project.tags].join(' ').toLowerCase();
  return searchable.includes(filters.query.trim().toLowerCase())
    && (!filters.category || project.category === filters.category)
    && (!filters.tags.length || filters.tags.some((tag) => project.tags.includes(tag)));
}
