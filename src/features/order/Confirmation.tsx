import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarPlus, CircleCheck, Navigation, Search } from 'lucide-react';
import { routes } from '../../config/routes';
import { business } from '../../data/business';
import { WhatsAppGlyph } from '../../components/WhatsApp';
import { Button, ButtonAnchor, ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { googleMapsLink, whatsappLink } from '../../lib/links';
import { useLocalized } from '../../lib/localized';
import type { Estimate } from '../../lib/pricing';
import { buildIcs, downloadIcs } from './calendar';
import type { OrderDraft } from './state';
import { useOrderText } from './useOrderText';

export type ConfirmedOrder = { orderNumber: string; draft: OrderDraft; estimate: Estimate | null };

export function Confirmation({ order }: { order: ConfirmedOrder }) {
  const { t } = useTranslation('order');
  const l = useLocalized();
  const text = useOrderText();
  const { draft, orderNumber, estimate } = order;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  const device = text.deviceName(draft);
  const repairs = text.repairsText(draft.selections);
  const when = draft.date && draft.time ? text.appointmentText(draft.date, draft.time) : '';
  const address = `${l(business.address.street)}, ${l(business.address.city)}`;

  const message = [
    t('whatsapp.intro', { name: l(business.name) }),
    t('whatsapp.order', { order: orderNumber }),
    t('whatsapp.device', { device }),
    t('whatsapp.repairs', { repairs }),
    t('whatsapp.appointment', { when }),
    t('whatsapp.estimate', { estimate: text.estimateText(estimate) }),
    t('whatsapp.customer', { name: draft.details.name, phone: draft.details.phone }),
    draft.details.notes.trim() ? t('whatsapp.notes', { notes: draft.details.notes.trim() }) : '',
  ]
    .filter(Boolean)
    .join('\n');

  const addToCalendar = () => {
    if (!draft.date || !draft.time) return;
    const ics = buildIcs({
      uid: `${orderNumber}@pixellab`,
      date: draft.date,
      time: draft.time,
      title: t('calendar.title', { name: l(business.name), device }),
      description: t('calendar.description', { order: orderNumber, repairs, phone: business.phone }),
      location: address,
    });
    downloadIcs(`${orderNumber}.ics`, ics);
  };

  const rows = [
    { label: t('summary.device'), value: device },
    { label: t('summary.repairs'), value: repairs },
    { label: t('summary.appointment'), value: when },
    { label: t('summary.address'), value: address },
    { label: t('estimate.label'), value: text.estimateText(estimate) },
  ];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success-ink">
        <CircleCheck size={24} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-4xl font-bold tracking-tight outline-none sm:text-5xl">
        {t('confirm.title')}
      </h1>
      <p className="mt-3 text-lg text-muted">{t('confirm.subtitle', { name: draft.details.name })}</p>

      <div className="card mt-8 p-6">
        <p className="text-sm text-muted">{t('confirm.orderNumber')}</p>
        <p className="mt-1 text-4xl font-bold tracking-wider">
          <span className="ltr-nums">{orderNumber}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{t('confirm.keepNumber')}</p>
        <dl className="mt-6 grid gap-3 border-t border-line pt-6 text-start">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-muted">{r.label}</dt>
              <dd className="text-end font-medium">
                <bdi>{r.value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-start text-sm text-muted">{t('estimate.note')}</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <ButtonAnchor href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          <WhatsAppGlyph />
          {t('confirm.whatsapp')}
        </ButtonAnchor>
        <Button onClick={addToCalendar} variant="secondary" size="lg">
          <Icon icon={CalendarPlus} />
          {t('confirm.calendar')}
        </Button>
        <ButtonLink to={`${routes.status}?order=${orderNumber}`} variant="secondary" size="lg">
          <Icon icon={Search} />
          {t('confirm.status')}
        </ButtonLink>
        <ButtonAnchor href={googleMapsLink()} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
          <Icon icon={Navigation} />
          {t('confirm.navigate')}
        </ButtonAnchor>
      </div>
    </div>
  );
}
