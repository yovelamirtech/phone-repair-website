import { useTranslation } from 'react-i18next';
import { business } from '../../data/business';
import { ProsePage } from '../../components/ProsePage';
import { Seo } from '../../components/Seo';
import { formatDate } from '../../lib/format';
import { useLocalized } from '../../lib/localized';
import { zonedTimeToUtc } from '../../lib/time';

export default function AccessibilityPage() {
  const { t, i18n } = useTranslation('accessibility');
  const l = useLocalized();
  const c = business.accessibilityCoordinator;
  const updated = formatDate(zonedTimeToUtc(business.accessibilityStatementUpdated, '12:00'), i18n.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <ProsePage ns="accessibility" values={{ updated }}>
        <div className="card mt-8 p-6">
          <h2 className="text-xl font-semibold">{t('coordinator.title')}</h2>
          <dl className="mt-3 grid gap-1 text-lg">
            <div className="flex gap-2">
              <dt className="text-muted">{t('coordinator.name')}:</dt>
              <dd>{l(c.name)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">{t('coordinator.phone')}:</dt>
              <dd>
                <a href={`tel:${c.phone.replace(/-/g, '')}`} className="ltr-nums text-accent-strong underline">
                  {c.phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">{t('coordinator.email')}:</dt>
              <dd>
                <a href={`mailto:${c.email}`} className="ltr-nums text-accent-strong underline">
                  {c.email}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">{t('updated', { updated })}</p>
        </div>
      </ProsePage>
    </>
  );
}
