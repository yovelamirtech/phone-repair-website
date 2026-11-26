/**
 * Appointment slots, derived from the business opening hours (Israel time).
 * Some slots are marked "busy" by a fixed hash of date+time, so the demo looks real
 * and doesn't change on refresh.
 */
import type { WeeklyHours } from '../../data/business';
import { dateKey, fromMinutes, toMinutes, zonedParts, type Weekday } from '../../lib/time';

export const SLOT_MINUTES = 30;
/** Share of slots shown as already booked in the demo. */
export const BUSY_RATIO = 0.3;

export type Slot = { time: string; busy: boolean };
export type SlotDay = { date: string; weekday: Weekday; slots: Slot[] };

/** Small deterministic string hash (FNV-1a), 0..2^32-1. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function isBusy(date: string, time: string): boolean {
  return hash(`${date}T${time}`) % 100 < BUSY_RATIO * 100;
}

/** All slot start times for a day's hours: every 30 minutes, the last one ends at closing time. */
export function slotTimes(hours: WeeklyHours, weekday: Weekday): string[] {
  return hours[weekday].flatMap((r) => {
    const out: string[] = [];
    for (let m = toMinutes(r.open); m + SLOT_MINUTES <= toMinutes(r.close); m += SLOT_MINUTES) out.push(fromMinutes(m));
    return out;
  });
}

/**
 * The next `count` working days (days with at least one future slot), starting today.
 * Slots that already started are left out.
 */
export function upcomingSlotDays(hours: WeeklyHours, now: Date, count = 7): SlotDay[] {
  const today = zonedParts(now);
  const days: SlotDay[] = [];
  for (let offset = 0; days.length < count && offset < 31; offset++) {
    // calendar arithmetic on a UTC-noon anchor of Israel's "today" (immune to DST)
    const d = new Date(Date.UTC(today.year, today.month - 1, today.day + offset, 12));
    const weekday = d.getUTCDay() as Weekday;
    const date = dateKey({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });
    const times = slotTimes(hours, weekday).filter((t) => offset > 0 || toMinutes(t) > today.minutes);
    if (times.length === 0) continue;
    days.push({ date, weekday, slots: times.map((time) => ({ time, busy: isBusy(date, time) })) });
  }
  return days;
}
