import { useEffect } from 'react';

/**
 * Revela os blocos `.reveal` conforme entram na tela.
 * Com `prefers-reduced-motion`, tudo já nasce visível (regra no CSS) e o
 * observador nem é criado.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (elements.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
