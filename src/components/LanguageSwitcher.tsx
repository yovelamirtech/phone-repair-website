import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { siteConfig } from '../config/site';
import { Icon } from './ui/Icon';

/** Hidden automatically while only one language is enabled (src/config/site.ts). */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  if (siteConfig.enabledLanguages.length < 2) return null;
  return (
    <label className={`relative inline-flex min-h-11 items-center gap-1.5 text-sm ${className}`}>
      <Icon icon={Globe} />
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={i18n.resolvedLanguage}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-11 cursor-pointer appearance-none rounded-full bg-transparent pe-2 font-medium"
      >
        {siteConfig.enabledLanguages.map((lng) => (
          <option key={lng} value={lng}>
            {t(`language.${lng}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
