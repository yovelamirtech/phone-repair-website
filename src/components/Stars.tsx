import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

/** Star rating. The visual stars are hidden; screen readers get "Rating: 5 of 5". */
export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const { t } = useTranslation();
  return (
    <span className={`relative inline-flex items-center gap-0.5 ${className}`}>
      <span className="sr-only">{t('reviews.rating', { rating, max: 5 })}</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className={i <= Math.round(rating) ? 'fill-warning text-warning' : 'text-line'}
        />
      ))}
    </span>
  );
}
