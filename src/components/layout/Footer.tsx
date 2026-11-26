import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { routes } from '../../config/routes';
import { siteConfig } from '../../config/site';
import { business } from '../../data/business';
import { useLocalized } from '../../lib/localized';
import { ContactList } from '../ContactList';
import { HoursTable, OpenNowBadge } from '../Hours';
import { Logo } from '../Logo';
import { footerNav, legalNav } from './navItems';

export function Footer() {
  const { t } = useTranslation();
  const l = useLocalized();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line bg-surface text-[0.95rem]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid content-start gap-4">
          <Logo />
          <p className="max-w-xs text-muted">{t('footer.about')}</p>
        </div>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="mb-3 text-base font-semibold">
            {t('footer.linksTitle')}
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-1">
            {footerNav.map((key) => (
              <li key={key}>
                <Link to={routes[key]} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-base font-semibold">{t('footer.contactTitle')}</h2>
          <ContactList className="text-muted" />
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold">{t('footer.hoursTitle')}</h2>
          <OpenNowBadge className="mb-3" />
          <HoursTable />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t('footer.rights', { year, name: l(business.name) })}
            {siteConfig.demoMode && <span> · {t('footer.demoNote')}</span>}
          </p>
          <ul className="flex gap-4">
            {legalNav.map((key) => (
              <li key={key}>
                <Link to={routes[key]} className="inline-flex min-h-11 items-center hover:text-ink">
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
