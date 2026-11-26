import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleCheck, Clock, LoaderCircle, MapPin, Navigation } from 'lucide-react';
import { routes } from '../../config/routes';
import { siteConfig } from '../../config/site';
import { business } from '../../data/business';
import { ISRAELI_MOBILE } from '../../features/order/state';
import { ContactList } from '../../components/ContactList';
import { HoursTable, OpenNowBadge } from '../../components/Hours';
import { MapEmbed } from '../../components/MapEmbed';
import { Seo } from '../../components/Seo';
import { WhatsAppGlyph } from '../../components/WhatsApp';
import { Button, ButtonAnchor } from '../../components/ui/Button';
import { Checkbox, TextArea, TextField } from '../../components/ui/Field';
import { Icon } from '../../components/ui/Icon';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { googleMapsLink, wazeLink, whatsappLink } from '../../lib/links';
import { useLocalized } from '../../lib/localized';
import { submitContactMessage } from '../../services/orders';

const schema = z.object({
  name: z.string().trim().min(2, { error: 'errors.name' }),
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/\s+/g, ''))
    .pipe(z.string().regex(ISRAELI_MOBILE, { error: 'errors.phone' })),
  email: z.union([z.literal(''), z.email({ error: 'errors.email' })]),
  message: z.string().trim().min(5, { error: 'errors.message' }).max(1000, { error: 'errors.messageLong' }),
  consent: z.literal(true, { error: 'errors.consent' }),
});
type Values = z.input<typeof schema>;

export default function ContactPage() {
  const { t } = useTranslation('contact');
  const l = useLocalized();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema) as never,
    defaultValues: { name: '', phone: '', email: '', message: '', consent: false as unknown as true },
  });

  const onSubmit = async (v: Values) => {
    await submitContactMessage({ name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim() || undefined, message: v.message.trim() });
    setSent(true);
    reset();
  };

  const name = watch('name');
  const message = watch('message');
  const waText = [t('whatsappIntro'), name && t('whatsappName', { name }), message].filter(Boolean).join('\n');
  const err = (key?: string) => (key ? t(key) : undefined);

  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section">
        <SectionHeading as="h1" title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
          {/* form */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">{t('form.title')}</h2>
            {siteConfig.demoMode && <p className="mt-1 text-sm text-muted">{t('form.demoNote')}</p>}

            {sent ? (
              <div className="mt-6 grid justify-items-start gap-3" role="status">
                <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success-ink">
                  <Icon icon={CircleCheck} size={24} />
                </span>
                <p className="text-xl font-semibold">{t('form.sentTitle')}</p>
                <p className="text-muted">{t('form.sentText')}</p>
                <Button variant="secondary" onClick={() => setSent(false)}>
                  {t('form.another')}
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label={t('form.name')} autoComplete="name" error={err(errors.name?.message)} {...register('name')} />
                  <TextField
                    label={t('form.phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    dir="ltr"
                    className="text-end"
                    placeholder="050-1234567"
                    error={err(errors.phone?.message)}
                    {...register('phone')}
                  />
                </div>
                <TextField
                  label={t('form.email')}
                  optional={t('form.optional')}
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  className="text-end"
                  error={err(errors.email?.message)}
                  {...register('email')}
                />
                <TextArea label={t('form.message')} maxLength={1000} error={err(errors.message?.message)} {...register('message')} />
                <Checkbox
                  label={
                    <>
                      {t('form.consent')}{' '}
                      <Link to={routes.privacy} target="_blank" className="font-medium text-accent-strong underline">
                        {t('form.privacyLink')}
                      </Link>
                    </>
                  }
                  error={err(errors.consent?.message)}
                  {...register('consent')}
                />
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
                    {isSubmitting && <LoaderCircle size={20} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />}
                    {isSubmitting ? t('form.sending') : t('form.submit')}
                  </Button>
                  <ButtonAnchor href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
                    <WhatsAppGlyph />
                    {t('form.whatsapp')}
                  </ButtonAnchor>
                </div>
              </form>
            )}
          </div>

          {/* details */}
          <div className="grid content-start gap-8">
            <div>
              <h2 className="mb-3 text-xl font-semibold">{t('details')}</h2>
              <ContactList className="text-lg" />
            </div>
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                <Icon icon={Clock} className="text-accent" />
                {t('common:footer.hoursTitle')}
              </h2>
              <OpenNowBadge className="mb-3" />
              <HoursTable />
            </div>
          </div>
        </div>

        {/* map + navigation */}
        <section aria-labelledby="map-title" className="mt-16">
          <h2 id="map-title" className="flex items-center gap-2 text-2xl font-bold">
            <Icon icon={MapPin} size={24} className="text-accent" />
            {t('map.heading')}
          </h2>
          <p className="mt-1 text-muted">
            {l(business.address.street)}, {l(business.address.city)} · {t('map.parking')}
          </p>
          <MapEmbed className="mt-6 h-80 sm:h-96" />
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonAnchor href={wazeLink()} target="_blank" rel="noopener noreferrer" variant="secondary">
              <Icon icon={Navigation} />
              {t('map.waze')}
            </ButtonAnchor>
            <ButtonAnchor href={googleMapsLink()} target="_blank" rel="noopener noreferrer" variant="secondary">
              <Icon icon={MapPin} />
              {t('map.google')}
            </ButtonAnchor>
          </div>
        </section>
      </section>
    </>
  );
}
