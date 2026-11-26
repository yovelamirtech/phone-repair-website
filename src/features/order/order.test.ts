import { describe, expect, it } from 'vitest';
import { business, type WeeklyHours } from '../../data/business';
import { openState, zonedTimeToUtc } from '../../lib/time';
import { generateOrderNumber, isOrderNumber, normalizeOrderNumber } from './orderNumber';
import { isBusy, slotTimes, upcomingSlotDays } from './slots';

/** Build a Date from Israel wall-clock time. */
const il = (date: string, time: string) => zonedTimeToUtc(date, time);

describe('zonedTimeToUtc', () => {
  it('handles Israel winter (UTC+2) and summer (UTC+3) time', () => {
    expect(il('2026-01-15', '10:00').toISOString()).toBe('2026-01-15T08:00:00.000Z');
    expect(il('2026-07-15', '10:00').toISOString()).toBe('2026-07-15T07:00:00.000Z');
  });
});

describe('slotTimes', () => {
  it('splits opening hours into 30-minute slots ending at closing time', () => {
    const fri = slotTimes(business.hours, 5);
    expect(fri[0]).toBe('09:00');
    expect(fri.at(-1)).toBe('12:30');
    expect(fri).toHaveLength(8);
    expect(slotTimes(business.hours, 6)).toEqual([]); // Saturday closed
  });
});

describe('upcomingSlotDays', () => {
  it('returns 7 working days and skips Saturday', () => {
    const days = upcomingSlotDays(business.hours, il('2026-11-26', '08:00')); // Thursday morning
    expect(days).toHaveLength(7);
    expect(days.every((d) => d.weekday !== 6)).toBe(true);
    expect(days[0]!.date).toBe('2026-11-26');
    expect(days[1]!.date).toBe('2026-11-27'); // Friday
    expect(days[2]!.date).toBe('2026-11-29'); // Sunday, Saturday skipped
  });

  it('hides slots that already started today', () => {
    const days = upcomingSlotDays(business.hours, il('2026-11-26', '15:10'));
    expect(days[0]!.date).toBe('2026-11-26');
    expect(days[0]!.slots[0]!.time).toBe('15:30');
  });

  it('starts tomorrow once today is over', () => {
    const days = upcomingSlotDays(business.hours, il('2026-11-26', '18:45'));
    expect(days[0]!.date).toBe('2026-11-27');
  });

  it('busy slots are stable across calls and roughly 30%', () => {
    const now = il('2026-11-26', '08:00');
    const a = upcomingSlotDays(business.hours, now);
    const b = upcomingSlotDays(business.hours, now);
    expect(a).toEqual(b);
    const all = a.flatMap((d) => d.slots);
    const busy = all.filter((s) => s.busy).length / all.length;
    expect(busy).toBeGreaterThan(0.1);
    expect(busy).toBeLessThan(0.5);
    expect(isBusy('2026-11-29', '10:00')).toBe(isBusy('2026-11-29', '10:00'));
  });

  it('works with split hours', () => {
    const split: WeeklyHours = { 0: [{ open: '09:00', close: '10:00' }, { open: '16:00', close: '17:00' }], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    expect(slotTimes(split, 0)).toEqual(['09:00', '09:30', '16:00', '16:30']);
  });
});

describe('openState', () => {
  it('knows when the lab is open (Israel time)', () => {
    expect(openState(business.hours, il('2026-11-26', '10:00'))).toEqual({ open: true, closesAt: '19:00' });
    expect(openState(business.hours, il('2026-11-28', '12:00'))).toEqual({ open: false, opensAt: { weekday: 0, time: '09:00' } });
    expect(openState(business.hours, il('2026-11-27', '13:00')).open).toBe(false);
  });
});

describe('order numbers', () => {
  it('have the FX-#### format', () => {
    for (let i = 0; i < 200; i++) expect(isOrderNumber(generateOrderNumber())).toBe(true);
  });
  it('avoid taken numbers', () => {
    let calls = 0;
    const seq = () => [0, 0, 0.5][calls++ % 3]!; // 1000, 1000, 5500
    expect(generateOrderNumber(['FX-1000'], seq)).toBe('FX-5500');
  });
  it('normalizes user input', () => {
    expect(normalizeOrderNumber('fx-1024')).toBe('FX-1024');
    expect(normalizeOrderNumber(' 1024 ')).toBe('FX-1024');
    expect(normalizeOrderNumber('FX 1024')).toBe('FX-1024');
    expect(normalizeOrderNumber('FX-12')).toBeNull();
  });
});
