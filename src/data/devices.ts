/**
 * Brands, series and models, each with a price tier.
 *
 * Up to date as of 2026-11-26. The Apple, Samsung and Google line-ups were checked against web
 * sources on that date (iPhone 18 Pro/Pro Max, iPhone 17 family incl. 17e and Air, Galaxy S26,
 * Z Fold8/Flip8, Galaxy A57/A37/A27/A17/A07, Pixel 11 family, Pixel 10a). For the other brands
 * the list holds the models most common in Israel in recent years.
 *
 * TEMPORARY: tiers and overrides are placeholders, adjust them to real part costs.
 */
import type { LocalizedText } from '../lib/localized';
import type { PartQuality, PriceTier, RepairId } from './repairs';

/** Key for a price override: a repair id, or "<repairId>:<quality>" for screen/battery. */
export type PriceKey = RepairId | `${RepairId}:${PartQuality}`;

export type DeviceModel = {
  id: string;
  /** Model names are product names and stay in their original (Latin) form. */
  name: string;
  tier: PriceTier;
  year: number;
  /** Repairs that don't apply to this model (e.g. plastic back = no back glass). */
  excludeRepairs?: RepairId[];
  /** Fixed prices that win over the calculated price. */
  priceOverrides?: Partial<Record<PriceKey, number>>;
};

export type DeviceSeries = { id: string; name: string; models: DeviceModel[] };

export type Brand = {
  id: string;
  name: LocalizedText;
  series: DeviceSeries[];
};

/** Shorthand helpers keep the list readable. */
const m = (name: string, tier: PriceTier, year: number, extra: Partial<DeviceModel> = {}): DeviceModel => ({
  id: name
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
  name,
  tier,
  year,
  ...extra,
});
const noBackGlass = { excludeRepairs: ['backGlass'] as RepairId[] };

export const brands: Brand[] = [
  {
    id: 'apple',
    name: { he: 'אפל', en: 'Apple', ru: 'Apple' },
    series: [
      { id: 'iphone-18', name: 'iPhone 18', models: [m('iPhone 18 Pro Max', 'flagship', 2026), m('iPhone 18 Pro', 'flagship', 2026)] },
      {
        id: 'iphone-17',
        name: 'iPhone 17',
        models: [
          m('iPhone 17 Pro Max', 'flagship', 2025),
          m('iPhone 17 Pro', 'flagship', 2025),
          m('iPhone Air', 'flagship', 2025),
          m('iPhone 17', 'mid', 2025),
          m('iPhone 17e', 'basic', 2026),
        ],
      },
      {
        id: 'iphone-16',
        name: 'iPhone 16',
        models: [
          m('iPhone 16 Pro Max', 'flagship', 2024),
          m('iPhone 16 Pro', 'flagship', 2024),
          m('iPhone 16 Plus', 'mid', 2024),
          m('iPhone 16', 'mid', 2024),
          m('iPhone 16e', 'basic', 2025),
        ],
      },
      {
        id: 'iphone-15',
        name: 'iPhone 15',
        models: [
          m('iPhone 15 Pro Max', 'flagship', 2023),
          m('iPhone 15 Pro', 'flagship', 2023),
          m('iPhone 15 Plus', 'mid', 2023),
          m('iPhone 15', 'mid', 2023),
        ],
      },
      {
        id: 'iphone-14',
        name: 'iPhone 14',
        models: [
          m('iPhone 14 Pro Max', 'flagship', 2022),
          m('iPhone 14 Pro', 'flagship', 2022),
          m('iPhone 14 Plus', 'mid', 2022),
          m('iPhone 14', 'mid', 2022),
        ],
      },
      {
        id: 'iphone-13',
        name: 'iPhone 13',
        models: [
          m('iPhone 13 Pro Max', 'mid', 2021),
          m('iPhone 13 Pro', 'mid', 2021),
          m('iPhone 13', 'basic', 2021),
          m('iPhone 13 mini', 'basic', 2021),
        ],
      },
      {
        id: 'iphone-12',
        name: 'iPhone 12',
        models: [
          m('iPhone 12 Pro Max', 'mid', 2020),
          m('iPhone 12 Pro', 'mid', 2020),
          m('iPhone 12', 'basic', 2020),
          m('iPhone 12 mini', 'basic', 2020),
        ],
      },
      {
        id: 'iphone-11',
        name: 'iPhone 11',
        models: [m('iPhone 11 Pro Max', 'mid', 2019), m('iPhone 11 Pro', 'mid', 2019), m('iPhone 11', 'basic', 2019)],
      },
      {
        id: 'iphone-se',
        name: 'iPhone SE',
        models: [
          // example of a fixed price that overrides the calculation
          m('iPhone SE (2022)', 'basic', 2022, { priceOverrides: { 'screen:original': 290, 'screen:compatible': 190 } }),
          m('iPhone SE (2020)', 'basic', 2020, { priceOverrides: { 'screen:original': 270, 'screen:compatible': 170 } }),
        ],
      },
    ],
  },
  {
    id: 'samsung',
    name: { he: 'סמסונג', en: 'Samsung', ru: 'Samsung' },
    series: [
      {
        id: 'galaxy-s',
        name: 'Galaxy S',
        models: [
          m('Galaxy S26 Ultra', 'flagship', 2026),
          m('Galaxy S26+', 'flagship', 2026),
          m('Galaxy S26', 'flagship', 2026),
          m('Galaxy S25 Ultra', 'flagship', 2025),
          m('Galaxy S25 Edge', 'flagship', 2025),
          m('Galaxy S25+', 'flagship', 2025),
          m('Galaxy S25', 'flagship', 2025),
          m('Galaxy S25 FE', 'mid', 2025),
          m('Galaxy S24 Ultra', 'flagship', 2024),
          m('Galaxy S24+', 'flagship', 2024),
          m('Galaxy S24', 'mid', 2024),
          m('Galaxy S24 FE', 'mid', 2024),
          m('Galaxy S23 Ultra', 'flagship', 2023),
          m('Galaxy S23', 'mid', 2023),
          m('Galaxy S23 FE', 'mid', 2023),
        ],
      },
      {
        id: 'galaxy-z',
        name: 'Galaxy Z',
        models: [
          m('Galaxy Z Fold8', 'premium', 2026),
          m('Galaxy Z Flip8', 'premium', 2026),
          m('Galaxy Z Fold7', 'premium', 2025),
          m('Galaxy Z Flip7', 'premium', 2025),
          m('Galaxy Z Flip7 FE', 'premium', 2025),
          m('Galaxy Z Fold6', 'premium', 2024),
          m('Galaxy Z Flip6', 'premium', 2024),
          m('Galaxy Z Fold5', 'premium', 2023),
          m('Galaxy Z Flip5', 'premium', 2023),
        ],
      },
      {
        id: 'galaxy-a',
        name: 'Galaxy A',
        models: [
          m('Galaxy A57', 'mid', 2026),
          m('Galaxy A37', 'mid', 2026),
          m('Galaxy A27', 'basic', 2026, noBackGlass),
          m('Galaxy A17', 'basic', 2025, noBackGlass),
          m('Galaxy A07', 'basic', 2025, noBackGlass),
          m('Galaxy A56', 'mid', 2025),
          m('Galaxy A36', 'mid', 2025),
          m('Galaxy A26', 'basic', 2025, noBackGlass),
          m('Galaxy A16', 'basic', 2024, noBackGlass),
          m('Galaxy A55', 'mid', 2024),
          m('Galaxy A35', 'mid', 2024),
          m('Galaxy A25', 'basic', 2023, noBackGlass),
          m('Galaxy A15', 'basic', 2023, noBackGlass),
        ],
      },
    ],
  },
  {
    id: 'xiaomi',
    name: { he: 'שיאומי, רדמי ופוקו', en: 'Xiaomi, Redmi & POCO', ru: 'Xiaomi, Redmi и POCO' },
    series: [
      {
        id: 'xiaomi',
        name: 'Xiaomi',
        models: [
          m('Xiaomi 17 Ultra', 'flagship', 2026),
          m('Xiaomi 17', 'flagship', 2026),
          m('Xiaomi 15T Pro', 'flagship', 2025),
          m('Xiaomi 15T', 'mid', 2025),
          m('Xiaomi 15', 'flagship', 2025),
          m('Xiaomi 14T Pro', 'mid', 2024),
          m('Xiaomi 14T', 'mid', 2024),
        ],
      },
      {
        id: 'redmi',
        name: 'Redmi',
        models: [
          m('Redmi Note 15 Pro+', 'mid', 2026),
          m('Redmi Note 15 Pro', 'mid', 2026),
          m('Redmi Note 15', 'basic', 2026, noBackGlass),
          m('Redmi Note 14 Pro+', 'mid', 2025),
          m('Redmi Note 14 Pro', 'mid', 2025),
          m('Redmi Note 14', 'basic', 2025, noBackGlass),
          m('Redmi 15', 'basic', 2025, noBackGlass),
          m('Redmi 14C', 'basic', 2024, noBackGlass),
        ],
      },
      {
        id: 'poco',
        name: 'POCO',
        models: [
          m('POCO F8 Pro', 'mid', 2025),
          m('POCO F8', 'mid', 2025),
          m('POCO F7', 'mid', 2025),
          m('POCO X7 Pro', 'mid', 2025),
          m('POCO X7', 'basic', 2025),
          m('POCO M7', 'basic', 2025, noBackGlass),
        ],
      },
    ],
  },
  {
    id: 'google',
    name: { he: 'גוגל פיקסל', en: 'Google Pixel', ru: 'Google Pixel' },
    series: [
      {
        id: 'pixel-11',
        name: 'Pixel 11',
        models: [
          m('Pixel 11 Pro Fold', 'premium', 2026),
          m('Pixel 11 Pro XL', 'flagship', 2026),
          m('Pixel 11 Pro', 'flagship', 2026),
          m('Pixel 11', 'mid', 2026),
        ],
      },
      {
        id: 'pixel-10',
        name: 'Pixel 10',
        models: [
          m('Pixel 10 Pro Fold', 'premium', 2025),
          m('Pixel 10 Pro XL', 'flagship', 2025),
          m('Pixel 10 Pro', 'flagship', 2025),
          m('Pixel 10', 'mid', 2025),
          m('Pixel 10a', 'basic', 2026, noBackGlass),
        ],
      },
      {
        id: 'pixel-9',
        name: 'Pixel 9',
        models: [
          m('Pixel 9 Pro XL', 'flagship', 2024),
          m('Pixel 9 Pro', 'flagship', 2024),
          m('Pixel 9', 'mid', 2024),
          m('Pixel 9a', 'basic', 2025, noBackGlass),
        ],
      },
      {
        id: 'pixel-8',
        name: 'Pixel 8',
        models: [m('Pixel 8 Pro', 'mid', 2023), m('Pixel 8', 'mid', 2023), m('Pixel 8a', 'basic', 2024, noBackGlass)],
      },
    ],
  },
  {
    id: 'oneplus',
    name: { he: 'וואנפלוס', en: 'OnePlus', ru: 'OnePlus' },
    series: [
      {
        id: 'oneplus',
        name: 'OnePlus',
        models: [
          m('OnePlus 15', 'flagship', 2025),
          m('OnePlus 13', 'flagship', 2025),
          m('OnePlus 13R', 'mid', 2025),
          m('OnePlus 12', 'flagship', 2024),
        ],
      },
      {
        id: 'oneplus-nord',
        name: 'OnePlus Nord',
        models: [
          m('OnePlus Nord 5', 'mid', 2025),
          m('OnePlus Nord CE5', 'basic', 2025, noBackGlass),
          m('OnePlus Nord 4', 'mid', 2024),
        ],
      },
    ],
  },
  {
    id: 'motorola',
    name: { he: 'מוטורולה', en: 'Motorola', ru: 'Motorola' },
    series: [
      { id: 'razr', name: 'razr', models: [m('razr 60 ultra', 'premium', 2025), m('razr 60', 'premium', 2025)] },
      {
        id: 'edge',
        name: 'edge',
        models: [m('edge 70', 'mid', 2025), m('edge 60 pro', 'mid', 2025), m('edge 60', 'mid', 2025), m('edge 50 pro', 'mid', 2024)],
      },
      {
        id: 'moto-g',
        name: 'moto g',
        models: [
          m('moto g86', 'basic', 2025, noBackGlass),
          m('moto g56', 'basic', 2025, noBackGlass),
          m('moto g15', 'basic', 2025, noBackGlass),
        ],
      },
    ],
  },
  {
    id: 'oppo',
    name: { he: 'אופו', en: 'OPPO', ru: 'OPPO' },
    series: [
      { id: 'find-x', name: 'Find X', models: [m('Find X9 Pro', 'flagship', 2025), m('Find X9', 'flagship', 2025), m('Find X8 Pro', 'flagship', 2024)] },
      { id: 'reno', name: 'Reno', models: [m('Reno14 Pro', 'mid', 2025), m('Reno14', 'mid', 2025), m('Reno13', 'mid', 2025)] },
      { id: 'oppo-a', name: 'A', models: [m('A5 Pro', 'basic', 2025, noBackGlass), m('A5', 'basic', 2025, noBackGlass)] },
    ],
  },
];

/** Pseudo-brand for devices that aren't in the list (free text in the order form). */
export const OTHER_BRAND_ID = 'other';

export type ModelRef = { brand: Brand; series: DeviceSeries; model: DeviceModel };

export const allModels: ModelRef[] = brands.flatMap((brand) =>
  brand.series.flatMap((series) => series.models.map((model) => ({ brand, series, model }))),
);

const byId = new Map(allModels.map((ref) => [ref.model.id, ref]));
export const findModel = (id: string | null | undefined): ModelRef | undefined => (id ? byId.get(id) : undefined);
export const findBrand = (id: string | null | undefined): Brand | undefined => brands.find((b) => b.id === id);
