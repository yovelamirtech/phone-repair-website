import { useTranslation } from 'react-i18next';
import { Seo } from '../../components/Seo';

export default function HomePage() {
  const { t } = useTranslation('home');
  return (
    <>
      <Seo />
      <section className="container-page section">
        <h1 className="text-4xl font-bold sm:text-5xl">{t('title')}</h1>
      </section>
    </>
  );
}
