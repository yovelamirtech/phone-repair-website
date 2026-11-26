import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(__dirname, 'locales');

function keys(obj: unknown, prefix = ''): string[] {
  if (obj && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const load = (lang: string, file: string) => JSON.parse(readFileSync(join(root, lang, file), 'utf8')) as unknown;

describe('locale files', () => {
  const files = readdirSync(join(root, 'he')).filter((f) => f.endsWith('.json'));

  it.each(['en', 'ru'])('%s has exactly the same keys as he (run npm run locales:sync)', (lang) => {
    for (const file of files) {
      expect(keys(load(lang, file)).sort(), `${lang}/${file}`).toEqual(keys(load('he', file)).sort());
    }
  });

  it('every Hebrew value is filled in', () => {
    for (const file of files) {
      const walk = (v: unknown, path: string) => {
        if (v && typeof v === 'object') Object.entries(v).forEach(([k, c]) => walk(c, `${path}.${k}`));
        else expect(typeof v === 'string' && v.trim().length > 0, `he/${file}${path}`).toBe(true);
      };
      walk(load('he', file), '');
    }
  });
});
