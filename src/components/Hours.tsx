import { useTranslation } from 'react-i18next';
import { business } from '../data/business';
import { useNow } from '../hooks/useNow';
import { weekdayName } from '../lib/format';
import { openState, zonedParts, type Weekday } from '../lib/time';

/** "Open now · until 19:00" / "Closed now · opens Sunday at 09:00" */
export function OpenNowBadge({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const now = useNow();
  const state = openState(business.hours, now);
  const today = zonedParts(now).weekday;
  let detail = '';
  if (state.open) detail = t('hours.closesAt', { time: state.closesAt });
  else if (state.opensAt) {
    const day =
      state.opensAt.weekday === today
        ? t('hours.today')
        : state.opensAt.weekday === (today + 1) % 7
          ? t('hours.tomorrow')
          : weekdayName(state.opensAt.weekday, i18n.language);
    detail = t('hours.opensAt', { day, time: state.opensAt.time });
  }
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 text-sm ${className}`}>
      <span className={`inline-flex items-center gap-1.5 font-semibold ${state.open ? 'text-success-ink' : 'text-danger-ink'}`}>
        <span aria-hidden="true" className={`size-2 rounded-full ${state.open ? 'bg-success' : 'bg-danger'}`} />
        {state.open ? t('hours.openNow') : t('hours.closedNow')}
      </span>
      {detail && <span className="text-muted">{detail}</span>}
    </span>
  );
}

/** Weekly hours table, grouped (Sun–Thu share the same hours). Today's row is highlighted. */
export function HoursTable({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const today = zonedParts(useNow()).weekday;
  const days: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

  // group consecutive days with identical hours
  type Group = { from: Weekday; to: Weekday; label: string };
  const groups: Group[] = [];
  for (const d of days) {
    const ranges = business.hours[d];
    const label = ranges.length ? ranges.map((r) => `${r.open}–${r.close}`).join(', ') : t('hours.closed');
    const last = groups[groups.length - 1];
    if (last && last.label === label && last.to === d - 1) last.to = d;
    else groups.push({ from: d, to: d, label });
  }

  return (
    <dl className={`grid gap-1.5 text-base ${className}`}>
      {groups.map((g) => {
        const isToday = today >= g.from && today <= g.to;
        const name =
          g.from === g.to
            ? weekdayName(g.from, i18n.language)
            : `${weekdayName(g.from, i18n.language)}–${weekdayName(g.to, i18n.language)}`;
        return (
          <div key={g.from} className={`flex justify-between gap-6 ${isToday ? 'font-semibold text-ink' : 'text-muted'}`}>
            <dt>{name}</dt>
            <dd className="ltr-nums">{g.label}</dd>
          </div>
        );
      })}
    </dl>
  );
}
