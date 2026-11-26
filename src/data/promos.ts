/**
 * Carousel slides on the home page.
 * TEMPORARY: offers are placeholders. Each slide: title, subtitle, button, image and a light tint.
 */
import { routes } from '../config/routes';
import type { LocalizedText } from '../lib/localized';

export type PromoTint = 'blue' | 'green' | 'amber' | 'violet';

export type Promo = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  cta: { label: LocalizedText; to: string };
  /** photo name from public/images/photos */
  image: string;
  imageAlt: LocalizedText;
  tint: PromoTint;
};

export const promos: Promo[] = [
  {
    id: 'battery-30',
    title: { he: '30% הנחה על החלפת סוללה' },
    subtitle: { he: 'רק החודש. סוללה חדשה, ואתם שוב מגיעים לסוף היום עם טלפון טעון.' },
    cta: { label: { he: 'הזמנת החלפת סוללה' }, to: `${routes.order}?repair=battery` },
    image: 'promo-battery',
    imageAlt: { he: 'חלקי טלפון מפורקים ומסודרים על משטח עבודה כחול' },
    tint: 'green',
  },
  {
    id: 'screen-protector',
    title: { he: 'מגן מסך מזכוכית, מתנה' },
    subtitle: { he: 'בכל החלפת מסך מקבלים מגן זכוכית מותקן, כדי שהמסך החדש יישאר חדש.' },
    cta: { label: { he: 'למחירי המסכים' }, to: `${routes.prices}?repair=screen` },
    image: 'promo-screen',
    imageAlt: { he: 'טלפון חכם עם מסך שלם על רקע לבן' },
    tint: 'blue',
  },
  {
    id: 'express',
    title: { he: 'רוב התיקונים מוכנים תוך שעה' },
    subtitle: { he: 'קובעים תור, מגיעים, ושותים קפה עלינו. עד שתסיימו, הטלפון כבר מחכה.' },
    cta: { label: { he: 'קביעת תור' }, to: routes.order },
    image: 'promo-express',
    imageAlt: { he: 'ידיים עם כפפות מחליפות רכיב בתוך טלפון פתוח' },
    tint: 'amber',
  },
  {
    id: 'free-diagnosis',
    title: { he: 'אבחון חינם, בלי התחייבות' },
    subtitle: { he: 'לא בטוחים מה התקלה? בודקים, מסבירים ונותנים הצעת מחיר לפני שמתחילים.' },
    cta: { label: { he: 'הזמנת אבחון' }, to: `${routes.order}?repair=diagnosis` },
    image: 'promo-diagnosis',
    imageAlt: { he: 'סטטוסקופ מונח על מסך של טלפון חכם' },
    tint: 'violet',
  },
];
