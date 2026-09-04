import { useEffect, useState } from 'react';
import { nav, site } from '../data/siteContent';
import { useQuoteLauncher } from './quote/quoteContext';
import { Wordmark } from './Wordmark';

export function Header() {
  const { openQuote } = useQuoteLauncher();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={menuOpen || undefined}>
      <div className="site-header__bar wrap">
        <a className="brand" href="#topo" aria-label={`${site.name} — início`}>
          <Wordmark />
          <span className="brand__name">
            <span className="brand__small">Buffet</span>
            <span className="brand__big">José do Carmo</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Seções do site">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="btn btn--primary site-header__cta"
            onClick={() => openQuote({ source: 'header' })}
          >
            Pedir orçamento
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="visually-hidden">{menuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
            <span className="menu-toggle__icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="menu-mobile" id="menu-mobile" hidden={!menuOpen}>
        <ul className="wrap">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp {site.whatsapp.display}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
