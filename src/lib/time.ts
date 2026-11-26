import { siteConfig } from '../config/site';
import type { TimeRange, WeeklyHours } from '../data/business';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ZonedParts = {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: Weekday;
  minutes: number; // minutes since midnight
};

const weekdayIndex: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Calendar parts of `date` as seen in the business time zone (Israel), whatever the visitor's zone. */
export function zonedParts(date: Date, timeZone: string = siteConfig.timeZone): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekday: weekdayIndex[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export function toMinutes(hhmm: string): number {
  const [h = '0', m = '0'] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export type OpenState = { open: true; closesAt: string } | { open: false; opensAt?: { weekday: Weekday; time: string } };

/** Is the business open at `now` (Israel time)? If closed, when does it open next (within a week)? */
export function openState(hours: WeeklyHours, now: Date = new Date()): OpenState {
  const p = zonedParts(now);
  const today: TimeRange[] = hours[p.weekday];
  for (const r of today) {
    if (p.minutes >= toMinutes(r.open) && p.minutes < toMinutes(r.close)) return { open: true, closesAt: r.close };
  }
  for (let offset = 0; offset < 8; offset++) {
    const wd = ((p.weekday + offset) % 7) as Weekday;
    const ranges = [...hours[wd]].sort((a, b) => toMinutes(a.open) - toMinutes(b.open));
    for (const r of ranges) {
      if (offset > 0 || toMinutes(r.open) > p.minutes) return { open: false, opensAt: { weekday: wd, time: r.open } };
    }
  }
  return { open: false };
}

/** Date key "YYYY-MM-DD" for a zoned calendar day. */
export function dateKey(p: Pick<ZonedParts, 'year' | 'month' | 'day'>): string {
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}
