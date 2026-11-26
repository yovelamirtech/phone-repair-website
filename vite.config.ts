/// <reference types="vitest/config" />
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig, siteUrl } from './src/config/site.ts';
import { sitemapRoutes } from './src/config/routes.ts';
import { promos } from './src/data/promos.ts';
import imageManifest from './src/data/images.generated.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * - Injects <meta name="robots" content="noindex"> while demo mode is on.
 * - After build: copies index.html to 404.html (so deep links work on GitHub Pages),
 *   and writes sitemap.xml + robots.txt.
 */
function sitePlugin(): Plugin {
  let outDir = 'dist';
  return {
    name: 'site-plugin',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      const he = JSON.parse(readFileSync(resolve(__dirname, 'src/i18n/locales/he/common.json'), 'utf8')) as {
        seo: { siteName: string; defaultTitle: string; defaultDescription: string };
        demo: { banner: string };
      };
      // Static app shell (demo strip + header bar) painted before the JS loads; React replaces it on mount.
      // Markup mirrors DemoBanner + Header so nothing shifts.
      const shell = [
        siteConfig.demoMode
          ? `<div class="bg-ink px-4 py-1.5 text-center text-xs font-medium text-white sm:text-sm">${he.demo.banner}</div>`
          : '',
        '<div class="sticky top-0 z-50 border-b border-line/70 bg-white/75"><div class="container-page flex h-16 items-center">',
        `<img src="${siteConfig.basePath}images/logo.svg" alt="${he.seo.siteName}" width="148" height="44" class="h-9 w-auto">`,
        '</div></div>',
      ].join('');
      const withShell = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
      const meta = (attrs: Record<string, string>) => ({ tag: 'meta', attrs, injectTo: 'head' as const });
      const tags: HtmlTagDescriptor[] = [
        { tag: 'title', children: he.seo.defaultTitle, injectTo: 'head' },
        meta({ name: 'description', content: he.seo.defaultDescription }),
        { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:locale', content: 'he_IL' }),
        meta({ property: 'og:site_name', content: he.seo.siteName }),
        meta({ property: 'og:title', content: he.seo.defaultTitle }),
        meta({ property: 'og:description', content: he.seo.defaultDescription }),
        meta({ property: 'og:url', content: siteUrl }),
        meta({ property: 'og:image', content: `${siteUrl}og-image.png` }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
      ];
      if (siteConfig.demoMode) tags.push(meta({ name: 'robots', content: 'noindex, nofollow' }));

      // Home page LCP = first carousel image: start downloading it right away.
      // (Only index.html, i.e. the home page; it's stripped from 404.html below.)
      const first = promos[0]?.image;
      const info = first ? (imageManifest.images as Record<string, { width: number }>)[first] : undefined;
      if (first && info) {
        const widths = imageManifest.widths.filter((w) => w <= info.width);
        tags.push({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            type: 'image/webp',
            fetchpriority: 'high',
            'data-home-only': '',
            href: `${siteConfig.basePath}images/photos/${first}-${widths[1] ?? widths[0]}.webp`,
            imagesrcset: widths.map((w) => `${siteConfig.basePath}images/photos/${first}-${w}.webp ${w}w`).join(', '),
            imagesizes: '(min-width: 1200px) 600px, 50vw',
          },
          injectTo: 'head',
        });
      }
      return { html: withShell, tags };
    },
    closeBundle() {
      // 404.html = index.html, so deep links like /prices work on GitHub Pages (minus the home-only preload)
      const index = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      writeFileSync(resolve(outDir, '404.html'), index.replace(/<link[^>]*data-home-only[^>]*>\s*/g, ''));
      const today = new Date().toISOString().slice(0, 10);
      const urls = sitemapRoutes
        .map((p) => `  <url><loc>${siteUrl}${p.replace(/^\//, '')}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n');
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
    },
  };
}

/**
 * Inlines the (small, ~10 KB gzipped) stylesheet into index.html at build time, so the first paint
 * doesn't wait for a CSS request that competes with the JS chunks on slow connections.
 */
function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opts, bundle) {
      const htmlAsset = Object.values(bundle).find((f) => f.type === 'asset' && f.fileName === 'index.html');
      if (!htmlAsset || htmlAsset.type !== 'asset') return;
      let html = String(htmlAsset.source);
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) continue;
        const href = `${siteConfig.basePath}${file.fileName}`;
        const re = new RegExp(`<link rel="stylesheet"[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
        if (!re.test(html)) continue;
        html = html.replace(re, () => `<style>${String(file.source)}</style>`);
        delete bundle[file.fileName];
      }
      htmlAsset.source = html;
    },
  };
}

export default defineConfig({
  base: siteConfig.basePath,
  plugins: [react(), tailwindcss(), sitePlugin(), inlineCssPlugin()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
