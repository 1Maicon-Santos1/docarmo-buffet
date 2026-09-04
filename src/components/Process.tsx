import { process } from '../data/siteContent';

export function Process() {
  return (
    <section className="section process" id="como-funciona" aria-labelledby="process-title">
      <div className="wrap">
        <header className="section__head reveal">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 id="process-title">{process.title}</h2>
        </header>

        <ol className="process__list">
          {process.steps.map((step, index) => (
            <li className="process__step reveal" key={step.title}>
              <span className="process__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>

        <p className="process__note reveal">{process.note}</p>
      </div>
    </section>
  );
}
