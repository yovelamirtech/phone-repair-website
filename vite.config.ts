/// <reference types="vitest/config" />
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig, siteUrl } from './src/config/site.ts';
import { sitemapRoutes } from './src/config/routes.ts';

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
    transformIndexHtml() {
      const he = JSON.parse(readFileSync(resolve(__dirname, 'src/i18n/locales/he/common.json'), 'utf8')) as {
        seo: { siteName: string; defaultTitle: string; defaultDescription: string };
      };
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
      return tags;
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
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

export default defineConfig({
  base: siteConfig.basePath,
  plugins: [react(), tailwindcss(), sitePlugin()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
