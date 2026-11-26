import { useTranslation } from 'react-i18next';
import { siteConfig } from '../config/site';

/** Thin strip shown on every page while demo mode is on. */
export function DemoBanner() {
  const { t } = useTranslation();
  if (!siteConfig.demoMode) return null;
  return (
    <div className="bg-ink px-4 py-1.5 text-center text-xs font-medium text-white sm:text-sm" role="note">
      {t('demo.banner')}
    </div>
  );
}
