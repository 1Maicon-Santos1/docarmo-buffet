import { createContext, useContext } from 'react';
import type { EventTypeId } from '../../types/quote';

export interface OpenQuoteOptions {
  /** Pré-seleciona o tipo de evento (usado pelos cards da seção Eventos). */
  eventType?: EventTypeId;
  /** Origem do clique, só para analytics (nunca dado pessoal). */
  source?: string;
}

export interface QuoteLauncher {
  openQuote: (options?: OpenQuoteOptions) => void;
}

export const QuoteContext = createContext<QuoteLauncher | null>(null);

export function useQuoteLauncher(): QuoteLauncher {
  const launcher = useContext(QuoteContext);
  if (!launcher) throw new Error('useQuoteLauncher precisa estar dentro de <QuoteProvider>.');
  return launcher;
}
