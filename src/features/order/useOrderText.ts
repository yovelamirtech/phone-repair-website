import { useTranslation } from 'react-i18next';
import { findBrand, findModel, OTHER_BRAND_ID } from '../../data/devices';
import { repairById } from '../../data/repairs';
import { formatDate, formatPrice } from '../../lib/format';
import { useLocalized } from '../../lib/localized';
import { zonedTimeToUtc } from '../../lib/time';
import type { Estimate, RepairSelection } from '../../lib/pricing';
import type { OrderDraft } from './state';

/** Human-readable pieces of an order, used by the summary, confirmation, WhatsApp text and calendar file. */
export function useOrderText() {
  const { t, i18n } = useTranslation('order');
  const l = useLocalized();

  const deviceName = (d: Pick<OrderDraft, 'brandId' | 'modelId' | 'otherModel'>) => {
    if (d.brandId === OTHER_BRAND_ID) return d.otherModel.trim();
    const ref = findModel(d.modelId);
    if (ref) return ref.model.name;
    const brand = findBrand(d.brandId);
    return brand ? l(brand.name) : '';
  };

  const repairLabel = (s: RepairSelection) => {
    const name = l(repairById[s.repairId].name);
    return s.quality ? `${name} (${t(`quality.${s.quality}`)})` : name;
  };

  const repairsText = (selections: RepairSelection[]) => selections.map(repairLabel).join(', ');

  const appointmentText = (date: string, time: string) =>
    t('summary.appointmentValue', {
      date: formatDate(zonedTimeToUtc(date, time), i18n.language, { weekday: 'long', day: 'numeric', month: 'long' }),
      time,
    });

  const estimateText = (estimate: Estimate | null) => {
    if (!estimate) return t('estimate.afterDiagnosis');
    if (estimate.free) return t('estimate.freeDiagnosis');
    const price = formatPrice(estimate.total, i18n.language);
    return estimate.startingFrom ? t('common:price.from', { price }) : price;
  };

  return { deviceName, repairLabel, repairsText, appointmentText, estimateText };
}
