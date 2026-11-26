import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { asset } from '../lib/paths';

/** Text logo (graphic file). TEMPORARY: regenerate or replace public/images/logo.svg with the real logo. */
export function Logo({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={`inline-flex min-h-11 items-center ${className}`} aria-label={t('header.logoLabel')}>
      <img src={asset('images/logo.svg')} alt="" width={148} height={44} className="h-9 w-auto" />
    </Link>
  );
}
