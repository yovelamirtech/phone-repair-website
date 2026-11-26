import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { business } from '../data/business';
import { useLocalized } from '../lib/localized';
import { googleMapsLink, mailLink, telLink, whatsappLink } from '../lib/links';
import { asset } from '../lib/paths';
import { Icon } from './ui/Icon';

/** Phone, WhatsApp, email and address with icons. Used in the footer and on the contact page. */
export function ContactList({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const l = useLocalized();
  const row = 'flex min-h-11 items-center gap-3 hover:text-accent-strong';
  return (
    <ul className={`grid gap-1 ${className}`}>
      <li>
        <a href={telLink()} className={row}>
          <Icon icon={Phone} className="text-accent" />
          <span className="sr-only">{t('contact.phone')}: </span>
          <span className="ltr-nums">{business.phone}</span>
        </a>
      </li>
      <li>
        <a href={whatsappLink(t('whatsapp.greeting'))} target="_blank" rel="noopener noreferrer" className={row}>
          <span className="grid size-5 place-items-center rounded-full bg-whatsapp">
            <img src={asset('images/whatsapp-white.svg')} alt="" width={12} height={12} />
          </span>
          <span>{t('contact.whatsappChat')}</span>
        </a>
      </li>
      <li>
        <a href={mailLink()} className={row}>
          <Icon icon={Mail} className="text-accent" />
          <span className="sr-only">{t('contact.email')}: </span>
          <span className="ltr-nums">{business.email}</span>
        </a>
      </li>
      <li>
        <a href={googleMapsLink()} target="_blank" rel="noopener noreferrer" className={row}>
          <Icon icon={MapPin} className="text-accent" />
          <span className="sr-only">{t('contact.address')}: </span>
          <span>
            {l(business.address.street)}, {l(business.address.city)}
          </span>
        </a>
      </li>
    </ul>
  );
}
