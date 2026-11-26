/**
 * Every static asset path goes through here, so changing the base path (src/config/site.ts)
 * is enough to move the site to another location or domain.
 */
const base = import.meta.env.BASE_URL; // always ends with '/'

export function asset(path: string): string {
  return `${base}${path.replace(/^\//, '')}`;
}
