import { routes, type RouteKey } from '../../config/routes';

/** Main navigation (header + mobile menu). Labels come from common:nav.<key>. */
export const mainNav: RouteKey[] = ['prices', 'status', 'gallery', 'faq', 'about', 'contact'];

/** Footer link column. */
export const footerNav: RouteKey[] = ['prices', 'order', 'status', 'gallery', 'faq', 'warranty', 'about', 'contact'];

export const legalNav: RouteKey[] = ['accessibility', 'privacy'];

export const pathOf = (key: RouteKey) => routes[key];
