import { footer, nav, site } from '../data/siteContent';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark size={44} />
          <p className="site-footer__name">{site.name}</p>
          <p className="site-footer__family">{footer.familyLine}</p>
        </div>

        <div className="site-footer__contact">
          <h2>Contato</h2>
          <p>{site.region}</p>
          <p>
            WhatsApp{' '}
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
              {site.whatsapp.display}
            </a>
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Seções do site (rodapé)">
          <h2>Navegar</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wrap site-footer__legal">
        <p>{footer.privacy}</p>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
