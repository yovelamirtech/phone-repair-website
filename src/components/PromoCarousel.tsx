import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { rtlLanguages, type LanguageCode } from '../config/site';
import { promos, type PromoTint } from '../data/promos';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLocalized } from '../lib/localized';
import { Photo } from './Photo';
import { buttonClass } from './ui/buttonClass';
import { Icon } from './ui/Icon';

const tintClass: Record<PromoTint, string> = {
  blue: 'bg-tint-blue',
  green: 'bg-tint-green',
  amber: 'bg-tint-amber',
  violet: 'bg-tint-violet',
};

const AUTOPLAY_MS = 5000;

export function PromoCarousel() {
  const { t, i18n } = useTranslation('home');
  const l = useLocalized();
  const reduced = useReducedMotion();
  const isRtl = rtlLanguages.includes(i18n.language as LanguageCode);

  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRtl ? 'rtl' : 'ltr', duration: reduced ? 0 : 30 },
    [autoplay],
  );

  const [selected, setSelected] = useState(0);
  /** user's choice via the play/pause button (null = default: play unless reduced motion) */
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reduced;
  /** temporarily paused by hover / focus / touch */
  const [interacting, setInteracting] = useState(false);
  const shouldPlay = playing && !interacting;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const plugin = emblaApi?.plugins()?.autoplay;
    if (!plugin) return;
    if (shouldPlay) plugin.play();
    else plugin.stop();
  }, [emblaApi, shouldPlay]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const rootRef = useRef<HTMLElement>(null);
  const onBlur = (e: React.FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setInteracting(false);
  };

  return (
    <section
      ref={rootRef}
      aria-roledescription={t('carousel.roledescription')}
      aria-label={t('carousel.label')}
      className="container-page pt-4 sm:pt-6"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={onBlur}
      onPointerDown={() => setInteracting(true)}
      onPointerUp={(e) => {
        if (e.pointerType !== 'mouse') setInteracting(false);
      }}
    >
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-(--radius-card)" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex touch-pan-y" aria-live={shouldPlay ? 'off' : 'polite'}>
            {promos.map((promo, i) => {
              const active = i === selected;
              return (
                <div
                  key={promo.id}
                  role="group"
                  aria-roledescription={t('carousel.slide')}
                  aria-label={t('carousel.slideOf', { index: i + 1, total: promos.length })}
                  aria-hidden={!active}
                  inert={!active}
                  className={`relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden ${tintClass[promo.tint]} aspect-[4/3] sm:aspect-[2/1] lg:aspect-[3/1]`}
                >
                  <div className="absolute inset-y-0 end-0 w-[46%] sm:w-1/2">
                    <Photo
                      name={promo.image}
                      alt={l(promo.imageAlt)}
                      sizes="(min-width: 1200px) 600px, 50vw"
                      priority={i === 0}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="relative flex h-full w-[60%] flex-col justify-center gap-2 px-5 py-6 sm:w-1/2 sm:gap-3 sm:px-10 lg:px-14">
                    <p className="text-[1.35rem] leading-tight font-bold tracking-tight text-balance sm:text-3xl lg:text-[2.6rem]">
                      {l(promo.title)}
                    </p>
                    <p className="line-clamp-3 text-sm text-muted sm:text-lg">{l(promo.subtitle)}</p>
                    <div className="mt-1 sm:mt-3">
                      <Link to={promo.cta.to} className={buttonClass('primary', 'md', 'text-sm sm:text-base')}>
                        {l(promo.cta.label)}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* arrows: desktop only */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label={t('carousel.prev')}
          className="absolute start-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-(--shadow-soft) hover:bg-white lg:grid"
        >
          <Icon icon={ChevronRight} directional size={24} />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label={t('carousel.next')}
          className="absolute end-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-(--shadow-soft) hover:bg-white lg:grid"
        >
          <Icon icon={ChevronLeft} directional size={24} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setUserPlaying(!playing)}
          aria-label={playing ? t('carousel.pause') : t('carousel.play')}
          className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
        >
          <Icon icon={playing ? Pause : Play} />
        </button>
        {promos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={t('carousel.goTo', { index: i + 1 })}
            aria-current={i === selected ? 'true' : undefined}
            className="group grid size-11 place-items-center"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === selected ? 'w-6 bg-ink' : 'w-2 bg-muted/50 group-hover:bg-muted'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
