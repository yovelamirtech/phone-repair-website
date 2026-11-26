import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, Phone, X } from 'lucide-react';
import { routes } from '../../config/routes';
import { business } from '../../data/business';
import { telLink, whatsappLink } from '../../lib/links';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Logo } from '../Logo';
import { WhatsAppGlyph } from '../WhatsApp';
import { ButtonAnchor, ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { mainNav } from './navItems';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-medium transition-colors ${
    isActive ? 'text-ink bg-surface' : 'text-muted hover:text-ink'
  }`;

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // the menu remembers the page it was opened on, so navigating anywhere closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpenOn(null), []);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label={t('header.mainNav')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((key) => (
              <li key={key}>
                <NavLink to={routes[key]} className={navLinkClass}>
                  {t(`nav.${key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <ButtonLink to={routes.order}>{t('nav.order')}</ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-surface lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('header.menuOpen')}
            onClick={() => setOpenOn(pathname)}
          >
            <Icon icon={Menu} size={24} />
          </button>
        </div>
      </div>

      {/* portal: the header's backdrop-filter would otherwise trap position:fixed inside it */}
      {open && createPortal(<MobileMenu onClose={closeMenu} returnFocusTo={toggleRef} />, document.body)}
    </header>
  );
}

function MobileMenu({ onClose, returnFocusTo }: { onClose: () => void; returnFocusTo: React.RefObject<HTMLButtonElement | null> }) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const toggle = returnFocusTo.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select') ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [onClose, returnFocusTo]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('header.menuTitle')}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg lg:hidden"
    >
      <div className="container-page flex h-16 shrink-0 items-center justify-between">
        <Logo />
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full hover:bg-surface"
          aria-label={t('header.menuClose')}
          onClick={onClose}
        >
          <Icon icon={X} size={24} />
        </button>
      </div>
      <nav aria-label={t('header.mainNav')} className="container-page flex-1 pt-4">
        <ul className="flex flex-col">
          {(['home', ...mainNav] as const).map((key) => (
            <li key={key} className="border-b border-line">
              <NavLink
                to={routes[key]}
                end={key === 'home'}
                className={({ isActive }) =>
                  `flex min-h-14 items-center text-2xl font-semibold ${isActive ? 'text-accent-strong' : 'text-ink'}`
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
        <LanguageSwitcher className="mt-4" />
      </nav>
      <div className="container-page grid shrink-0 gap-3 pt-6 pb-8">
        <ButtonLink to={routes.order} size="lg">
          {t('nav.order')}
        </ButtonLink>
        <div className="grid grid-cols-2 gap-3">
          <ButtonAnchor href={telLink()} variant="secondary">
            <Icon icon={Phone} />
            <span>{t('contact.call')}</span>
          </ButtonAnchor>
          <ButtonAnchor href={whatsappLink(t('whatsapp.greeting'))} target="_blank" rel="noopener noreferrer" variant="whatsapp">
            <WhatsAppGlyph />
            <span>{t('contact.whatsapp')}</span>
          </ButtonAnchor>
        </div>
        <p className="text-center text-sm text-muted">
          <span className="ltr-nums">{business.phone}</span>
        </p>
      </div>
    </div>
  );
}
