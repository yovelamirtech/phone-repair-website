import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { business } from '../data/business';
import { useNearViewport } from '../hooks/useReveal';

/** OpenStreetMap embed (no API key, no tracking cookies). Loaded only when scrolled near. */
export function MapEmbed({ className = '' }: { className?: string }) {
  const { t } = useTranslation('contact');
  const [show, setShow] = useState(false);
  const ref = useNearViewport<HTMLDivElement>(() => setShow(true));
  const { lat, lng } = business.geo;
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d / 1.6}%2C${lng + d}%2C${lat + d / 1.6}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div ref={ref} className={`overflow-hidden rounded-(--radius-card) border border-line bg-surface ${className}`}>
      {show ? (
        <iframe title={t('map.title')} src={src} loading="lazy" className="size-full border-0" referrerPolicy="no-referrer" />
      ) : (
        <div className="grid size-full place-items-center text-muted">{t('map.loading')}</div>
      )}
    </div>
  );
}
