import { useTranslation } from 'react-i18next';
import type { LanguageCode } from '../config/site';

/** Content field that needs translation. Falls back to Hebrew when a language is missing. */
export type LocalizedText = { he: string; en?: string; ru?: string };

export function pickLocalized(text: LocalizedText, lang: string): string {
  const value = text[lang as LanguageCode];
  return value && value.trim() !== '' ? value : text.he;
}

/** Returns a function that resolves LocalizedText for the active language. */
export function useLocalized(): (text: LocalizedText) => string {
  const { i18n } = useTranslation();
  return (text) => pickLocalized(text, i18n.language);
}
