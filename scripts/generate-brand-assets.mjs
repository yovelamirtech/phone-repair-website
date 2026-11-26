/**
 * Generates the placeholder brand assets from the business name:
 *   public/images/logo.svg            text logo (letters converted to paths, no font needed)
 *   public/icons/*.png                PWA / apple-touch icons
 *   public/og-image.png               1200x630 social share image
 *
 * TEMPORARY: replace with the real logo before going live, then delete this script or re-run it
 * with the new name. Run: node scripts/generate-brand-assets.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const NAME = 'פיקסלאב';
const TAGLINE = 'מעבדת סלולר · כרמיאל';
const ACCENT = '#2563EB';
const INK = '#1D1D1F';
const MUTED = '#6E6E73';

const fontFile = (w) => join(root, 'node_modules/@fontsource/heebo/files', `heebo-hebrew-${w}-normal.woff`);
const loadFont = (w) => {
  const buf = readFileSync(fontFile(w));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const bold = loadFont(800);
const regular = loadFont(400);

/** Hebrew is laid out right-to-left; opentype.js lays glyphs left-to-right, so reverse the string. */
const visual = (s) => [...s].reverse().join('');

function textPath(font, text, size, x, y, fill) {
  const p = font.getPath(visual(text), x, y, size);
  const bb = p.getBoundingBox();
  return { d: p.toPathData(2), width: bb.x2 - bb.x1, bb, fill };
}

/** The mark: rounded square with a phone outline and three "pixels". Drawn in a 64x64 box. */
const mark = (fill = ACCENT) => `
  <rect width="64" height="64" rx="16" fill="${fill}"/>
  <rect x="19" y="10" width="26" height="44" rx="7" fill="none" stroke="#fff" stroke-width="4"/>
  <rect x="26" y="22" width="7" height="7" rx="1.5" fill="#fff"/>
  <rect x="33" y="29" width="7" height="7" rx="1.5" fill="#fff" fill-opacity=".75"/>
  <rect x="26" y="36" width="7" height="7" rx="1.5" fill="#fff" fill-opacity=".5"/>`;

// ---------- logo.svg (mark on the right, name to its left, as read in Hebrew) ----------
{
  const size = 34;
  const t = textPath(bold, NAME, size, 0, 0, INK);
  const gap = 10;
  const markSize = 40;
  const textW = t.bb.x2 - t.bb.x1;
  const height = 44;
  const width = Math.ceil(textW + gap + markSize + 2);
  // vertically center text cap-height in the box
  const textH = t.bb.y2 - t.bb.y1;
  const ty = (height - textH) / 2 - t.bb.y1;
  const tx = 1 - t.bb.x1;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${NAME}">
  <path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)})" d="${t.d}" fill="${INK}"/>
  <g transform="translate(${(width - markSize - 1).toFixed(2)} 2) scale(${markSize / 64})">${mark()}</g>
</svg>
`;
  mkdirSync(join(pub, 'images'), { recursive: true });
  writeFileSync(join(pub, 'images', 'logo.svg'), svg);
}

// ---------- icons ----------
mkdirSync(join(pub, 'icons'), { recursive: true });
const iconSvg = (pad) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${ACCENT}"/><g transform="translate(${pad} ${pad}) scale(${(64 - 2 * pad) / 64})">${mark()}</g></svg>`,
);
await sharp(iconSvg(0)).resize(180, 180).png().toFile(join(pub, 'icons', 'apple-touch-icon.png'));
await sharp(iconSvg(0)).resize(192, 192).png().toFile(join(pub, 'icons', 'icon-192.png'));
await sharp(iconSvg(0)).resize(512, 512).png().toFile(join(pub, 'icons', 'icon-512.png'));
await sharp(iconSvg(8)).resize(512, 512).png().toFile(join(pub, 'icons', 'icon-maskable-512.png'));

// ---------- og-image.png ----------
{
  const W = 1200;
  const H = 630;
  const title = textPath(bold, NAME, 120, 0, 0, INK);
  const sub = textPath(regular, TAGLINE, 46, 0, 0, MUTED);
  const right = W - 110;
  const markSize = 150;
  const tTitle = `translate(${(right - markSize - 40 - title.bb.x2).toFixed(1)} ${(300 - title.bb.y2 + 0).toFixed(1)})`;
  const tSub = `translate(${(right - sub.bb.x2).toFixed(1)} 420)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F5F5F7"/>
  <circle cx="160" cy="520" r="260" fill="#EEF3FF"/>
  <g transform="translate(${right - markSize} 170) scale(${markSize / 64})">${mark()}</g>
  <path transform="${tTitle}" d="${title.d}" fill="${INK}"/>
  <path transform="${tSub}" d="${sub.d}" fill="${MUTED}"/>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(pub, 'og-image.png'));
}

console.log('Brand assets written to public/');
