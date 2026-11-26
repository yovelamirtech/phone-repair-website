/**
 * Before/after pairs for the gallery.
 * TEMPORARY: stock photos (see public/images/CREDITS.md). Replace with real photos of your repairs.
 */
import type { LocalizedText } from '../lib/localized';
import type { RepairId } from './repairs';

export type GalleryItem = {
  id: string;
  repair: RepairId;
  title: LocalizedText;
  before: { image: string; alt: LocalizedText };
  after: { image: string; alt: LocalizedText };
};

export const gallery: GalleryItem[] = [
  {
    id: 'screen-1',
    repair: 'screen',
    title: { he: 'מסך סדוק בפינה העליונה' },
    before: { image: 'gallery-screen-1-before', alt: { he: 'טלפון עם סדק בפינה העליונה של המסך' } },
    after: { image: 'gallery-screen-1-after', alt: { he: 'טלפון עם מסך חדש ושלם' } },
  },
  {
    id: 'screen-2',
    repair: 'screen',
    title: { he: 'מסך מנופץ מנפילה' },
    before: { image: 'gallery-screen-2-before', alt: { he: 'זכוכית מסך מנופצת עם סדקים לכל הכיוונים' } },
    after: { image: 'gallery-screen-2-after', alt: { he: 'טלפון שחור עם מסך חדש' } },
  },
  {
    id: 'screen-3',
    repair: 'screen',
    title: { he: 'מסך עם סדקים לכל אורכו' },
    before: { image: 'gallery-screen-3-before', alt: { he: 'טלפון עם מסך סדוק על משטח כחול' } },
    after: { image: 'gallery-screen-3-after', alt: { he: 'טלפון אחרי החלפת מסך, עומד על רקע לבן' } },
  },
  {
    id: 'backglass-1',
    repair: 'backGlass',
    title: { he: 'גב זכוכית סדוק' },
    before: { image: 'gallery-backglass-before', alt: { he: 'טלפונים עם גב סדוק לצד כלי תיקון' } },
    after: { image: 'gallery-backglass-after', alt: { he: 'גב טלפון שלם אחרי החלפת הזכוכית' } },
  },
  {
    id: 'battery-1',
    repair: 'battery',
    title: { he: 'סוללה חלשה' },
    before: { image: 'gallery-battery-before', alt: { he: 'טלפון פתוח עם רכיבים מפורקים לפני החלפת סוללה' } },
    after: { image: 'gallery-battery-after', alt: { he: 'שני טלפונים סגורים ומוכנים אחרי התיקון' } },
  },
];
