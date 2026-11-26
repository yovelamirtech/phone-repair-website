import { useDeferredValue, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, X } from 'lucide-react';
import { allModels, brands, type ModelRef } from '../../data/devices';
import { hasQualityOptions, repairById, repairs, type RepairId } from '../../data/repairs';
import { orderLink } from '../../features/order/orderLink';
import { PriceTag } from '../../components/PriceTag';
import { Seo } from '../../components/Seo';
import { ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { useLocalized } from '../../lib/localized';
import { getRepairPrice, isRepairAvailable } from '../../lib/pricing';
import { matchesQuery } from '../../lib/search';

const chip = (active: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors ${
    active ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink hover:border-muted'
  }`;

export default function PricesPage() {
  const { t } = useTranslation('prices');
  const l = useLocalized();
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const brandId = params.get('brand') ?? '';
  const repairParam = params.get('repair') ?? '';
  const repairId = (repairParam in repairById ? repairParam : '') as RepairId | '';
  const deferredQ = useDeferredValue(q);

  /** Update one URL param (replace, so typing doesn't flood the history). */
  const setParam = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  const results = useMemo(
    () =>
      allModels.filter(
        (ref) =>
          (!brandId || ref.brand.id === brandId) &&
          (!repairId || isRepairAvailable(ref.model, repairId)) &&
          matchesQuery(ref, deferredQ),
      ),
    [brandId, repairId, deferredQ],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, ModelRef[]>();
    for (const ref of results) map.set(ref.brand.id, [...(map.get(ref.brand.id) ?? []), ref]);
    return [...map.entries()].map(([id, refs]) => ({ brand: refs[0]!.brand, refs, id }));
  }, [results]);

  const hasFilters = Boolean(q || brandId || repairId);

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page pt-12 pb-8 sm:pt-16">
        <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />
      </section>

      {/* filters */}
      <section aria-label={t('filters.label')} className="z-30 border-y border-line bg-white/85 backdrop-blur-xl sm:sticky sm:top-16">
        <div className="container-page grid gap-3 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t('filters.search')}</span>
              <Icon icon={Search} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
                placeholder={t('filters.searchPlaceholder')}
                className="min-h-12 w-full rounded-full border border-line bg-bg ps-11 pe-4 text-base placeholder:text-muted focus:border-accent"
              />
            </label>
            <label className="sm:w-64">
              <span className="sr-only">{t('filters.repair')}</span>
              <select
                value={repairId}
                onChange={(e) => setParam('repair', e.target.value)}
                className="min-h-12 w-full cursor-pointer rounded-full border border-line bg-bg px-4 text-base"
              >
                <option value="">{t('filters.allRepairs')}</option>
                {repairs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {l(r.name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t('filters.brand')}>
            <button type="button" className={chip(!brandId)} aria-pressed={!brandId} onClick={() => setParam('brand', '')}>
              {t('filters.allBrands')}
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={chip(brandId === b.id)}
                aria-pressed={brandId === b.id}
                onClick={() => setParam('brand', brandId === b.id ? '' : b.id)}
              >
                {l(b.name)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10" aria-live="polite" aria-busy={q !== deferredQ}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-muted">
          <p>{t('results.count', { count: results.length })}</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams({}, { replace: true, preventScrollReset: true })}
              className="inline-flex min-h-11 items-center gap-1 font-medium text-accent-strong hover:underline"
            >
              <Icon icon={X} />
              {t('filters.clear')}
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="card mx-auto max-w-xl p-8 text-center">
            <h2 className="text-2xl font-semibold">{t('results.emptyTitle')}</h2>
            <p className="mt-2 text-muted">{t('results.emptyText')}</p>
            <ButtonLink to={orderLink()} className="mt-6">
              {t('results.emptyCta')}
            </ButtonLink>
          </div>
        ) : (
          grouped.map((g) => (
            <div key={g.id} className="mb-12">
              <h2 className="mb-4 text-2xl font-bold">{l(g.brand.name)}</h2>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {g.refs.map((ref) => (
                  <ModelCard key={ref.model.id} modelRef={ref} onlyRepair={repairId || undefined} />
                ))}
              </ul>
            </div>
          ))
        )}

        <p className="mt-4 text-sm text-muted">{t('notes.vat')}</p>
        <p className="text-sm text-muted">{t('notes.final')}</p>
      </section>
    </>
  );
}

function ModelCard({ modelRef, onlyRepair }: { modelRef: ModelRef; onlyRepair?: RepairId }) {
  const { t } = useTranslation('prices');
  const l = useLocalized();
  const { model, series } = modelRef;
  const list = repairs.filter((r) => (!onlyRepair || r.id === onlyRepair) && isRepairAvailable(model, r.id));

  return (
    <li className="card flex flex-col p-5 [content-visibility:auto] [contain-intrinsic-size:auto_420px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">
            <bdi>{model.name}</bdi>
          </h3>
          <p className="text-sm text-muted">
            <bdi>{series.name}</bdi> · {model.year}
          </p>
        </div>
        <Link
          to={orderLink({ model: model.id, repair: onlyRepair })}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold text-accent-strong hover:bg-accent-soft"
          aria-label={t('card.orderFor', { model: model.name })}
        >
          {t('card.order')}
          <Icon icon={ArrowRight} directional />
        </Link>
      </div>
      <table className="mt-4 w-full text-[0.95rem]">
        <caption className="sr-only">{t('card.caption', { model: model.name })}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{t('card.repair')}</th>
            <th scope="col">{t('card.price')}</th>
            <th scope="col">{t('card.order')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {list.map((r) => {
            const rows = hasQualityOptions(r) ? (['original', 'compatible'] as const) : ([undefined] as const);
            return rows.map((quality) => {
              const quote = getRepairPrice(model, r.id, quality);
              if (!quote) return null;
              const label = quality ? `${l(r.name)} · ${t(`quality.${quality}`)}` : l(r.name);
              return (
                <tr key={`${r.id}-${quality ?? ''}`}>
                  <th scope="row" className="py-2 text-start font-normal">
                    <span className="flex items-center gap-2">
                      <Icon icon={r.icon} className="text-muted" />
                      {label}
                    </span>
                  </th>
                  <td className="py-2 text-end font-semibold whitespace-nowrap">
                    <PriceTag quote={quote} />
                  </td>
                  <td className="w-12 py-1 text-end">
                    <Link
                      to={orderLink({ model: model.id, repair: r.id, quality })}
                      className="inline-grid size-11 place-items-center rounded-full text-accent-strong hover:bg-accent-soft"
                      aria-label={t('card.orderRepair', { repair: label, model: model.name })}
                    >
                      <Icon icon={ArrowRight} directional />
                    </Link>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </li>
  );
}
