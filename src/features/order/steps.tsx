import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pencil, Search, Smartphone, Stethoscope } from 'lucide-react';
import { routes } from '../../config/routes';
import { brands, findBrand, findModel, OTHER_BRAND_ID } from '../../data/devices';
import { business } from '../../data/business';
import { hasQualityOptions, repairById, repairs, type PartQuality, type RepairId } from '../../data/repairs';
import { PriceTag } from '../../components/PriceTag';
import { Checkbox, TextArea, TextField } from '../../components/ui/Field';
import { Icon } from '../../components/ui/Icon';
import { useNow } from '../../hooks/useNow';
import { formatDate } from '../../lib/format';
import { useLocalized } from '../../lib/localized';
import { defaultQuality, getRepairPrice, isRepairAvailable } from '../../lib/pricing';
import { matchesQuery } from '../../lib/search';
import { zonedTimeToUtc } from '../../lib/time';
import { upcomingSlotDays } from './slots';
import { detailsSchema, steps, type CustomerDetails, type OrderDraft } from './state';
import { useOrderText } from './useOrderText';

export type StepProps = {
  draft: OrderDraft;
  update: (patch: Partial<OrderDraft> | ((d: OrderDraft) => Partial<OrderDraft>)) => void;
  goTo: (step: number) => void;
  next: () => void;
};

const choiceCard = (selected: boolean) =>
  `relative flex min-h-11 w-full items-center gap-3 rounded-2xl border p-4 text-start transition-[border-color,background-color,box-shadow] ${
    selected ? 'border-accent-strong bg-accent-soft shadow-[0_0_0_1px_var(--color-accent-strong)]' : 'border-line bg-bg hover:border-muted'
  }`;

function SelectedMark({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`ms-auto grid size-6 shrink-0 place-items-center rounded-full border ${
        on ? 'border-accent-strong bg-accent-strong text-white' : 'border-line'
      }`}
    >
      {on && <Check size={16} strokeWidth={2} />}
    </span>
  );
}

/* ---------------------------------- 1. brand ---------------------------------- */

export function BrandStep({ draft, update, next }: StepProps) {
  const { t } = useTranslation('order');
  const l = useLocalized();
  const choose = (brandId: string) => {
    update((d) => (d.brandId === brandId ? {} : { brandId, modelId: null, otherModel: '' }));
    next();
  };
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[...brands.map((b) => ({ id: b.id, label: l(b.name) })), { id: OTHER_BRAND_ID, label: t('brand.other') }].map((b) => (
        <li key={b.id}>
          <button type="button" aria-pressed={draft.brandId === b.id} className={choiceCard(draft.brandId === b.id)} onClick={() => choose(b.id)}>
            <span className="text-lg font-semibold">{b.label}</span>
            <SelectedMark on={draft.brandId === b.id} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- 2. model ---------------------------------- */

export function ModelStep({ draft, update, next }: StepProps) {
  const { t } = useTranslation('order');
  const brand = findBrand(draft.brandId);
  const [q, setQ] = useState('');

  if (draft.brandId === OTHER_BRAND_ID || !brand) {
    return (
      <div className="max-w-lg">
        <TextField
          label={t('model.otherLabel')}
          hint={t('model.otherHint')}
          value={draft.otherModel}
          onChange={(e) => update({ otherModel: e.target.value })}
          autoComplete="off"
          maxLength={80}
        />
      </div>
    );
  }

  const choose = (modelId: string) => {
    const ref = findModel(modelId);
    // drop repairs that don't apply to the newly chosen model
    update((d) => ({
      modelId,
      selections: ref ? d.selections.filter((s) => isRepairAvailable(ref.model, s.repairId)) : d.selections,
    }));
    next();
  };

  return (
    <div>
      <label className="relative mb-6 block max-w-lg">
        <span className="sr-only">{t('model.search')}</span>
        <Icon icon={Search} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('model.searchPlaceholder')}
          className="min-h-12 w-full rounded-full border border-line bg-bg ps-11 pe-4"
        />
      </label>
      {brand.series.map((series) => {
        const models = series.models.filter((model) => matchesQuery({ brand, series, model }, q));
        if (models.length === 0) return null;
        return (
          <fieldset key={series.id} className="mb-6 min-w-0">
            <legend className="mb-3 text-sm font-semibold text-muted">
              <bdi>{series.name}</bdi>
            </legend>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((m) => (
                <li key={m.id}>
                  <button type="button" aria-pressed={draft.modelId === m.id} className={choiceCard(draft.modelId === m.id)} onClick={() => choose(m.id)}>
                    <bdi className="font-medium">{m.name}</bdi>
                    <SelectedMark on={draft.modelId === m.id} />
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
        );
      })}
      <button
        type="button"
        className="mt-2 inline-flex min-h-11 items-center font-medium text-accent-strong hover:underline"
        onClick={() => update({ brandId: OTHER_BRAND_ID, modelId: null })}
      >
        {t('model.notListed')}
      </button>
    </div>
  );
}

/* ---------------------------------- 3. issue ---------------------------------- */

export function IssueStep({ draft, update }: StepProps) {
  const { t } = useTranslation('order');
  const l = useLocalized();
  const model = findModel(draft.modelId)?.model;
  const list = repairs.filter((r) => r.id !== 'diagnosis' && (!model || isRepairAvailable(model, r.id)));
  const selected = (id: RepairId) => draft.selections.find((s) => s.repairId === id);

  const toggle = (id: RepairId) =>
    update((d) => ({
      selections: d.selections.some((s) => s.repairId === id)
        ? d.selections.filter((s) => s.repairId !== id)
        : [...d.selections, { repairId: id, quality: hasQualityOptions(repairById[id]) ? defaultQuality : undefined }],
    }));

  const setQuality = (id: RepairId, quality: PartQuality) =>
    update((d) => ({ selections: d.selections.map((s) => (s.repairId === id ? { ...s, quality } : s)) }));

  return (
    <div className="grid gap-6">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const sel = selected(r.id);
          const quote = model ? getRepairPrice(model, r.id, sel?.quality) : null;
          return (
            <li key={r.id} className="grid content-start gap-2">
              <button type="button" aria-pressed={Boolean(sel)} className={choiceCard(Boolean(sel))} onClick={() => toggle(r.id)}>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-accent-strong">
                  <Icon icon={r.icon} size={24} />
                </span>
                <span className="grid">
                  <span className="font-semibold">{l(r.name)}</span>
                  <span className="text-sm text-muted">
                    {quote ? <PriceTag quote={quote} /> : t('issue.priceAfterCheck')}
                    {' · '}
                    {l(r.duration)}
                  </span>
                </span>
                <SelectedMark on={Boolean(sel)} />
              </button>
              {sel && hasQualityOptions(r) && (
                <fieldset className="min-w-0 rounded-2xl bg-surface p-3">
                  <legend className="sr-only">{t('issue.qualityLegend', { repair: l(r.name) })}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['original', 'compatible'] as const).map((q) => {
                      const qQuote = model ? getRepairPrice(model, r.id, q) : null;
                      return (
                        <label
                          key={q}
                          className={`flex min-h-11 cursor-pointer flex-col justify-center rounded-xl border px-3 py-2 text-sm ${
                            sel.quality === q ? 'border-accent-strong bg-bg' : 'border-transparent'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quality-${r.id}`}
                            value={q}
                            checked={sel.quality === q}
                            onChange={() => setQuality(r.id, q)}
                            className="sr-only"
                          />
                          <span className="font-semibold">{t(`quality.${q}`)}</span>
                          {qQuote && <PriceTag quote={qQuote} className="text-muted" />}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}
            </li>
          );
        })}
      </ul>

      <button type="button" aria-pressed={Boolean(selected('diagnosis'))} className={choiceCard(Boolean(selected('diagnosis')))} onClick={() => toggle('diagnosis')}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-accent-strong">
          <Icon icon={Stethoscope} size={24} />
        </span>
        <span className="grid">
          <span className="font-semibold">{t('issue.notSure')}</span>
          <span className="text-sm text-muted">{t('issue.notSureText')}</span>
        </span>
        <SelectedMark on={Boolean(selected('diagnosis'))} />
      </button>
    </div>
  );
}

/* ---------------------------------- 4. time ---------------------------------- */

export function TimeStep({ draft, update }: StepProps) {
  const { t, i18n } = useTranslation('order');
  const now = useNow();
  const days = useMemo(() => upcomingSlotDays(business.hours, now), [now]);
  const day = days.find((d) => d.date === draft.date) ?? days[0];

  // if the saved date/time is no longer offered (time passed), clear it
  useEffect(() => {
    if (draft.date && !days.some((d) => d.date === draft.date && d.slots.some((s) => s.time === draft.time && !s.busy))) {
      update({ date: null, time: null });
    }
  }, [days, draft.date, draft.time, update]);

  if (!day) return <p>{t('time.none')}</p>;

  return (
    <div className="grid gap-8">
      <fieldset className="min-w-0">
        <legend className="mb-3 font-semibold">{t('time.day')}</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {days.map((d) => {
            const date = zonedTimeToUtc(d.date, '12:00');
            const active = d.date === day.date;
            return (
              <button
                key={d.date}
                type="button"
                aria-pressed={active}
                onClick={() => update({ date: d.date, time: d.date === draft.date ? draft.time : null })}
                className={`flex min-h-16 min-w-20 shrink-0 flex-col items-center justify-center rounded-2xl border px-3 py-2 ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-bg hover:border-muted'
                }`}
              >
                <span className="text-sm">{formatDate(date, i18n.language, { weekday: 'short' })}</span>
                <span className="text-lg font-semibold">{formatDate(date, i18n.language, { day: 'numeric', month: 'numeric' })}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className="mb-3 font-semibold">
          {t('time.time', { day: formatDate(zonedTimeToUtc(day.date, '12:00'), i18n.language, { weekday: 'long', day: 'numeric', month: 'long' }) })}
        </legend>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {day.slots.map((s) => {
            const active = draft.date === day.date && draft.time === s.time;
            return (
              <li key={s.time}>
                <button
                  type="button"
                  disabled={s.busy}
                  aria-pressed={active}
                  aria-label={s.busy ? t('time.busyLabel', { time: s.time }) : s.time}
                  onClick={() => update({ date: day.date, time: s.time })}
                  className={`flex min-h-12 w-full flex-col items-center justify-center rounded-xl border text-base font-medium ${
                    active
                      ? 'border-accent-strong bg-accent-strong text-white'
                      : s.busy
                        ? 'cursor-not-allowed border-transparent bg-surface text-muted'
                        : 'border-line bg-bg hover:border-muted'
                  }`}
                >
                  <span className={`ltr-nums ${s.busy ? 'line-through' : ''}`}>{s.time}</span>
                  {s.busy && <span className="text-xs">{t('time.busy')}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

/* ---------------------------------- 5. details ---------------------------------- */

export const DETAILS_FORM_ID = 'order-details-form';

export function DetailsStep({ draft, update, next }: StepProps) {
  const { t } = useTranslation('order');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomerDetails>({ defaultValues: draft.details, resolver: zodResolver(detailsSchema) as never, mode: 'onTouched' });

  // keep the draft in sync so a refresh doesn't lose what was typed
  useEffect(() => {
    const sub = watch((values) => update((d) => ({ details: { ...d.details, ...(values as Partial<CustomerDetails>) } })));
    return () => sub.unsubscribe();
  }, [watch, update]);

  const err = (key?: string) => (key ? t(key) : undefined);

  return (
    <form
      id={DETAILS_FORM_ID}
      noValidate
      className="grid max-w-2xl gap-4"
      onSubmit={handleSubmit((values) => {
        update({ details: values });
        next();
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={t('details.name')} autoComplete="name" error={err(errors.name?.message)} {...register('name')} />
        <TextField
          label={t('details.phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          dir="ltr"
          placeholder="050-1234567"
          className="text-end"
          hint={t('details.phoneHint')}
          error={err(errors.phone?.message)}
          {...register('phone')}
        />
      </div>
      <TextField
        label={t('details.email')}
        optional={t('details.optional')}
        type="email"
        autoComplete="email"
        dir="ltr"
        className="text-end"
        error={err(errors.email?.message)}
        {...register('email')}
      />
      <TextArea
        label={t('details.notes')}
        optional={t('details.optional')}
        hint={t('details.notesHint')}
        error={err(errors.notes?.message)}
        maxLength={500}
        {...register('notes')}
      />
      <div className="grid gap-1 pt-2">
        <Checkbox
          label={
            <>
              {t('details.consentPrivacy')}{' '}
              <Link to={routes.privacy} target="_blank" className="font-medium text-accent-strong underline">
                {t('details.privacyLink')}
              </Link>
            </>
          }
          error={err(errors.consentPrivacy?.message)}
          {...register('consentPrivacy')}
        />
        <Checkbox label={t('details.consentBackup')} error={err(errors.consentBackup?.message)} {...register('consentBackup')} />
      </div>
      <p className="text-sm text-muted">{t('details.noPasscode')}</p>
    </form>
  );
}

/* ---------------------------------- 6. summary ---------------------------------- */

export function SummaryStep({ draft, goTo }: StepProps) {
  const { t } = useTranslation('order');
  const text = useOrderText();
  const rows: { label: string; value: string; step: (typeof steps)[number] }[] = [
    { label: t('summary.device'), value: text.deviceName(draft), step: 'model' },
    { label: t('summary.repairs'), value: text.repairsText(draft.selections), step: 'issue' },
    { label: t('summary.appointment'), value: draft.date && draft.time ? text.appointmentText(draft.date, draft.time) : '', step: 'time' },
    {
      label: t('summary.contact'),
      value: [draft.details.name, draft.details.phone, draft.details.email].filter(Boolean).join(' · '),
      step: 'details',
    },
  ];
  if (draft.details.notes.trim()) rows.push({ label: t('summary.notes'), value: draft.details.notes, step: 'details' });

  return (
    <dl className="card divide-y divide-line">
      {rows.map((r) => (
        <div key={r.label} className="flex items-start gap-4 p-5">
          <Icon icon={r.step === 'model' ? Smartphone : Check} className="mt-1 text-muted" />
          <div className="flex-1">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="mt-0.5 font-medium break-words whitespace-pre-line">
              <bdi>{r.value}</bdi>
            </dd>
          </div>
          <button
            type="button"
            onClick={() => goTo(steps.indexOf(r.step))}
            className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-accent-strong hover:bg-accent-soft"
            aria-label={t('summary.editLabel', { section: r.label })}
          >
            <Icon icon={Pencil} />
            {t('summary.edit')}
          </button>
        </div>
      ))}
    </dl>
  );
}
