import { useTranslation } from 'react-i18next';
import { Check, ShieldCheck, X } from 'lucide-react';
import { warranty } from '../../data/warranty';
import { routes } from '../../config/routes';
import { Seo } from '../../components/Seo';
import { ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { useLocalized } from '../../lib/localized';

export default function WarrantyPage() {
  const { t } = useTranslation('warranty');
  const l = useLocalized();
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description', { original: warranty.originalPartMonths, compatible: warranty.compatiblePartMonths })} />
      <section className="container-page section">
        <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            { months: warranty.originalPartMonths, key: 'original' },
            { months: warranty.compatiblePartMonths, key: 'compatible' },
          ].map((w) => (
            <div key={w.key} className="card flex items-center gap-5 p-6 sm:p-8">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                <Icon icon={ShieldCheck} size={24} />
              </span>
              <div>
                <p className="text-3xl font-bold">{t('months', { count: w.months })}</p>
                <p className="text-muted">{t(`period.${w.key}`)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{t('fromDate')}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="covered">
            <h2 id="covered" className="text-2xl font-bold">
              {t('covered')}
            </h2>
            <ul className="mt-5 grid gap-3">
              {warranty.covered.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-success-soft text-success-ink">
                    <Check size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span>{l(c)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="not-covered">
            <h2 id="not-covered" className="text-2xl font-bold">
              {t('notCovered')}
            </h2>
            <ul className="mt-5 grid gap-3">
              {warranty.notCovered.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-danger-soft text-danger-ink">
                    <X size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span>{l(c)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="how" className="mt-14 rounded-(--radius-card) bg-surface p-6 sm:p-10">
          <h2 id="how" className="text-2xl font-bold">
            {t('howTitle')}
          </h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {warranty.howToClaim.map((s, i) => (
              <li key={i}>
                <span className="grid size-10 place-items-center rounded-full bg-ink font-semibold text-white">{i + 1}</span>
                <p className="mt-3">{l(s)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={routes.contact}>{t('contact')}</ButtonLink>
            <ButtonLink to={routes.status} variant="secondary">
              {t('status')}
            </ButtonLink>
          </div>
        </section>
      </section>
    </>
  );
}
