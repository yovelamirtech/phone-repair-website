import { useTranslation } from 'react-i18next';
import { formatPrice } from '../lib/format';
import type { PriceQuote } from '../lib/pricing';

/** Renders a quote: "חינם", "₪290" or "החל מ־₪250". */
export function PriceTag({ quote, forceFrom = false, className = '' }: { quote: PriceQuote; forceFrom?: boolean; className?: string }) {
  const { t, i18n } = useTranslation();
  if (quote.free) return <span className={className}>{t('price.free')}</span>;
  const price = formatPrice(quote.amount, i18n.language);
  return <span className={className}>{quote.startingFrom || forceFrom ? t('price.from', { price }) : price}</span>;
}
