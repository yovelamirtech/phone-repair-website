import { useDeferredValue, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { faqCategories, faqItems } from '../../data/faq';
import { routes } from '../../config/routes';
import { Seo } from '../../components/Seo';
import { WhatsAppGlyph } from '../../components/WhatsApp';
import { Accordion } from '../../components/ui/Accordion';
import { ButtonAnchor, ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { whatsappLink } from '../../lib/links';
import { useLocalized } from '../../lib/localized';
import { normalize } from '../../lib/search';

export default function FaqPage() {
  const { t } = useTranslation('faq');
  const l = useLocalized();
  const [q, setQ] = useState('');
  const query = useDeferredValue(q);
  const tokens = normalize(query).split(' ').filter(Boolean);
  const matches = (text: string) => tokens.every((tok) => normalize(text).includes(tok));
  const visible = faqItems.filter((f) => matches(`${l(f.question)} ${l(f.answer)}`));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question.he,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.he },
    })),
  };

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-page section max-w-4xl">
        <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />

        <label className="relative mt-8 block">
          <span className="sr-only">{t('search')}</span>
          <Icon icon={Search} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="min-h-12 w-full rounded-full border border-line bg-bg ps-11 pe-4"
          />
        </label>
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {tokens.length > 0 && t('results', { count: visible.length })}
        </p>

        {faqCategories.map((cat) => {
          const items = visible.filter((f) => f.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mt-10" aria-labelledby={`faq-${cat.id}`}>
              <h2 id={`faq-${cat.id}`} className="mb-4 text-2xl font-bold">
                {l(cat.name)}
              </h2>
              <Accordion
                items={items.map((f) => ({ id: f.id, title: l(f.question), content: <p>{l(f.answer)}</p> }))}
                defaultOpen={tokens.length > 0 ? items.map((f) => f.id) : []}
                key={tokens.join(' ')}
              />
            </section>
          );
        })}

        {visible.length === 0 && (
          <div className="card mt-10 p-8 text-center">
            <p className="text-lg font-semibold">{t('empty')}</p>
          </div>
        )}

        <div className="card mt-16 flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="text-2xl font-bold">{t('more.title')}</h2>
          <p className="text-muted">{t('more.text')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonAnchor href={whatsappLink(t('common:whatsapp.greeting'))} target="_blank" rel="noopener noreferrer" variant="whatsapp">
              <WhatsAppGlyph />
              {t('more.whatsapp')}
            </ButtonAnchor>
            <ButtonLink to={routes.contact} variant="secondary">
              {t('more.contact')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
