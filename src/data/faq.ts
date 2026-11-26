/**
 * Frequently asked questions, grouped by category.
 * TEMPORARY: answers are placeholders, have the technician review them before going live.
 */
import type { LocalizedText } from '../lib/localized';

export type FaqCategoryId = 'repairs' | 'pricing' | 'privacy' | 'warranty';

export type FaqCategory = { id: FaqCategoryId; name: LocalizedText };

export type FaqItem = { id: string; category: FaqCategoryId; question: LocalizedText; answer: LocalizedText };

export const faqCategories: FaqCategory[] = [
  { id: 'repairs', name: { he: 'תיקונים' } },
  { id: 'pricing', name: { he: 'מחירים ותשלום' } },
  { id: 'privacy', name: { he: 'מידע ופרטיות' } },
  { id: 'warranty', name: { he: 'אחריות' } },
];

export const faqItems: FaqItem[] = [
  {
    id: 'how-long',
    category: 'repairs',
    question: { he: 'כמה זמן לוקח תיקון?' },
    answer: {
      he: 'רוב התיקונים, כמו החלפת מסך, סוללה או שקע טעינה, מוכנים תוך כשעה. נזקי מים ותיקוני לוח לוקחים בדרך כלל 24 עד 48 שעות. את הזמן המשוער תקבלו כבר באבחון.',
    },
  },
  {
    id: 'appointment',
    category: 'repairs',
    question: { he: 'צריך לקבוע תור, או אפשר פשוט להגיע?' },
    answer: {
      he: 'אפשר להגיע בלי תור בשעות הפתיחה, אבל עם תור אנחנו מזמינים את החלק מראש ומבטיחים שמישהו פנוי בשבילכם. קביעת תור באתר לוקחת דקה.',
    },
  },
  {
    id: 'original-vs-compatible',
    category: 'repairs',
    question: { he: 'מקורי או תואם, מה ההבדל?' },
    answer: {
      he: 'חלק מקורי מגיע מהיצרן או ברמה זהה לו, עם אותם צבעים, בהירות ומגע. חלק תואם הוא חלופה איכותית וזולה יותר, שעובדת מצוין אבל יכולה להיות שונה מעט בצבעים או בצריכת סוללה. על מקורי יש 6 חודשי אחריות, ועל תואם 3 חודשים.',
    },
  },
  {
    id: 'not-fixable',
    category: 'repairs',
    question: { he: 'מה קורה אם אי אפשר לתקן את המכשיר?' },
    answer: {
      he: 'אם אחרי האבחון מתברר שהתיקון לא משתלם או לא אפשרי, תדעו את זה לפני שמתחילים. לא תשלמו על תיקון שלא בוצע, והאבחון תמיד בחינם.',
    },
  },
  {
    id: 'price-final',
    category: 'pricing',
    question: { he: 'המחיר באתר הוא המחיר הסופי?' },
    answer: {
      he: 'המחיר במחירון כולל מע"מ ומתאים לרוב המקרים. המחיר הסופי נקבע אחרי בדיקה קצרה של המכשיר, ותמיד מאשרים אותו מולכם לפני שמתחילים לעבוד.',
    },
  },
  {
    id: 'payment',
    category: 'pricing',
    question: { he: 'איך אפשר לשלם?' },
    answer: { he: 'במזומן, בכרטיס אשראי, בביט או בפייבוקס. התשלום רק בסיום התיקון, אחרי שבדקתם שהכול עובד.' },
  },
  {
    id: 'diagnosis-cost',
    category: 'pricing',
    question: { he: 'כמה עולה אבחון?' },
    answer: { he: 'אבחון אצלנו תמיד בחינם ובלי התחייבות. תקבלו הסבר על התקלה והצעת מחיר, ותחליטו אם להמשיך.' },
  },
  {
    id: 'lose-data',
    category: 'privacy',
    question: { he: 'האם אאבד מידע בתיקון?' },
    answer: {
      he: 'ברוב התיקונים, כמו מסך, סוללה ושקע, המידע לא נפגע. בכל זאת מומלץ לגבות את המכשיר לפני כל תיקון, ליתר ביטחון. אם המכשיר לא נדלק, אפשר לנסות לשחזר ממנו מידע.',
    },
  },
  {
    id: 'passcode',
    category: 'privacy',
    question: { he: 'אתם צריכים את קוד הנעילה של הטלפון?' },
    answer: {
      he: 'לא. אנחנו לא מבקשים קוד נעילה, לא באתר ולא במעבדה. אם צריך לבדוק משהו שדורש כניסה למכשיר, נעשה את זה יחד איתכם, מול העיניים שלכם.',
    },
  },
  {
    id: 'warranty-length',
    category: 'warranty',
    question: { he: 'כמה זמן אחריות יש על תיקון?' },
    answer: { he: '6 חודשים על חלק מקורי ו־3 חודשים על חלק תואם, מיום התיקון. כל הפרטים בדף האחריות.' },
  },
  {
    id: 'warranty-claim',
    category: 'warranty',
    question: { he: 'מה עושים אם יש בעיה אחרי התיקון?' },
    answer: {
      he: 'פשוט חוזרים אלינו עם המכשיר ומספר ההזמנה. אם התקלה קשורה לחלק שהחלפנו, נטפל בה בלי עלות. האחריות לא מכסה נזק מנפילה או מנוזלים אחרי התיקון.',
    },
  },
];
