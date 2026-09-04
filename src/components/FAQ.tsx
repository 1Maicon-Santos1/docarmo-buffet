import { faq } from '../data/siteContent';

export function FAQ() {
  return (
    <section className="section faq" id="perguntas" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <header className="section__head reveal">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 id="faq-title">{faq.title}</h2>
        </header>

        <div className="faq__list reveal">
          {faq.items.map((item) => (
            <details className="faq__item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
