import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

/** Shown when a page crashes or its code chunk fails to load (e.g. after a new deploy). */
export function RouteError() {
  const { t } = useTranslation();
  return (
    <main className="container-page section text-center">
      <h1 className="text-3xl font-bold sm:text-4xl">{t('error.title')}</h1>
      <p className="mt-4 text-muted">{t('error.text')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-11 rounded-full bg-accent-strong px-6 font-semibold text-white"
        >
          {t('error.reload')}
        </button>
        <Link to="/" reloadDocument className="inline-flex min-h-11 items-center rounded-full border border-line px-6 font-semibold">
          {t('nav.home')}
        </Link>
      </div>
    </main>
  );
}
