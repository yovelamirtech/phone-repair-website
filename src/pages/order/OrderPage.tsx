import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { findModel } from '../../data/devices';
import { Seo } from '../../components/Seo';
import { Button } from '../../components/ui/Button';
import { buttonClass } from '../../components/ui/buttonClass';
import { Icon } from '../../components/ui/Icon';
import { estimateOrder, type Estimate } from '../../lib/pricing';
import { submitOrder } from '../../services/orders';
import { Confirmation, type ConfirmedOrder } from '../../features/order/Confirmation';
import {
  draftFromParams,
  loadSavedDraft,
  stepComplete,
  steps,
  useOrderDraft,
  type OrderDraft,
} from '../../features/order/state';
import {
  BrandStep,
  DETAILS_FORM_ID,
  DetailsStep,
  IssueStep,
  ModelStep,
  SummaryStep,
  TimeStep,
  type StepProps,
} from '../../features/order/steps';
import { useOrderText } from '../../features/order/useOrderText';

const stepComponents: Record<(typeof steps)[number], (p: StepProps) => React.ReactNode> = {
  brand: BrandStep,
  model: ModelStep,
  issue: IssueStep,
  time: TimeStep,
  details: DetailsStep,
  summary: SummaryStep,
};

function currentEstimate(d: OrderDraft): Estimate | null {
  const ref = findModel(d.modelId);
  if (!ref || d.selections.length === 0) {
    // unknown model: only "diagnosis" can be priced (free)
    return d.selections.length > 0 && d.selections.every((s) => s.repairId === 'diagnosis')
      ? { total: 0, startingFrom: false, free: true, lines: [] }
      : null;
  }
  return estimateOrder(ref.model, d.selections);
}

export default function OrderPage() {
  const { t } = useTranslation('order');
  const [params, setParams] = useSearchParams();
  const [initialParams] = useState(() => new URLSearchParams(params));
  const { draft, update, reset } = useOrderDraft(() => {
    const saved = loadSavedDraft();
    return draftFromParams(initialParams, saved) ?? saved;
  });
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const text = useOrderText();

  // the URL params are only a starting point; afterwards the session draft is the source of truth
  useEffect(() => {
    if (initialParams.toString()) setParams({}, { replace: true });
  }, [initialParams, setParams]);

  const stepIndex = Math.min(Math.max(draft.step, 0), steps.length - 1);
  const stepId = steps[stepIndex]!;

  // on step change: scroll to the top of the wizard and move focus to the step heading
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [stepIndex]);

  const goTo = useCallback(
    (step: number) => {
      setError('');
      update({ step });
    },
    [update],
  );
  const next = useCallback(() => {
    setError('');
    update((d) => ({ step: Math.min(d.step + 1, steps.length - 1) }));
  }, [update]);

  const onNext = () => {
    if (!stepComplete(stepId, draft)) {
      setError(t(`errors.step.${stepId}`));
      return;
    }
    next();
  };

  const onSubmit = async () => {
    for (const s of steps) {
      if (!stepComplete(s, draft)) {
        goTo(steps.indexOf(s));
        return;
      }
    }
    setSubmitting(true);
    setError('');
    try {
      const estimate = currentEstimate(draft);
      const { orderNumber } = await submitOrder({
        brandId: draft.brandId!,
        modelId: draft.modelId,
        deviceName: text.deviceName(draft),
        repairs: draft.selections,
        estimate: estimate && { total: estimate.total, startingFrom: estimate.startingFrom, free: estimate.free },
        appointment: { date: draft.date!, time: draft.time! },
        customer: {
          name: draft.details.name.trim(),
          phone: draft.details.phone.trim(),
          email: draft.details.email.trim() || undefined,
          notes: draft.details.notes.trim() || undefined,
        },
        consents: { privacy: draft.details.consentPrivacy, backup: draft.details.consentBackup },
      });
      setConfirmed({ orderNumber, draft, estimate });
      reset();
      window.scrollTo({ top: 0 });
    } catch {
      setError(t('errors.submit'));
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <>
        <Seo title={t('confirm.title')} description={t('seo.description')} />
        <section className="container-page section">
          <Confirmation order={confirmed} />
        </section>
      </>
    );
  }

  const StepComponent = stepComponents[stepId];
  const estimate = currentEstimate(draft);
  const showEstimate = stepIndex >= steps.indexOf('issue');
  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page pt-10 pb-40 sm:pt-14">
        <p className="text-sm font-semibold text-accent-strong">{t('title')}</p>

        {/* progress */}
        <div className="mt-3">
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={stepIndex + 1}
            aria-valuetext={t('progress', { current: stepIndex + 1, total: steps.length, name: t(`steps.${stepId}.name`) })}
            aria-label={t('progressLabel')}
            className="h-1.5 overflow-hidden rounded-full bg-surface"
          >
            <div className="h-full rounded-full bg-accent-strong transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <ol className="mt-3 hidden gap-2 text-sm sm:flex">
            {steps.map((s, i) => (
              <li key={s} className={`flex-1 ${i === stepIndex ? 'font-semibold text-ink' : 'text-muted'}`} aria-current={i === stepIndex ? 'step' : undefined}>
                {i < stepIndex ? (
                  <button type="button" className="underline-offset-4 hover:underline" onClick={() => goTo(i)}>
                    {t(`steps.${s}.name`)}
                  </button>
                ) : (
                  t(`steps.${s}.name`)
                )}
              </li>
            ))}
          </ol>
        </div>

        <h1 ref={headingRef} tabIndex={-1} className="mt-8 scroll-mt-24 text-3xl font-bold tracking-tight outline-none sm:text-4xl">
          <span className="sr-only">{t('progress', { current: stepIndex + 1, total: steps.length, name: '' })} </span>
          {t(`steps.${stepId}.title`)}
        </h1>
        <p className="mt-2 mb-8 text-lg text-muted">{t(`steps.${stepId}.subtitle`)}</p>

        <StepComponent draft={draft} update={update} goTo={goTo} next={next} />
      </section>

      {/* sticky action bar: back · estimate · next */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 backdrop-blur-xl">
        <div className="container-page py-3">
          <p className="min-h-0 pb-2 text-center text-sm font-medium text-danger-ink empty:hidden" role="alert">
            {error}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => goTo(stepIndex - 1)}
              disabled={stepIndex === 0 || submitting}
              aria-label={t('nav.back')}
              className="!px-3 sm:!px-5"
            >
              <Icon icon={ArrowLeft} directional />
              <span className="hidden sm:inline">{t('nav.back')}</span>
            </Button>

            <div className="flex-1 text-center" aria-live="polite">
              {showEstimate && (
                <>
                  <p className="text-xs text-muted sm:text-sm">{t('estimate.label')}</p>
                  <p className="text-lg leading-tight font-bold">{text.estimateText(estimate)}</p>
                </>
              )}
            </div>

            {stepId === 'details' ? (
              <button type="submit" form={DETAILS_FORM_ID} className={buttonClass('primary', 'md')}>
                {t('nav.next')}
                <Icon icon={ArrowRight} directional />
              </button>
            ) : stepId === 'summary' ? (
              <Button onClick={() => void onSubmit()} disabled={submitting} aria-busy={submitting}>
                {submitting && <LoaderCircle size={20} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />}
                {submitting ? t('nav.sending') : t('nav.submit')}
              </Button>
            ) : (
              <Button onClick={onNext}>
                {t('nav.next')}
                <Icon icon={ArrowRight} directional />
              </Button>
            )}
          </div>
          {showEstimate && <p className="mt-1 hidden text-center text-xs text-muted sm:block">{t('estimate.note')}</p>}
        </div>
      </div>
    </>
  );
}
