import { about } from '../data/siteContent';
import { Picture } from './Picture';

export function About() {
  return (
    <section className="section about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <div className="about__text reveal">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="about-title">{about.title}</h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <figure className="about__figure reveal">
          <Picture name={about.image} sizes="(min-width: 900px) 38vw, 86vw" />
          <figcaption>{about.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
