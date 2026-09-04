import { hero, site } from '../data/siteContent';
import { Picture } from './Picture';
import { useQuoteLauncher } from './quote/quoteContext';

export function Hero() {
  const { openQuote } = useQuoteLauncher();

  return (
    <section className="hero" id="topo">
      <div className="hero__inner wrap">
        <div className="hero__media">
          <Picture
            name={hero.image}
            sizes="(min-width: 900px) 46vw, 100vw"
            priority
            alt="Mesa comprida com bandejas de saladas coloridas, folhas, manga e morangos, montada pelo Buffet José do Carmo em um evento."
          />
          <span className="hero__scrim" aria-hidden="true" />
        </div>

        <div className="hero__content">
        <p className="hero__eyebrow">{hero.eyebrow}</p>
        <h1 className="hero__headline">{hero.headline}</h1>
        <p className="hero__sub">{hero.subheadline}</p>

        <div className="hero__actions">
          <button type="button" className="btn btn--primary" onClick={() => openQuote({ source: 'hero' })}>
            {hero.primaryCta}
          </button>
          <a className="btn btn--ghost hero__secondary" href="#galeria">
            {hero.secondaryCta}
          </a>
        </div>

        <p className="hero__safety">{hero.safetyLine}</p>

        <p className="hero__place">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
            />
          </svg>
          {hero.locationBadge}
          <span className="hero__dot" aria-hidden="true">
            •
          </span>
          <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
            {site.whatsapp.display}
          </a>
        </p>
        </div>
      </div>
    </section>
  );
}
