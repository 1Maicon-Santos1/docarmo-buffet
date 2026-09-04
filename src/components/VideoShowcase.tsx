import { useEffect, useRef } from 'react';
import { videoSection, videos } from '../data/siteContent';
import { track } from '../lib/analytics';

/**
 * Vídeos reais dos eventos.
 *
 * A seção só existe quando há vídeos cadastrados em `siteContent.videos`.
 * Nunca há autoplay nem áudio: o visitante decide quando assistir, o vídeo
 * começa sem som e pausa sozinho ao sair da tela.
 */
export function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videos.length === 0) return;
    const elements = Array.from(containerRef.current?.querySelectorAll('video') ?? []);
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!entry.isIntersecting && !video.paused) video.pause();
        });
      },
      { threshold: 0.25 },
    );

    elements.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

  if (videos.length === 0) return null;

  return (
    <section className="section videos" id="videos" aria-labelledby="videos-title">
      <div className="wrap videos__layout">
        <header className="section__head reveal">
          <p className="eyebrow">{videoSection.eyebrow}</p>
          <h2 id="videos-title">{videoSection.title}</h2>
          <p className="lede">{videoSection.lede}</p>
          <p className="videos__note">{videoSection.note}</p>
        </header>

        <div className="videos__grid" ref={containerRef}>
          {videos.map((video) => (
            <figure className="videos__item reveal" key={video.src}>
              <video
                controls
                muted
                playsInline
                preload="metadata"
                poster={video.poster}
                width={video.width}
                height={video.height}
                onPlay={() => track('video_play', { video: video.src })}
              >
                <source src={video.src} type="video/mp4" />
                Seu navegador não consegue exibir este vídeo.
              </video>
              <figcaption>
                <strong>{video.title}</strong>
                <span>{video.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
