import { experience } from '../data/siteContent';
import { Picture } from './Picture';

export function Experience() {
  return (
    <section className="section experience" id="experiencia" aria-labelledby="experience-title">
      <div className="wrap">
        <header className="section__head reveal">
          <p className="eyebrow">{experience.eyebrow}</p>
          <h2 id="experience-title">{experience.title}</h2>
          <p className="lede">{experience.lede}</p>
        </header>

        <ul className="experience__grid">
          {experience.tiles.map((tile) => (
            <li className="experience__tile reveal" key={tile.title}>
              <div className="experience__media">
                <Picture name={tile.image} sizes="(min-width: 900px) 30vw, 84vw" />
              </div>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
            </li>
          ))}
        </ul>

        <div className="menu-card reveal">
          <div className="menu-card__head">
            <h3>{experience.menu.title}</h3>
            <p>{experience.menu.note}</p>
          </div>
          <div className="menu-card__columns">
            {experience.menu.columns.map((column) => (
              <div className="menu-card__column" key={column.title}>
                <h4>{column.title}</h4>
                <ul>
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
