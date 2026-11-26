import { useTranslation } from 'react-i18next';
import { Seo } from '../../components/Seo';

export default function PricesPage() {
  const { t } = useTranslation('prices');
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <section className="container-page section">
        <h1 className="text-4xl font-bold sm:text-5xl">{t('title')}</h1>
      </section>
    </>
  );
}
