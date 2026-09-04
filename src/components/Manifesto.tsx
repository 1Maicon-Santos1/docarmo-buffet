import { manifesto } from '../data/siteContent';
import { Picture } from './Picture';

export function Manifesto() {
  return (
    <section className="section manifesto" aria-labelledby="manifesto-title">
      <div className="wrap manifesto__grid">
        <figure className="manifesto__figure reveal">
          <Picture name={manifesto.image} sizes="(min-width: 900px) 42vw, 88vw" />
          <figcaption>Mesa montada durante o serviço de um evento</figcaption>
        </figure>

        <div className="manifesto__text reveal">
          <p className="eyebrow">{manifesto.eyebrow}</p>
          <h2 id="manifesto-title">{manifesto.title}</h2>
          {manifesto.paragraphs.map((paragraph) => (
            <p className="manifesto__paragraph" key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}

          <ul className="manifesto__points">
            {manifesto.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <p className="manifesto__highlight">{manifesto.highlight}</p>
        </div>
      </div>
    </section>
  );
}
