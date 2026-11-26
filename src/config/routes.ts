/** Route paths, shared by the router, navigation and the sitemap generator. Pure data. */
export const routes = {
  home: '/',
  prices: '/prices',
  order: '/order',
  status: '/status',
  about: '/about',
  gallery: '/gallery',
  faq: '/faq',
  warranty: '/warranty',
  contact: '/contact',
  accessibility: '/accessibility',
  privacy: '/privacy',
} as const;

export type RouteKey = keyof typeof routes;

/** Pages listed in sitemap.xml */
export const sitemapRoutes: string[] = Object.values(routes);
