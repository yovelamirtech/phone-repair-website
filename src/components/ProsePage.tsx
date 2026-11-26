import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from './ui/SectionHeading';

/**
 * Text-heavy page (accessibility statement, privacy policy) rendered from a locale namespace:
 *   sections.<key>.title, sections.<key>.body (optional), sections.<key>.items.<k> (optional list)
 * Section/item keys are read from the Hebrew file, so every language renders the same structure.
 */
export function ProsePage({ ns, values = {}, children }: { ns: string; values?: Record<string, string>; children?: ReactNode }) {
  const { t } = useTranslation(ns);
  const keysOf = (path: string) => {
    const obj = t(path, { returnObjects: true, lng: 'he' }) as unknown;
    return obj && typeof obj === 'object' ? Object.keys(obj) : [];
  };
  return (
    <section className="container-page section max-w-3xl">
      <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle', values)} />
      {children}
      {keysOf('sections').map((key) => {
        const items = keysOf(`sections.${key}.items`);
        const body = t(`sections.${key}.body`, { ...values, defaultValue: '' });
        return (
          <section key={key} className="mt-10" aria-labelledby={`s-${key}`}>
            <h2 id={`s-${key}`} className="text-2xl font-bold">
              {t(`sections.${key}.title`, values)}
            </h2>
            {body && !body.startsWith('sections.') && <p className="mt-3 text-lg text-muted">{body}</p>}
            {items.length > 0 && (
              <ul className="mt-4 grid list-disc gap-2 ps-6 text-lg text-muted marker:text-accent">
                {items.map((k) => (
                  <li key={k}>{t(`sections.${key}.items.${k}`, values)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </section>
  );
}
