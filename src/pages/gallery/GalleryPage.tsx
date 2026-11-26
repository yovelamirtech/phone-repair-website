import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gallery } from '../../data/gallery';
import { repairById, type RepairId } from '../../data/repairs';
import { BeforeAfter } from '../../components/BeforeAfter';
import { Seo } from '../../components/Seo';
import { ButtonLink } from '../../components/ui/Button';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { routes } from '../../config/routes';
import { useLocalized } from '../../lib/localized';

const chip = (active: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
    active ? 'border-ink bg-ink text-white' : 'border-line bg-bg hover:border-muted'
  }`;

export default function GalleryPage() {
  const { t } = useTranslation('gallery');
  const l = useLocalized();
  const [params, setParams] = useSearchParams();
  const filter = params.get('repair') ?? '';
  const repairTypes = [...new Set(gallery.map((g) => g.repair))] as RepairId[];
  const items = gallery.filter((g) => !filter || g.repair === filter);

  const setFilter = (value: string) =>
    setParams(value ? { repair: value } : {}, { replace: true, preventScrollReset: true });

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section">
        <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t('filterLabel')}>
          <button type="button" className={chip(!filter)} aria-pressed={!filter} onClick={() => setFilter('')}>
            {t('all')}
          </button>
          {repairTypes.map((r) => (
            <button key={r} type="button" className={chip(filter === r)} aria-pressed={filter === r} onClick={() => setFilter(r)}>
              {l(repairById[r].name)}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">{t('hint')}</p>

        <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {items.map((g) => (
            <li key={g.id}>
              <BeforeAfter
                label={l(g.title)}
                before={{ image: g.before.image, alt: l(g.before.alt) }}
                after={{ image: g.after.image, alt: l(g.after.alt) }}
              />
              <p className="mt-3 text-lg font-semibold">{l(g.title)}</p>
              <p className="text-sm text-muted">{l(repairById[g.repair].name)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 text-center">
          <p className="text-xl font-semibold">{t('cta')}</p>
          <ButtonLink to={routes.order} size="lg" className="mt-4">
            {t('ctaButton')}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
