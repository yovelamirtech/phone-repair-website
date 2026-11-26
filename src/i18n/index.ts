import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { rtlLanguages, siteConfig, type LanguageCode } from '../config/site';
import { business } from '../data/business';
import { pickLocalized } from '../lib/localized';
import { readJson, storageKeys, writeJson } from '../lib/storage';

/**
 * All locale files live in ./locales/<lang>/<namespace>.json.
 * Hebrew is complete; English and Russian have the same keys with empty values.
 * Empty values fall back to Hebrew (returnEmptyString: false).
 */
const modules = import.meta.glob<Record<string, unknown>>('./locales/*/*.json', {
  eager: true,
  import: 'default',
});

const resources: Record<string, Record<string, Record<string, unknown>>> = {};
for (const [path, json] of Object.entries(modules)) {
  const match = /\.\/locales\/(\w+)\/(\w+)\.json$/.exec(path);
  if (!match) continue;
  const [, lang, ns] = match as unknown as [string, string, string];
  (resources[lang] ??= {})[ns] = json;
}

export const namespaces = Object.keys(resources.he ?? {});

function initialLanguage(): LanguageCode {
  const saved = readJson<string | null>(storageKeys.language, null);
  const enabled = siteConfig.enabledLanguages as readonly string[];
  if (saved && enabled.includes(saved)) return saved as LanguageCode;
  return siteConfig.defaultLanguage;
}

export function applyDocumentLanguage(lng: string): void {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = rtlLanguages.includes(lng as LanguageCode) ? 'rtl' : 'ltr';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage(),
  fallbackLng: 'he',
  supportedLngs: ['he', 'en', 'ru'],
  ns: namespaces,
  defaultNS: 'common',
  returnEmptyString: false,
  returnNull: false,
  // {{businessName}} is available in every string, from src/data/business.ts
  interpolation: { escapeValue: false, defaultVariables: { businessName: business.name.he } },
  react: { useSuspense: false },
});

applyDocumentLanguage(i18n.language);
function setDefaultVariables(lng: string) {
  if (i18n.options.interpolation) {
    i18n.options.interpolation.defaultVariables = { businessName: pickLocalized(business.name, lng) };
  }
}
setDefaultVariables(i18n.language);

i18n.on('languageChanged', (lng) => {
  setDefaultVariables(lng);
  applyDocumentLanguage(lng);
  writeJson(storageKeys.language, lng);
});

export default i18n;
