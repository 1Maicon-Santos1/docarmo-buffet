/**
 * Eventos de analytics desacoplados.
 *
 * Nada é instalado por aqui: se existir um `window.dataLayer` (Google Tag
 * Manager, por exemplo), o evento é empilhado nele. Se não existir, a função
 * simplesmente não faz nada.
 *
 * Regra fixa: nunca enviar nome, telefone, observações ou qualquer dado pessoal.
 */

export type AnalyticsEvent =
  | 'quote_start'
  | 'quote_step_completed'
  | 'quote_review_viewed'
  | 'whatsapp_quote_click'
  | 'gallery_open'
  | 'video_play';

/** Só valores não identificáveis: número da etapa, id de opção, origem do clique. */
export type AnalyticsParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === 'undefined' || !Array.isArray(window.dataLayer)) return;
  try {
    window.dataLayer.push({ event, ...params });
  } catch {
    /* analytics nunca pode quebrar a página */
  }
}
