/**
 * Central site configuration.
 * This file is pure data (no browser APIs) so it can also be imported by vite.config.ts.
 */

export type LanguageCode = 'he' | 'en' | 'ru';

export const siteConfig = {
  /**
   * Demo mode: shows the "demo site" strip, the sample order hint on /status,
   * and marks every page as noindex. Set to false before going live.
   */
  demoMode: true,

  /**
   * Base path the site is served from. This is the ONLY place it is set.
   * GitHub Pages project site: '/phone-repair-website/'.
   * Own domain in the future: '/'.
   */
  basePath: '/phone-repair-website/',

  /** Public origin (no trailing slash). Used for canonical URLs, sitemap and share tags. */
  siteOrigin: 'https://yovelamirtech.github.io',

  /** Languages that are switched on. The switcher only shows when there is more than one. */
  enabledLanguages: ['he'] as LanguageCode[],
  defaultLanguage: 'he' as LanguageCode,

  /** Time zone used for "open now" and appointment slots. */
  timeZone: 'Asia/Jerusalem',

  features: {
    whatsappFab: true,
    map: true,
  },
} as const;

/** Full public URL of the site root, e.g. https://user.github.io/repo/ */
export const siteUrl = `${siteConfig.siteOrigin}${siteConfig.basePath}`;

export const rtlLanguages: LanguageCode[] = ['he'];
