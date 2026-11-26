/**
 * Keeps en/ and ru/ locale files in sync with he/ (the source of truth):
 * - adds missing keys with an empty value ("")
 * - removes keys that no longer exist in Hebrew
 * - keeps translations that already exist
 *
 * Run: npm run locales:sync
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'locales');
const source = 'he';
const targets = ['en', 'ru'];

function sync(src, existing) {
  if (Array.isArray(src)) return src.map((v, i) => sync(v, Array.isArray(existing) ? existing[i] : undefined));
  if (src && typeof src === 'object') {
    const out = {};
    for (const key of Object.keys(src)) out[key] = sync(src[key], existing?.[key]);
    return out;
  }
  return typeof existing === 'string' ? existing : '';
}

for (const file of readdirSync(join(root, source)).filter((f) => f.endsWith('.json'))) {
  const src = JSON.parse(readFileSync(join(root, source, file), 'utf8'));
  for (const lang of targets) {
    const dir = join(root, lang);
    mkdirSync(dir, { recursive: true });
    const path = join(dir, file);
    const existing = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
    writeFileSync(path, JSON.stringify(sync(src, existing), null, 2) + '\n');
  }
}
console.log('Locales synced:', targets.join(', '));
