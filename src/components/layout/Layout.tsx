import { Outlet, ScrollRestoration } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DemoBanner } from '../DemoBanner';
import { StructuredData } from '../StructuredData';
import { WhatsAppFab } from '../WhatsApp';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        {t('a11y.skipToContent')}
      </a>
      <DemoBanner />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <StructuredData />
      <ScrollRestoration />
    </div>
  );
}

/** Shown while the first page chunk loads. */
export function PageFallback() {
  return <div className="min-h-dvh" aria-busy="true" />;
}
