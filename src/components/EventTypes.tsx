import { eventTypes } from '../data/siteContent';
import { Picture } from './Picture';
import { useQuoteLauncher } from './quote/quoteContext';

export function EventTypes() {
  const { openQuote } = useQuoteLauncher();

  return (
    <section className="section events" id="eventos" aria-labelledby="events-title">
      <div className="wrap">
        <header className="section__head reveal">
          <p className="eyebrow">{eventTypes.eyebrow}</p>
          <h2 id="events-title">{eventTypes.title}</h2>
          <p className="lede">{eventTypes.lede}</p>
        </header>

        <ul className="events__grid">
          {eventTypes.cards.map((card) => (
            <li className="event-card reveal" key={card.id}>
              <div className="event-card__media">
                <Picture name={card.image} sizes="(min-width: 900px) 24vw, 82vw" />
              </div>
              <div className="event-card__body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <button
                  type="button"
                  className="event-card__cta"
                  onClick={() => openQuote({ eventType: card.id, source: 'eventos' })}
                >
                  Montar orçamento
                  <span className="visually-hidden"> para {card.title.toLowerCase()}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          ))}

          <li className="event-card event-card--wide reveal">
            <div className="event-card__body">
              <h3>{eventTypes.otherCard.title}</h3>
              <p>{eventTypes.otherCard.description}</p>
              <button
                type="button"
                className="event-card__cta"
                onClick={() => openQuote({ eventType: eventTypes.otherCard.id, source: 'eventos-outro' })}
              >
                Contar sobre o meu evento
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
