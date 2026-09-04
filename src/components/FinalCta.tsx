import { finalCta, site } from '../data/siteContent';
import { useQuoteLauncher } from './quote/quoteContext';

export function FinalCta() {
  const { openQuote } = useQuoteLauncher();

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="wrap final-cta__inner reveal">
        <h2 id="final-cta-title">{finalCta.title}</h2>
        <p>{finalCta.description}</p>
        <div className="final-cta__actions">
          <button type="button" className="btn btn--primary" onClick={() => openQuote({ source: 'cta-final' })}>
            {finalCta.button}
          </button>
          <a className="btn btn--onDark" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
            Falar direto no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
