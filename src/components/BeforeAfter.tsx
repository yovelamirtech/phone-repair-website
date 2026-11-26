import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Photo } from './Photo';

type Props = {
  before: { image: string; alt: string };
  after: { image: string; alt: string };
  label: string;
};

/**
 * Before/after comparison. A native range input sits on top of the images, so it works with
 * a finger (drag), mouse, and keyboard (arrow keys, Home/End) and is announced by screen readers.
 * Laid out left-to-right on purpose: "before" is always on the left of the divider.
 */
export function BeforeAfter({ before, after, label }: Props) {
  const { t } = useTranslation('gallery');
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <div dir="ltr" className="relative aspect-[4/5] overflow-hidden rounded-(--radius-card) bg-surface select-none has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent">
      <Photo name={after.image} alt={after.alt} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo name={before.image} alt={before.alt} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
      </div>

      {/* divider + handle (visual only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-(--shadow-lift)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18-6-6 6-6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <span aria-hidden="true" className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink">
        {t('before')}
      </span>
      <span aria-hidden="true" className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink">
        {t('after')}
      </span>

      <label htmlFor={id} className="sr-only">
        {t('sliderLabel', { title: label })}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={t('sliderValue', { before: pos, after: 100 - pos })}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
