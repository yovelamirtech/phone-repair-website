import type { ModelRef } from '../data/devices';

/** Lower-case, unify separators, drop punctuation. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[֑-ׇ]/g, '') // Hebrew niqqud
    .replace(/[^\p{L}\p{N}+]+/gu, ' ')
    .trim();
}

/** Search text for a model: its name, series, brand names in every language and brand aliases. */
export function haystack(ref: ModelRef): string {
  const { brand, series, model } = ref;
  const names = [model.name, series.name, brand.name.he, brand.name.en ?? '', brand.name.ru ?? '', ...brand.searchAliases];
  const text = normalize(names.join(' '));
  // also index the model name without spaces, so "s24ultra" or "14pro" still match
  return `${text} ${normalize(model.name).replace(/\s+/g, '')}`;
}

/** Every word of the query must appear somewhere in the model's search text. */
export function matchesQuery(ref: ModelRef, query: string): boolean {
  const tokens = normalize(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = haystack(ref);
  return tokens.every((tok) => hay.includes(tok));
}
