import { describe, expect, it } from 'vitest';
import { allModels, findModel, type DeviceModel } from '../data/devices';
import { hasQualityOptions, repairs, tierMultipliers } from '../data/repairs';
import { estimateOrder, getRepairPrice, lowestPrice, roundPrice } from './pricing';

const model = (tier: DeviceModel['tier'], extra: Partial<DeviceModel> = {}): DeviceModel => ({
  id: 'test',
  name: 'Test',
  tier,
  year: 2026,
  ...extra,
});

describe('roundPrice', () => {
  it('always ends in 9 or 0', () => {
    for (let raw = 1; raw < 2000; raw += 0.7) {
      const r = roundPrice(raw);
      expect([0, 9]).toContain(r % 10);
    }
  });
  it('picks the nearest candidate', () => {
    expect(roundPrice(270)).toBe(270);
    expect(roundPrice(268)).toBe(269);
    expect(roundPrice(263)).toBe(260);
    expect(roundPrice(264.5)).toBe(269); // tie between 260 and 269 is 4.5 vs 4.5 → higher
    expect(roundPrice(382.5)).toBe(380);
    expect(roundPrice(0)).toBe(0);
  });
});

describe('getRepairPrice', () => {
  it('multiplies the base price by the tier multiplier', () => {
    expect(getRepairPrice(model('mid'), 'charging')?.amount).toBe(roundPrice(220 * tierMultipliers.mid));
    expect(getRepairPrice(model('premium'), 'screen', 'original')?.amount).toBe(roundPrice(450 * 1.9));
    expect(getRepairPrice(model('basic'), 'battery', 'compatible')?.amount).toBe(roundPrice(190 * 0.6));
  });

  it('uses original parts by default', () => {
    expect(getRepairPrice(model('flagship'), 'screen')).toEqual(getRepairPrice(model('flagship'), 'screen', 'original'));
  });

  it('a manual override beats the calculation', () => {
    const m = model('flagship', { priceOverrides: { 'screen:original': 999, charging: 123 } });
    expect(getRepairPrice(m, 'screen', 'original')?.amount).toBe(999);
    expect(getRepairPrice(m, 'screen', 'compatible')?.amount).toBe(roundPrice(290 * 1.3));
    expect(getRepairPrice(m, 'charging')?.amount).toBe(123);
  });

  it('returns null for repairs that do not apply to the model', () => {
    expect(getRepairPrice(model('basic', { excludeRepairs: ['backGlass'] }), 'backGlass')).toBeNull();
  });

  it('diagnosis is free and software is not tier-scaled', () => {
    expect(getRepairPrice(model('premium'), 'diagnosis')).toEqual({ amount: 0, startingFrom: false, free: true });
    expect(getRepairPrice(model('premium'), 'software')).toEqual({ amount: 150, startingFrom: true, free: false });
    expect(getRepairPrice(model('basic'), 'water')?.startingFrom).toBe(true);
  });

  it('gives every model in the catalog a sensible price for every applicable repair', () => {
    for (const { model: m } of allModels) {
      for (const r of repairs) {
        const qualities = hasQualityOptions(r) ? (['original', 'compatible'] as const) : [undefined];
        for (const q of qualities) {
          const quote = getRepairPrice(m, r.id, q);
          if (m.excludeRepairs?.includes(r.id)) expect(quote).toBeNull();
          else expect(quote!.amount).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});

describe('price list and order estimate always agree', () => {
  it('order total equals the sum of the price-list prices for the same model', () => {
    for (const { model: m } of allModels) {
      const selections = [
        { repairId: 'screen' as const, quality: 'compatible' as const },
        { repairId: 'battery' as const, quality: 'original' as const },
        { repairId: 'charging' as const },
        { repairId: 'diagnosis' as const },
      ];
      const listSum = selections.reduce((s, sel) => s + (getRepairPrice(m, sel.repairId, sel.quality)?.amount ?? 0), 0);
      expect(estimateOrder(m, selections).total).toBe(listSum);
    }
  });

  it('only diagnosis → free estimate', () => {
    const e = estimateOrder(model('mid'), [{ repairId: 'diagnosis' }]);
    expect(e.free).toBe(true);
    expect(e.total).toBe(0);
  });

  it('skips repairs that do not apply', () => {
    const m = model('basic', { excludeRepairs: ['backGlass'] });
    expect(estimateOrder(m, [{ repairId: 'backGlass' }, { repairId: 'charging' }]).lines).toHaveLength(1);
  });

  it('example override in the catalog is applied', () => {
    const se = findModel('iphone-se-2022');
    expect(se).toBeDefined();
    expect(getRepairPrice(se!.model, 'screen', 'original')?.amount).toBe(290);
  });

  it('lowest price is the minimum across all models', () => {
    const min = lowestPrice('charging');
    const all = allModels.map(({ model: m }) => getRepairPrice(m, 'charging')?.amount ?? Infinity);
    expect(min).toBe(Math.min(...all));
  });
});

describe('catalog', () => {
  it('model ids are unique', () => {
    const ids = allModels.map((r) => r.model.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
