import { createBrowserRouter, type RouteObject } from 'react-router';
import { Layout, PageFallback } from './components/layout/Layout';
import { RouteError } from './components/layout/RouteError';
import HomePage from './pages/home/HomePage';
import { routes } from './config/routes';

type PageModule = { default: React.ComponentType };
const page = (loader: () => Promise<PageModule>) => async () => ({ Component: (await loader()).default });

/** Home is bundled with the app shell; every other page is its own chunk. */
const children: RouteObject[] = [
  { index: true, Component: HomePage },
  { path: routes.prices.slice(1), lazy: page(() => import('./pages/prices/PricesPage')) },
  { path: routes.order.slice(1), lazy: page(() => import('./pages/order/OrderPage')) },
  { path: routes.status.slice(1), lazy: page(() => import('./pages/status/StatusPage')) },
  { path: routes.about.slice(1), lazy: page(() => import('./pages/about/AboutPage')) },
  { path: routes.gallery.slice(1), lazy: page(() => import('./pages/gallery/GalleryPage')) },
  { path: routes.faq.slice(1), lazy: page(() => import('./pages/faq/FaqPage')) },
  { path: routes.warranty.slice(1), lazy: page(() => import('./pages/warranty/WarrantyPage')) },
  { path: routes.contact.slice(1), lazy: page(() => import('./pages/contact/ContactPage')) },
  { path: routes.accessibility.slice(1), lazy: page(() => import('./pages/accessibility/AccessibilityPage')) },
  { path: routes.privacy.slice(1), lazy: page(() => import('./pages/privacy/PrivacyPage')) },
  { path: '*', lazy: page(() => import('./pages/not-found/NotFoundPage')) },
];

export const router = createBrowserRouter(
  [{ path: '/', Component: Layout, ErrorBoundary: RouteError, HydrateFallback: PageFallback, children }],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
