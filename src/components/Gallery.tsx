import { useState } from 'react';
import { gallery } from '../data/siteContent';
import { track } from '../lib/analytics';
import { Lightbox } from './Lightbox';
import { Picture } from './Picture';

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = (index: number) => {
    setOpenIndex(index);
    track('gallery_open', { position: index + 1, photo: gallery.items[index].image });
  };

  return (
    <section className="section galeria" id="galeria" aria-labelledby="gallery-title">
      <div className="wrap">
        <header className="section__head reveal">
          <p className="eyebrow">{gallery.eyebrow}</p>
          <h2 id="gallery-title">{gallery.title}</h2>
          <p className="lede">{gallery.lede}</p>
          <p className="galeria__hint">{gallery.hint}</p>
        </header>
      </div>

      <ul className="galeria__grid wrap">
        {gallery.items.map((item, index) => (
          <li className="galeria__item reveal" key={item.image} data-size={item.size ?? 'normal'}>
            <button type="button" className="galeria__button" onClick={() => open(index)}>
              <Picture name={item.image} sizes="(min-width: 900px) 32vw, 78vw" />
              <span className="galeria__caption">
                <span className="galeria__captionText">{item.caption}</span>
                <span className="galeria__zoom" aria-hidden="true">
                  ⤢
                </span>
              </span>
              <span className="visually-hidden">Ampliar foto</span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null ? (
        <Lightbox
          items={gallery.items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </section>
  );
}
