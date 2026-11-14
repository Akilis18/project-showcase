export function localUrl(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = `/${path.replace(/^\/+/, '')}`;
  return normalized === base || normalized.startsWith(`${base}/`) ? normalized : `${base}${normalized}`;
}
export const projectUrl = (id: string) => localUrl(`/projects/${encodeURIComponent(id)}/`);
