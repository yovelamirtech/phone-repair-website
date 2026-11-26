import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Layers,
  Lock,
  MapPin,
  Navigation,
  ScanSearch,
  ShieldCheck,
  Stethoscope,
  Timer,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { routes } from '../../config/routes';
import { business } from '../../data/business';
import { gallery } from '../../data/gallery';
import { repairs } from '../../data/repairs';
import { averageRating, reviews } from '../../data/reviews';
import { warranty } from '../../data/warranty';
import { HoursTable, OpenNowBadge } from '../../components/Hours';
import { Photo } from '../../components/Photo';
import { PromoCarousel } from '../../components/PromoCarousel';
import { Seo } from '../../components/Seo';
import { Stars } from '../../components/Stars';
import { ButtonAnchor, ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { formatNumber, formatPrice } from '../../lib/format';
import { googleMapsLink, wazeLink } from '../../lib/links';
import { useLocalized } from '../../lib/localized';
import { lowestPrice } from '../../lib/pricing';

export default function HomePage() {
  return (
    <>
      <Seo />
      <PromoCarousel />
      <Hero />
      <PopularRepairs />
      <HowItWorks />
      <WhyUs />
      <ReviewsStrip />
      <GalleryPeek />
      <LocationStrip />
      <FinalCta />
    </>
  );
}

function Hero() {
  const { t } = useTranslation('home');
  return (
    <section className="container-page pt-12 pb-16 text-center sm:pt-16 sm:pb-20">
      <OpenNowBadge className="justify-center" />
      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t('hero.title')}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">{t('hero.subtitle')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to={routes.order} size="lg">
          {t('hero.ctaOrder')}
        </ButtonLink>
        <ButtonLink to={routes.prices} size="lg" variant="secondary">
          {t('hero.ctaPrices')}
        </ButtonLink>
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <li>{t('hero.point1')}</li>
        <li aria-hidden="true">·</li>
        <li>{t('hero.point2', { months: warranty.originalPartMonths })}</li>
        <li aria-hidden="true">·</li>
        <li>{t('hero.point3')}</li>
      </ul>
    </section>
  );
}

function PopularRepairs() {
  const { t, i18n } = useTranslation('home');
  const l = useLocalized();
  const popular = repairs.filter((r) => r.popular);
  return (
    <Reveal as="section" className="bg-surface section" aria-labelledby="popular-title">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="popular-title" title={t('popular.title')} subtitle={t('popular.subtitle')} />
          <Link to={routes.prices} className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-strong hover:underline">
            {t('popular.all')}
            <Icon icon={ArrowLeft} directional />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((r) => {
            const from = lowestPrice(r.id);
            return (
              <li key={r.id}>
                <Link
                  to={`${routes.prices}?repair=${r.id}`}
                  className="card card-lift flex h-full flex-col gap-4 p-6"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                    <Icon icon={r.icon} size={24} />
                  </span>
                  <span className="text-xl font-semibold">{l(r.name)}</span>
                  <span className="flex-1 text-muted">{l(r.description)}</span>
                  <span className="flex items-baseline justify-between gap-2 border-t border-line pt-4">
                    <span className="font-semibold">
                      {from != null && t('common:price.from', { price: formatPrice(from, i18n.language) })}
                    </span>
                    <span className="text-sm text-muted">{l(r.duration)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-muted">{t('common:price.vatIncluded')}</p>
      </div>
    </Reveal>
  );
}

const steps: { key: string; icon: LucideIcon }[] = [
  { key: 'book', icon: CalendarCheck },
  { key: 'diagnose', icon: ScanSearch },
  { key: 'repair', icon: Wrench },
  { key: 'pickup', icon: ShieldCheck },
];

function HowItWorks() {
  const { t } = useTranslation('home');
  return (
    <Reveal as="section" className="section" aria-labelledby="how-title">
      <div className="container-page">
        <SectionHeading id="how-title" title={t('how.title')} subtitle={t('how.subtitle')} align="center" />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.key} className="relative text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-white">
                <Icon icon={s.icon} size={24} />
              </span>
              <span className="mt-4 block text-sm font-semibold text-accent-strong">{t('how.stepLabel', { n: i + 1 })}</span>
              <h3 className="mt-1 text-xl font-semibold">{t(`how.steps.${s.key}.title`)}</h3>
              <p className="mt-2 text-muted">{t(`how.steps.${s.key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

const reasons: { key: string; icon: LucideIcon }[] = [
  { key: 'transparent', icon: BadgeCheck },
  { key: 'diagnosis', icon: Stethoscope },
  { key: 'warranty', icon: ShieldCheck },
  { key: 'fast', icon: Timer },
  { key: 'parts', icon: Layers },
  { key: 'privacy', icon: Lock },
];

function WhyUs() {
  const { t } = useTranslation('home');
  return (
    <Reveal as="section" className="bg-surface section" aria-labelledby="why-title">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[5fr_6fr]">
        <div>
          <SectionHeading
            id="why-title"
            title={t('why.title')}
            subtitle={t('why.subtitle', { years: business.technician.yearsOfExperience })}
          />
          <Photo
            name="workbench-tools"
            alt={t('why.imageAlt')}
            sizes="(min-width: 1024px) 500px, 100vw"
            className="mt-8 aspect-[4/3] w-full rounded-(--radius-card) object-cover"
          />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {reasons.map((r) => (
            <li key={r.key} className="card p-6">
              <Icon icon={r.icon} size={24} className="text-accent-strong" />
              <h3 className="mt-3 text-lg font-semibold">
                {t(`why.items.${r.key}.title`, { months: warranty.originalPartMonths })}
              </h3>
              <p className="mt-1 text-muted">{t(`why.items.${r.key}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function ReviewsStrip() {
  const { t, i18n } = useTranslation('home');
  const l = useLocalized();
  return (
    <Reveal as="section" className="section" aria-labelledby="reviews-title">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="reviews-title" title={t('reviews.title')} />
          <p className="flex items-center gap-2 text-muted">
            <Stars rating={averageRating} />
            <span>
              {t('reviews.summary', {
                avg: formatNumber(Math.round(averageRating * 10) / 10, i18n.language),
                count: reviews.length,
              })}
            </span>
          </p>
        </div>
      </div>
      <ul
        className="container-page relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]"
        tabIndex={0}
        aria-label={t('reviews.listLabel')}
      >
        {reviews.map((r) => (
          <li key={r.id} className="card flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[360px]">
            <Stars rating={r.rating} />
            <blockquote className="mt-4 flex-1 text-lg leading-relaxed">“{l(r.text)}”</blockquote>
            <footer className="mt-5 border-t border-line pt-4 text-sm">
              <span className="font-semibold">{l(r.name)}</span>
              <span className="text-muted">
                {' · '}
                <span className="ltr-nums">{r.model}</span>
              </span>
            </footer>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function GalleryPeek() {
  const { t } = useTranslation('home');
  const l = useLocalized();
  return (
    <Reveal as="section" className="bg-surface section" aria-labelledby="gallery-title">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="gallery-title" title={t('gallery.title')} subtitle={t('gallery.subtitle')} />
          <Link to={routes.gallery} className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-strong hover:underline">
            {t('gallery.all')}
            <Icon icon={ArrowLeft} directional />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {gallery.slice(0, 3).map((g) => (
            <li key={g.id} className="card overflow-hidden">
              <div className="grid grid-cols-2">
                {(['before', 'after'] as const).map((side) => (
                  <figure key={side} className="relative">
                    <Photo
                      name={g[side].image}
                      alt={l(g[side].alt)}
                      sizes="(min-width: 768px) 200px, 50vw"
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <figcaption className="absolute start-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold">
                      {t(`gallery.${side}`)}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="p-4 font-semibold">{l(g.title)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function LocationStrip() {
  const { t } = useTranslation('home');
  const l = useLocalized();
  return (
    <Reveal as="section" className="section" aria-labelledby="location-title">
      <div className="container-page">
        <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-3 lg:items-center">
          <div>
            <h2 id="location-title" className="text-3xl font-bold tracking-tight">
              {t('location.title')}
            </h2>
            <p className="mt-3 flex items-start gap-2 text-lg">
              <Icon icon={MapPin} className="mt-1 text-accent" />
              <span>
                {l(business.address.street)}, {l(business.address.city)}
              </span>
            </p>
            <p className="mt-1 text-muted">{t('location.parking')}</p>
          </div>
          <div>
            <p className="mb-3 flex items-center gap-2 font-semibold">
              <Icon icon={Clock} className="text-accent" />
              {t('common:footer.hoursTitle')}
            </p>
            <OpenNowBadge className="mb-3" />
            <HoursTable />
          </div>
          <div className="flex flex-col gap-3">
            <ButtonAnchor href={wazeLink()} target="_blank" rel="noopener noreferrer" variant="secondary">
              <Icon icon={Navigation} />
              {t('location.waze')}
            </ButtonAnchor>
            <ButtonAnchor href={googleMapsLink()} target="_blank" rel="noopener noreferrer" variant="secondary">
              <Icon icon={MapPin} />
              {t('location.google')}
            </ButtonAnchor>
            <ButtonLink to={routes.contact} variant="ghost">
              {t('location.contact')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function FinalCta() {
  const { t } = useTranslation('home');
  return (
    <Reveal as="section" className="section pt-0" aria-labelledby="cta-title">
      <div className="container-page">
        <div className="rounded-(--radius-card) bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{t('cta.subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={routes.order} size="lg" className="bg-white !text-ink hover:!bg-surface">
              {t('cta.order')}
            </ButtonLink>
            <ButtonLink to={routes.status} size="lg" variant="secondary" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">
              {t('cta.status')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
