import { useTranslation } from 'react-i18next';
import { routes } from '../../config/routes';
import { Seo } from '../../components/Seo';
import { ButtonLink } from '../../components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation('notFound');
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section text-center">
        <p className="text-7xl font-bold tracking-tight text-line sm:text-9xl" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">{t('text')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to={routes.home} size="lg">
            {t('home')}
          </ButtonLink>
          <ButtonLink to={routes.order} size="lg" variant="secondary">
            {t('order')}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
