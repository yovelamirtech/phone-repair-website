import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { repairById } from '../../data/repairs';
import { sampleOrders } from '../../data/sampleOrders';
import { normalizeOrderNumber } from '../../features/order/orderNumber';
import { Seo } from '../../components/Seo';
import { StatusTimeline } from '../../components/StatusTimeline';
import { WhatsAppGlyph } from '../../components/WhatsApp';
import { Button, ButtonAnchor } from '../../components/ui/Button';
import { TextField } from '../../components/ui/Field';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { whatsappLink } from '../../lib/links';
import { useLocalized } from '../../lib/localized';
import { getOrderStatus, type OrderStatus } from '../../services/orders';

const schema = z.object({
  order: z.string().refine((v) => normalizeOrderNumber(v) !== null, { error: 'errors.order' }),
  last4: z.string().trim().regex(/^\d{4}$/, { error: 'errors.last4' }),
});
type FormValues = z.infer<typeof schema>;

export default function StatusPage() {
  const { t } = useTranslation('status');
  const l = useLocalized();
  const [params] = useSearchParams();
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { order: params.get('order') ?? '', last4: '' },
  });

  // arriving from the confirmation screen with the number filled in: jump to the digits
  useEffect(() => {
    if (params.get('order')) setFocus('last4');
  }, [params, setFocus]);

  const onSubmit = async (values: FormValues) => {
    setNotFound(false);
    setResult(null);
    const status = await getOrderStatus(normalizeOrderNumber(values.order)!, values.last4.trim());
    if (status) setResult(status);
    else setNotFound(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const err = (key?: string) => (key ? t(key) : undefined);

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section grid gap-12 lg:grid-cols-[2fr_3fr]">
        <div>
          <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />
          <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="card mt-8 grid gap-4 p-6">
            <TextField
              label={t('form.order')}
              placeholder="FX-1024"
              dir="ltr"
              className="text-end uppercase"
              autoComplete="off"
              error={err(errors.order?.message)}
              {...register('order')}
            />
            <TextField
              label={t('form.last4')}
              hint={t('form.last4Hint')}
              inputMode="numeric"
              maxLength={4}
              dir="ltr"
              className="text-end tracking-[0.3em]"
              autoComplete="off"
              error={err(errors.last4?.message)}
              {...register('last4')}
            />
            <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting && <LoaderCircle size={20} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />}
              {isSubmitting ? t('form.checking') : t('form.submit')}
            </Button>
          </form>

          {siteConfig.demoMode && (
            <div className="mt-6 rounded-2xl bg-surface p-5 text-sm">
              <p className="font-semibold">{t('demo.title')}</p>
              <p className="mt-1 text-muted">{t('demo.text')}</p>
              <ul className="mt-3 grid gap-1">
                {sampleOrders.map((o) => (
                  <li key={o.orderNumber} className="flex justify-between gap-4">
                    <span className="ltr-nums font-medium">{o.orderNumber}</span>
                    <span className="text-muted">
                      {t('demo.digits')} <span className="ltr-nums">{o.phoneLast4}</span> · {t(`steps.${o.status}.name`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none">
          {result && (
            <div className="card p-6 sm:p-8">
              <p className="text-sm text-muted">{t('result.order')}</p>
              <h2 className="text-3xl font-bold">
                <span className="ltr-nums">{result.orderNumber}</span>
              </h2>
              <p className="mt-2 text-muted">
                <bdi>{result.deviceName}</bdi> · {result.repairs.map((r) => l(repairById[r].name)).join(', ')}
              </p>
              <div className="mt-8">
                <StatusTimeline status={result} />
              </div>
            </div>
          )}
          {notFound && (
            <div className="card p-6 sm:p-8" role="alert">
              <h2 className="text-2xl font-semibold">{t('notFound.title')}</h2>
              <p className="mt-2 text-muted">{t('notFound.text')}</p>
              <ButtonAnchor
                href={whatsappLink(t('notFound.whatsappText'))}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                className="mt-6"
              >
                <WhatsAppGlyph />
                {t('notFound.whatsapp')}
              </ButtonAnchor>
            </div>
          )}
          {!result && !notFound && (
            <div className="hidden h-full min-h-64 place-items-center rounded-(--radius-card) border border-dashed border-line p-8 text-center text-muted lg:grid">
              {t('placeholder')}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
