/**
 * Repair types and base prices.
 * TEMPORARY: prices and durations are placeholders. All prices are in ILS and include VAT.
 *
 * Final price per model = base price × tier multiplier (see `tierMultipliers`), rounded to end in 9 or 0.
 * Per-model overrides live in src/data/devices.ts (`priceOverrides`).
 */
import {
  BatteryCharging,
  Camera,
  Cpu,
  Droplets,
  Layers,
  PlugZap,
  ScanSearch,
  Smartphone,
  ToggleRight,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import type { LocalizedText } from '../lib/localized';

export type PriceTier = 'basic' | 'mid' | 'flagship' | 'premium';

/** @temporary multipliers per price tier */
export const tierMultipliers: Record<PriceTier, number> = {
  basic: 0.6,
  mid: 0.85,
  flagship: 1.3,
  premium: 1.9,
};

export type RepairId =
  | 'screen'
  | 'battery'
  | 'charging'
  | 'backGlass'
  | 'camera'
  | 'audio'
  | 'water'
  | 'buttons'
  | 'software'
  | 'diagnosis';

/** Part quality, for repairs that offer both. */
export type PartQuality = 'original' | 'compatible';

export type Repair = {
  id: RepairId;
  icon: LucideIcon;
  name: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  /** Either one base price, or a price per part quality. 0 = free. */
  basePrice: number | Record<PartQuality, number>;
  /** Show "from" before the price (final price depends on inspection). */
  startingFrom?: boolean;
  /** Does the price scale with the model's tier? (false for software, diagnosis) */
  tierScaled: boolean;
  /** Shown among "popular repairs" on the home page. */
  popular?: boolean;
};

export const repairs: Repair[] = [
  {
    id: 'screen',
    icon: Smartphone,
    name: { he: 'החלפת מסך' },
    description: { he: 'מסך סדוק, כתמים, קווים או מגע שלא מגיב. מקורי או תואם, לבחירתכם.' },
    duration: { he: 'כשעה' },
    basePrice: { original: 450, compatible: 290 },
    tierScaled: true,
    popular: true,
  },
  {
    id: 'battery',
    icon: BatteryCharging,
    name: { he: 'החלפת סוללה' },
    description: { he: 'הסוללה נגמרת מהר, המכשיר נכבה לבד או שהסוללה התנפחה.' },
    duration: { he: 'כ־45 דקות' },
    basePrice: { original: 280, compatible: 190 },
    tierScaled: true,
    popular: true,
  },
  {
    id: 'charging',
    icon: PlugZap,
    name: { he: 'שקע טעינה' },
    description: { he: 'הכבל לא נתפס, טעינה רק בזווית מסוימת או שהמכשיר לא נטען בכלל.' },
    duration: { he: 'כשעה' },
    basePrice: 220,
    tierScaled: true,
    popular: true,
  },
  {
    id: 'backGlass',
    icon: Layers,
    name: { he: 'זכוכית אחורית' },
    description: { he: 'החלפת גב זכוכית סדוק, בלי להחליף את כל גוף המכשיר.' },
    duration: { he: 'כשעתיים' },
    basePrice: 320,
    tierScaled: true,
    popular: true,
  },
  {
    id: 'camera',
    icon: Camera,
    name: { he: 'מצלמה אחורית או קדמית' },
    description: { he: 'תמונה מטושטשת, פוקוס שלא עובד, עדשה סדוקה או מצלמה שלא נפתחת.' },
    duration: { he: 'כשעה' },
    basePrice: 260,
    tierScaled: true,
  },
  {
    id: 'audio',
    icon: Volume2,
    name: { he: 'רמקול או מיקרופון' },
    description: { he: 'לא שומעים אתכם בשיחה, צליל חלש, צורם או שאין צליל בכלל.' },
    duration: { he: 'כ־45 דקות' },
    basePrice: 180,
    tierScaled: true,
  },
  {
    id: 'water',
    icon: Droplets,
    name: { he: 'נזקי מים' },
    description: { he: 'המכשיר נפל למים או נרטב. כדאי לכבות אותו ולהגיע כמה שיותר מהר.' },
    duration: { he: '24–48 שעות' },
    basePrice: 250,
    startingFrom: true,
    tierScaled: true,
  },
  {
    id: 'buttons',
    icon: ToggleRight,
    name: { he: 'כפתורים' },
    description: { he: 'כפתור הדלקה, עוצמה או השתקה שתקוע, לא לוחץ או לא מגיב.' },
    duration: { he: 'כשעה' },
    basePrice: 160,
    tierScaled: true,
  },
  {
    id: 'software',
    icon: Cpu,
    name: { he: 'תוכנה ושחזור מידע' },
    description: { he: 'מכשיר תקוע בהפעלה, עדכון שנכשל, איטיות, או גיבוי והעברת מידע.' },
    duration: { he: 'משתנה' },
    basePrice: 150,
    startingFrom: true,
    tierScaled: false,
  },
  {
    id: 'diagnosis',
    icon: ScanSearch,
    name: { he: 'אבחון' },
    description: { he: 'לא בטוחים מה התקלה? בודקים את המכשיר ונותנים הצעת מחיר, בלי התחייבות.' },
    duration: { he: 'כ־15 דקות' },
    basePrice: 0,
    tierScaled: false,
  },
];

export const repairById = Object.fromEntries(repairs.map((r) => [r.id, r])) as Record<RepairId, Repair>;

export const hasQualityOptions = (r: Repair): r is Repair & { basePrice: Record<PartQuality, number> } =>
  typeof r.basePrice === 'object';
