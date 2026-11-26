import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { findModel, OTHER_BRAND_ID } from '../../data/devices';
import { hasQualityOptions, repairById, type PartQuality, type RepairId } from '../../data/repairs';
import { readJson, removeItem, storageKeys, writeJson } from '../../lib/storage';
import { defaultQuality, type RepairSelection } from '../../lib/pricing';

export const steps = ['brand', 'model', 'issue', 'time', 'details', 'summary'] as const;
export type StepId = (typeof steps)[number];

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  consentPrivacy: boolean;
  consentBackup: boolean;
};

export type OrderDraft = {
  step: number;
  brandId: string | null;
  modelId: string | null;
  otherModel: string;
  selections: RepairSelection[];
  date: string | null;
  time: string | null;
  details: CustomerDetails;
};

export const emptyDraft: OrderDraft = {
  step: 0,
  brandId: null,
  modelId: null,
  otherModel: '',
  selections: [],
  date: null,
  time: null,
  details: { name: '', phone: '', email: '', notes: '', consentPrivacy: false, consentBackup: false },
};

/** Israeli mobile: starts with 05, 10 digits, dashes optional (050-1234567, 050-123-4567, 0501234567). */
export const ISRAELI_MOBILE = /^05\d-?\d{3}-?\d{4}$/;

/** Error messages are i18n keys in the "order" namespace. */
export const detailsSchema = z.object({
  name: z.string().trim().min(2, { error: 'errors.name' }),
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/\s+/g, ''))
    .pipe(z.string().regex(ISRAELI_MOBILE, { error: 'errors.phone' })),
  email: z.union([z.literal(''), z.email({ error: 'errors.email' })]),
  notes: z.string().max(500, { error: 'errors.notes' }),
  consentPrivacy: z.literal(true, { error: 'errors.consentPrivacy' }),
  consentBackup: z.literal(true, { error: 'errors.consentBackup' }),
});

/** Build the starting draft from ?model=&repair=&quality= (links from the price list and promos). */
export function draftFromParams(params: URLSearchParams, base: OrderDraft): OrderDraft | null {
  const modelId = params.get('model');
  const repair = params.get('repair') as RepairId | null;
  const quality = params.get('quality') as PartQuality | null;
  if (!modelId && !repair) return null;

  const ref = findModel(modelId);
  const draft: OrderDraft = { ...emptyDraft, details: base.details };
  const validRepair = repair && repair in repairById ? repair : null;
  if (validRepair) {
    const r = repairById[validRepair];
    draft.selections = [
      {
        repairId: validRepair,
        quality: hasQualityOptions(r) ? (quality === 'compatible' ? 'compatible' : defaultQuality) : undefined,
      },
    ];
  }
  if (ref) {
    draft.brandId = ref.brand.id;
    draft.modelId = ref.model.id;
    draft.step = steps.indexOf('issue');
  }
  return draft;
}

/** Order draft that survives a refresh (sessionStorage). */
export function useOrderDraft(initial: () => OrderDraft) {
  const [draft, setDraft] = useState<OrderDraft>(initial);
  useEffect(() => {
    writeJson(storageKeys.orderDraft, draft, 'session');
  }, [draft]);
  const update = useCallback((patch: Partial<OrderDraft> | ((d: OrderDraft) => Partial<OrderDraft>)) => {
    setDraft((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }));
  }, []);
  const reset = useCallback(() => {
    removeItem(storageKeys.orderDraft, 'session');
    setDraft(emptyDraft);
  }, []);
  return { draft, update, reset };
}

export const loadSavedDraft = (): OrderDraft => {
  const saved = readJson<Partial<OrderDraft> | null>(storageKeys.orderDraft, null, 'session');
  return saved ? { ...emptyDraft, ...saved, details: { ...emptyDraft.details, ...saved.details } } : emptyDraft;
};

/** Is the given step complete (so "next" may continue)? */
export function stepComplete(step: StepId, d: OrderDraft): boolean {
  switch (step) {
    case 'brand':
      return Boolean(d.brandId);
    case 'model':
      return d.brandId === OTHER_BRAND_ID ? d.otherModel.trim().length >= 2 : Boolean(findModel(d.modelId));
    case 'issue':
      return d.selections.length > 0;
    case 'time':
      return Boolean(d.date && d.time);
    case 'details':
      return detailsSchema.safeParse(d.details).success;
    case 'summary':
      return true;
  }
}
