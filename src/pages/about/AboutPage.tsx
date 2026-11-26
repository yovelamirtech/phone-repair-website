import { useTranslation } from 'react-i18next';
import { BadgeCheck, ShieldCheck, Stethoscope, type LucideIcon } from 'lucide-react';
import { routes } from '../../config/routes';
import { business } from '../../data/business';
import { averageRating } from '../../data/reviews';
import { warranty } from '../../data/warranty';
import { Photo } from '../../components/Photo';
import { Seo } from '../../components/Seo';
import { ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { formatNumber } from '../../lib/format';
import { useLocalized } from '../../lib/localized';

const values: { key: string; icon: LucideIcon }[] = [
  { key: 'transparency', icon: BadgeCheck },
  { key: 'diagnosis', icon: Stethoscope },
  { key: 'warranty', icon: ShieldCheck },
];

/** TEMPORARY numbers for the demo. */
const stats = [
  { key: 'repairs', value: 3000, suffix: '+' },
  { key: 'years', value: business.technician.yearsOfExperience, suffix: '' },
  { key: 'rating', value: Math.round(averageRating * 10) / 10, suffix: '' },
  { key: 'sameDay', value: 85, suffix: '%' },
];

export default function AboutPage() {
  const { t, i18n } = useTranslation('about');
  const l = useLocalized();
  const name = l(business.technician.name);
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading as="h1" eyebrow={t('eyebrow')} title={t('title')} />
          <div className="mt-6 grid gap-4 text-lg text-muted">
            <p>{t('story.p1', { name, years: business.technician.yearsOfExperience })}</p>
            <p>{t('story.p2')}</p>
            <p>{t('story.p3', { city: l(business.address.city) })}</p>
          </div>
        </div>
        <Photo
          name="about-workbench"
          alt={t('imageAlt')}
          sizes="(min-width: 1024px) 560px, 100vw"
          priority
          className="aspect-[4/3] w-full rounded-(--radius-card) object-cover"
        />
      </section>

      <Reveal as="section" className="bg-surface section" aria-labelledby="stats-title">
        <div className="container-page">
          <h2 id="stats-title" className="sr-only">
            {t('stats.title')}
          </h2>
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.key} className="flex flex-col-reverse text-center">
                <dt className="mt-2 text-muted">{t(`stats.${s.key}`)}</dt>
                <dd className="text-4xl font-bold tracking-tight sm:text-5xl">
                  <span className="ltr-nums">
                    {formatNumber(s.value, i18n.language)}
                    {s.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-xs text-muted">{t('stats.note')}</p>
        </div>
      </Reveal>

      <Reveal as="section" className="section" aria-labelledby="values-title">
        <div className="container-page">
          <SectionHeading id="values-title" title={t('values.title')} align="center" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <li key={v.key} className="card p-6 sm:p-8">
                <Icon icon={v.icon} size={24} className="text-accent-strong" />
                <h3 className="mt-4 text-xl font-semibold">{t(`values.${v.key}.title`, { months: warranty.originalPartMonths })}</h3>
                <p className="mt-2 text-muted">{t(`values.${v.key}.text`)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <ButtonLink to={routes.order} size="lg">
              {t('ctaOrder')}
            </ButtonLink>
            <ButtonLink to={routes.contact} size="lg" variant="secondary">
              {t('ctaContact')}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </>
  );
}
