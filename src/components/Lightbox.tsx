import { useEffect, useRef } from 'react';
import { useDialogBehavior } from '../hooks/useDialogBehavior';
import type { GalleryItem } from '../data/siteContent';
import { media } from '../data/media.generated';
import { Picture } from './Picture';

interface LightboxProps {
  items: readonly GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const item = items[index];

  useDialogBehavior(panelRef, true, onClose);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onNavigate((index + 1) % items.length);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, items.length, onNavigate]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="lightbox__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Foto ${index + 1} de ${items.length}: ${item.caption}`}
        ref={panelRef}
        tabIndex={-1}
      >
        <button type="button" className="lightbox__close" onClick={onClose} data-autofocus="">
          <span className="visually-hidden">Fechar galeria</span>
          <span aria-hidden="true">×</span>
        </button>

        <figure className="lightbox__figure">
          <Picture name={item.image} sizes="(min-width: 900px) 70vw, 96vw" priority />
          <figcaption>
            <span className="lightbox__caption">{item.caption}</span>
            <span className="lightbox__counter">
              {index + 1} / {items.length}
            </span>
            <span className="visually-hidden">{media[item.image].alt}</span>
          </figcaption>
        </figure>

        <div className="lightbox__nav">
          <button
            type="button"
            className="lightbox__arrow"
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
          >
            <span className="visually-hidden">Foto anterior</span>
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="lightbox__arrow"
            onClick={() => onNavigate((index + 1) % items.length)}
          >
            <span className="visually-hidden">Próxima foto</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
