import { business } from '../data/business';

/** wa.me link to the business WhatsApp, optionally with a pre-filled message. */
export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${business.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const telLink = () => `tel:${business.phoneE164}`;
export const mailLink = () => `mailto:${business.email}`;

export const wazeLink = () => `https://waze.com/ul?ll=${business.geo.lat},${business.geo.lng}&navigate=yes`;
export const googleMapsLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${business.geo.lat},${business.geo.lng}`;
