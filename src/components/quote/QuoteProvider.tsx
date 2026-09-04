import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { track } from '../../lib/analytics';
import type { EventTypeId } from '../../types/quote';
import { QuoteContext, type OpenQuoteOptions } from './quoteContext';
import { QuoteWizard } from './QuoteWizard';

/** Mantém o orçamento guiado disponível para qualquer botão da página. */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState<EventTypeId | undefined>(undefined);

  const openQuote = useCallback((options: OpenQuoteOptions = {}) => {
    setEventType(options.eventType);
    setOpen(true);
    track('quote_start', { source: options.source ?? 'site', event_type: options.eventType ?? 'nao-informado' });
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      {open ? <QuoteWizard onClose={() => setOpen(false)} initialEventType={eventType} /> : null}
    </QuoteContext.Provider>
  );
}
