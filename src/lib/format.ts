/** Locale-aware formatting. Always pass the active i18n language. */

const localeFor: Record<string, string> = { he: 'he-IL', en: 'en-IL', ru: 'ru-RU' };

export const intlLocale = (lang: string) => localeFor[lang] ?? 'he-IL';

export function formatPrice(amount: number, lang: string): string {
  return new Intl.NumberFormat(intlLocale(lang), {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number, lang: string): string {
  return new Intl.NumberFormat(intlLocale(lang)).format(n);
}

/** Date in the business time zone, e.g. "יום ראשון, 30 בנובמבר" */
export function formatDate(date: Date, lang: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(intlLocale(lang), { timeZone: 'Asia/Jerusalem', ...opts }).format(date);
}

/** Weekday name for 0 = Sunday ... 6 = Saturday */
export function weekdayName(weekday: number, lang: string, style: 'long' | 'short' = 'long'): string {
  // 2024-01-07 was a Sunday (UTC noon avoids zone edge cases)
  const d = new Date(Date.UTC(2024, 0, 7 + weekday, 12));
  return new Intl.DateTimeFormat(intlLocale(lang), { weekday: style, timeZone: 'UTC' }).format(d);
}
