/**
 * Warranty terms.
 * TEMPORARY: have the technician approve these terms before going live.
 */
import type { LocalizedText } from '../lib/localized';

export const warranty = {
  originalPartMonths: 6,
  compatiblePartMonths: 3,
  covered: [
    { he: 'תקלה בחלק שהוחלף, כמו מסך שמפסיק להגיב או סוללה שמתרוקנת חריג' },
    { he: 'תקלה שנגרמה מהעבודה עצמה, כמו מחבר שלא חובר כראוי' },
    { he: 'בדיקה חוזרת של המכשיר בכל זמן תקופת האחריות, בלי עלות' },
  ] satisfies LocalizedText[],
  notCovered: [
    { he: 'נזק מנפילה, מכה או לחץ אחרי התיקון' },
    { he: 'נזק מנוזלים או מלחות אחרי התיקון' },
    { he: 'פתיחה או תיקון של המכשיר במקום אחר' },
    { he: 'בעיות תוכנה שלא קשורות לחלק שהוחלף' },
  ] satisfies LocalizedText[],
  howToClaim: [
    { he: 'שולחים לנו הודעה בוואטסאפ או מתקשרים, עם מספר ההזמנה' },
    { he: 'מגיעים למעבדה עם המכשיר, בתיאום או בלי' },
    { he: 'בודקים את המכשיר. אם התקלה מכוסה, מתקנים בלי עלות' },
  ] satisfies LocalizedText[],
};
