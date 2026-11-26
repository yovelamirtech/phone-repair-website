import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { routes } from '../config/routes';
import { siteConfig } from '../config/site';
import { whatsappLink } from '../lib/links';
import { asset } from '../lib/paths';

/** WhatsApp glyph (not in the lucide set, so it ships as its own graphic file). Decorative. */
export function WhatsAppGlyph({ size = 20 }: { size?: 20 | 24 | 28 }) {
  return (
    <img src={asset('images/whatsapp-white.svg')} alt="" aria-hidden="true" width={size} height={size} className="shrink-0" />
  );
}

/** Floating WhatsApp button, bottom corner on the "end" side. Hidden inside the order wizard. */
export function WhatsAppFab() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (!siteConfig.features.whatsappFab || pathname.startsWith(routes.order)) return null;
  return (
    <a
      href={whatsappLink(t('whatsapp.greeting'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.fabLabel')}
      className="fixed end-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp shadow-(--shadow-lift) transition-transform duration-200 hover:scale-105 hover:bg-whatsapp-hover sm:end-6 sm:bottom-6"
    >
      <WhatsAppGlyph size={28} />
    </a>
  );
}
