import { routes } from '../../config/routes';
import type { PartQuality, RepairId } from '../../data/repairs';

/** Link into the order wizard with choices pre-selected (used by the price list and promos). */
export function orderLink(opts: { model?: string; repair?: RepairId; quality?: PartQuality } = {}): string {
  const params = new URLSearchParams();
  if (opts.model) params.set('model', opts.model);
  if (opts.repair) params.set('repair', opts.repair);
  if (opts.quality) params.set('quality', opts.quality);
  const qs = params.toString();
  return qs ? `${routes.order}?${qs}` : routes.order;
}
