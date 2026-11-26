import { Outlet, ScrollRestoration } from 'react-router';
import { useTranslation } from 'react-i18next';

export function Layout() {
  const { t } = useTranslation();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        {t('a11y.skipToContent')}
      </a>
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}
