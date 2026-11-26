import { useTranslation } from 'react-i18next';
import { statusSteps } from '../data/statusSteps';
import type { OrderStatus } from '../services/orders';
import { formatDate } from '../lib/format';
import { Icon } from './ui/Icon';

/** Vertical timeline of all status steps; reached steps are filled, the current one is highlighted. */
export function StatusTimeline({ status }: { status: OrderStatus }) {
  const { t, i18n } = useTranslation('status');
  const reachedAt = new Map(status.history.map((h) => [h.id, h.at]));
  const currentIndex = statusSteps.findIndex((s) => s.id === status.current);

  return (
    <ol className="relative grid gap-0">
      {statusSteps.map((step, i) => {
        const at = reachedAt.get(step.id);
        const done = i < currentIndex;
        const current = i === currentIndex;
        const skipped = !at && i < currentIndex;
        const last = i === statusSteps.length - 1;
        return (
          <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0" aria-current={current ? 'step' : undefined}>
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute start-5 top-11 -bottom-0 w-0.5 -translate-x-1/2 rtl:translate-x-1/2 ${i < currentIndex ? 'bg-accent-strong' : 'bg-line'}`}
              />
            )}
            <span
              className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 ${
                current
                  ? 'border-accent-strong bg-accent-strong text-white'
                  : done
                    ? 'border-accent-strong bg-accent-soft text-accent-strong'
                    : 'border-line bg-bg text-muted'
              }`}
            >
              <Icon icon={step.icon} />
            </span>
            <div className="pt-1.5">
              <p className={`font-semibold ${current ? 'text-ink' : done ? 'text-ink' : 'text-muted'}`}>
                {t(`steps.${step.id}.name`)}
                <span className="sr-only">
                  {' — '}
                  {current ? t('timeline.current') : done || skipped ? t('timeline.done') : t('timeline.upcoming')}
                </span>
              </p>
              {current && <p className="mt-1 text-muted">{t(`steps.${step.id}.text`)}</p>}
              {at && (
                <p className="mt-0.5 text-sm text-muted">
                  {formatDate(new Date(at), i18n.language, { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
