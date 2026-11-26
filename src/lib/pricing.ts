/**
 * The ONE place prices are calculated. The price list and the order wizard both call these
 * functions, so a model's price is always identical in both places.
 */
import { allModels, type DeviceModel, type PriceKey } from '../data/devices';
import {
  hasQualityOptions,
  repairById,
  repairs,
  tierMultipliers,
  type PartQuality,
  type Repair,
  type RepairId,
} from '../data/repairs';

export type PriceQuote = {
  amount: number;
  /** price shown as "from" (final price after inspection) */
  startingFrom: boolean;
  free: boolean;
};

/**
 * Round to the nearest whole price that ends in 9 or 0 (…, 259, 260, 269, 270, …).
 * Ties go to the higher price.
 */
export function roundPrice(raw: number): number {
  if (raw <= 0) return 0;
  const n = Math.round(raw);
  const tens = Math.floor(n / 10) * 10;
  const candidates = [tens - 1, tens, tens + 9, tens + 10].filter((c) => c > 0);
  let best = candidates[0] ?? 0;
  for (const c of candidates) {
    const d = Math.abs(c - raw);
    const bd = Math.abs(best - raw);
    if (d < bd || (d === bd && c > best)) best = c;
  }
  return best;
}

export function isRepairAvailable(model: DeviceModel, repairId: RepairId): boolean {
  return !model.excludeRepairs?.includes(repairId);
}

export function availableRepairs(model: DeviceModel): Repair[] {
  return repairs.filter((r) => isRepairAvailable(model, r.id));
}

/** Default part quality for repairs that have options. */
export const defaultQuality: PartQuality = 'original';

/**
 * Price of one repair on one model. Returns null when the repair doesn't apply to the model.
 * For screen/battery, `quality` picks original or compatible (default: original).
 */
export function getRepairPrice(model: DeviceModel, repairId: RepairId, quality: PartQuality = defaultQuality): PriceQuote | null {
  if (!isRepairAvailable(model, repairId)) return null;
  const repair = repairById[repairId];
  const startingFrom = repair.startingFrom ?? false;

  const key: PriceKey = hasQualityOptions(repair) ? `${repairId}:${quality}` : repairId;
  const override = model.priceOverrides?.[key];
  if (override != null) return { amount: override, startingFrom, free: override === 0 };

  const base = hasQualityOptions(repair) ? repair.basePrice[quality] : repair.basePrice;
  if (base === 0) return { amount: 0, startingFrom: false, free: true };
  const amount = repair.tierScaled ? roundPrice(base * tierMultipliers[model.tier]) : base;
  return { amount, startingFrom, free: false };
}

export type RepairSelection = { repairId: RepairId; quality?: PartQuality };

export type Estimate = {
  total: number;
  startingFrom: boolean;
  /** only free items (diagnosis) were picked */
  free: boolean;
  lines: { repairId: RepairId; quality?: PartQuality; quote: PriceQuote }[];
};

/** Sum of the selected repairs for a model, using exactly getRepairPrice(). */
export function estimateOrder(model: DeviceModel, selections: RepairSelection[]): Estimate {
  const lines = selections.flatMap((s) => {
    const quote = getRepairPrice(model, s.repairId, s.quality);
    return quote ? [{ repairId: s.repairId, quality: s.quality, quote }] : [];
  });
  const total = lines.reduce((sum, l) => sum + l.quote.amount, 0);
  return {
    total,
    startingFrom: lines.some((l) => l.quote.startingFrom),
    free: lines.length > 0 && lines.every((l) => l.quote.free),
    lines,
  };
}

/** Lowest price of a repair across all models (for "from ₪X" on the home page). */
export function lowestPrice(repairId: RepairId): number | null {
  const repair = repairById[repairId];
  const qualities: (PartQuality | undefined)[] = hasQualityOptions(repair) ? ['original', 'compatible'] : [undefined];
  let min: number | null = null;
  for (const { model } of allModels) {
    for (const q of qualities) {
      const quote = getRepairPrice(model, repairId, q);
      if (quote && (min === null || quote.amount < min)) min = quote.amount;
    }
  }
  return min;
}
