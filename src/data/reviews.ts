/**
 * Customer reviews.
 * TEMPORARY: every review here is invented for the demo (temporary: true).
 * Before going live, replace them with real reviews only.
 */
import type { LocalizedText } from '../lib/localized';
import type { RepairId } from './repairs';

export type Review = {
  id: string;
  /** First name + initial of last name */
  name: LocalizedText;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Device model as the customer wrote it */
  model: string;
  repair: RepairId;
  text: LocalizedText;
  /** true = sample content, must be replaced */
  temporary: boolean;
};

export const reviews: Review[] = [
  {
    id: 'r1',
    name: { he: 'מיכל ש.' },
    rating: 5,
    model: 'iPhone 15 Pro',
    repair: 'screen',
    text: { he: 'הגעתי עם מסך מנופץ בבוקר, ואחרי שעה יצאתי עם טלפון כמו חדש. קיבלתי מחיר מראש, ולא היו הפתעות בקופה.' },
    temporary: true,
  },
  {
    id: 'r2',
    name: { he: 'דניאל ר.' },
    rating: 5,
    model: 'Galaxy S24',
    repair: 'battery',
    text: { he: 'הסוללה החזיקה חצי יום. אלון הסביר לי את ההבדל בין מקורית לתואמת בלי לדחוף לי את היקרה. שירות הוגן.' },
    temporary: true,
  },
  {
    id: 'r3',
    name: { he: 'רונית ב.' },
    rating: 5,
    model: 'Redmi Note 14',
    repair: 'charging',
    text: { he: 'במעבדה אחרת אמרו לי שצריך להחליף לוח. פה ניקו והחליפו שקע, והטלפון נטען כמו ביום הראשון.' },
    temporary: true,
  },
  {
    id: 'r4',
    name: { he: 'יוסי א.' },
    rating: 4,
    model: 'iPhone 13',
    repair: 'water',
    text: { he: 'הטלפון נפל לבריכה. לקח יומיים, אבל הוא חזר לעבוד וכל התמונות נשמרו. עדכנו אותי בוואטסאפ לאורך כל הדרך.' },
    temporary: true,
  },
  {
    id: 'r5',
    name: { he: 'אנה ק.' },
    rating: 5,
    model: 'Pixel 9',
    repair: 'camera',
    text: { he: 'המצלמה האחורית לא הצליחה לעשות פוקוס. האבחון היה בחינם, והתיקון עצמו לקח פחות משעה.' },
    temporary: true,
  },
  {
    id: 'r6',
    name: { he: 'עומר ח.' },
    rating: 5,
    model: 'Galaxy Z Flip6',
    repair: 'screen',
    text: { he: 'חששתי לתת את המתקפל למישהו, אבל רואים שהוא יודע מה הוא עושה. עבודה נקייה ואחריות על החלק.' },
    temporary: true,
  },
  {
    id: 'r7',
    name: { he: 'שירן ל.' },
    rating: 5,
    model: 'iPhone 16',
    repair: 'backGlass',
    text: { he: 'גב הזכוכית נסדק כולו. החליפו רק את הגב, בלי להחליף את כל הגוף, וחסכתי הרבה כסף.' },
    temporary: true,
  },
];

export const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
