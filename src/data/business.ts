/**
 * Business details.
 * TEMPORARY: every value here is placeholder content for the demo. Replace before going live.
 */
import type { LocalizedText } from '../lib/localized';

/** "HH:MM" in 24h, Israel time */
export type TimeRange = { open: string; close: string };

/** Weekly opening hours. Key = day of week, 0 = Sunday ... 6 = Saturday. Empty array = closed. */
export type WeeklyHours = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, TimeRange[]>;

export const business = {
  /** @temporary */
  name: { he: 'פיקסלאב', en: 'PixelLab', ru: 'PixelLab' } satisfies LocalizedText,
  /** @temporary */
  tagline: { he: 'מעבדת סלולר', en: 'Phone repair lab', ru: 'Ремонт телефонов' } satisfies LocalizedText,
  /** @temporary */
  technician: {
    name: { he: 'אלון כהן', en: 'Alon Cohen', ru: 'Алон Коэн' } satisfies LocalizedText,
    yearsOfExperience: 8,
  },
  /** @temporary */
  address: {
    street: { he: 'רחוב המלאכה 7', en: '7 HaMelacha St.', ru: 'ул. Ха-Мелаха, 7' } satisfies LocalizedText,
    city: { he: 'כרמיאל', en: 'Karmiel', ru: 'Кармиэль' } satisfies LocalizedText,
    postalCode: '2161000',
    country: 'IL',
  },
  /** @temporary Display format */
  phone: '04-000-0000',
  /** @temporary International format for tel: links */
  phoneE164: '+97240000000',
  /** @temporary International format, digits only, no "+" or dashes (used for wa.me links) */
  whatsapp: '972500000000',
  /** @temporary */
  email: 'hello@example.com',
  /** @temporary Map center (Karmiel) */
  geo: { lat: 32.919, lng: 35.296 },
  /** @temporary */
  hours: {
    0: [{ open: '09:00', close: '19:00' }],
    1: [{ open: '09:00', close: '19:00' }],
    2: [{ open: '09:00', close: '19:00' }],
    3: [{ open: '09:00', close: '19:00' }],
    4: [{ open: '09:00', close: '19:00' }],
    5: [{ open: '09:00', close: '13:00' }],
    6: [],
  } satisfies WeeklyHours as WeeklyHours,
  /** Year the business was founded. @temporary */
  foundedYear: 2026,
  /** Accessibility coordinator, shown on the accessibility statement. @temporary fill in before going live */
  accessibilityCoordinator: {
    name: { he: '[שם רכז/ת הנגישות]', en: '[Accessibility coordinator name]' } satisfies LocalizedText,
    phone: '04-000-0000',
    email: 'hello@example.com',
  },
  /** Last time the accessibility statement was reviewed (YYYY-MM-DD). */
  accessibilityStatementUpdated: '2026-11-26',
} as const;

export type Business = typeof business;
