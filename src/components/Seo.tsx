import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { siteUrl } from '../config/site';

type SeoProps = {
  /** Page title (site name is appended automatically). Omit on the home page. */
  title?: string;
  description?: string;
  /** Absolute or base-relative image used for share previews. */
  image?: string;
};

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Updates the tab title, description, canonical URL and social share tags for the current page. */
export function Seo({ title, description, image }: SeoProps) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const siteName = t('seo.siteName');
    const fullTitle = title ? `${title} | ${siteName}` : t('seo.defaultTitle');
    const desc = description ?? t('seo.defaultDescription');
    const url = `${siteUrl}${pathname.replace(/^\//, '')}`;
    const img = image ?? `${siteUrl}og-image.png`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, image, pathname, t, i18n.language]);

  return null;
}
