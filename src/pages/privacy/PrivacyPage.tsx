import { useTranslation } from 'react-i18next';
import { ProsePage } from '../../components/ProsePage';
import { Seo } from '../../components/Seo';
import { business } from '../../data/business';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');
  return (
    <>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <ProsePage ns="privacy" values={{ email: business.email, phone: business.phone }} />
    </>
  );
}
