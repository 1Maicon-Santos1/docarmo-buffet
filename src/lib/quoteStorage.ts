/**
 * Rascunho do orçamento guardado apenas em sessionStorage.
 *
 * Some quando a aba é fechada, nunca sai do navegador e pode ser apagado
 * pelo visitante no botão "Recomeçar".
 */
import { emptyQuote, type QuoteData } from '../types/quote';
import { clampGuests } from './validation';

const STORAGE_KEY = 'bjc:orcamento:v1';

export interface QuoteDraft {
  data: QuoteData;
  step: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/** Reconstrói o rascunho campo a campo — nada vindo do storage entra sem checagem. */
function reviveQuote(raw: unknown): QuoteData | null {
  if (!isRecord(raw)) return null;
  const interests = Array.isArray(raw.interests)
    ? raw.interests.filter((item): item is QuoteData['interests'][number] => typeof item === 'string')
    : [];

  return {
    ...emptyQuote,
    eventType: (asString(raw.eventType) || null) as QuoteData['eventType'],
    eventTypeOther: asString(raw.eventTypeOther),
    dateUndecided: raw.dateUndecided === true,
    date: asString(raw.date),
    period: (asString(raw.period) || null) as QuoteData['period'],
    time: asString(raw.time),
    city: asString(raw.city),
    neighborhood: asString(raw.neighborhood),
    venueDefined: (asString(raw.venueDefined) || null) as QuoteData['venueDefined'],
    venueName: asString(raw.venueName),
    adults: clampGuests(Number(raw.adults)),
    children: clampGuests(Number(raw.children)),
    interests,
    interestsOther: asString(raw.interestsOther),
    restrictions: (asString(raw.restrictions) || null) as QuoteData['restrictions'],
    restrictionsDetails: asString(raw.restrictionsDetails),
    notes: asString(raw.notes),
    name: asString(raw.name),
    phone: asString(raw.phone),
    consent: raw.consent === true,
  };
}

export function loadQuoteDraft(): QuoteDraft | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) return null;
    const data = reviveQuote(parsed.data);
    if (!data) return null;
    const step = Number(parsed.step);
    return { data, step: Number.isFinite(step) && step >= 0 ? Math.trunc(step) : 0 };
  } catch {
    return null;
  }
}

export function saveQuoteDraft(draft: QuoteDraft): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* modo privado ou storage cheio: seguir sem salvar */
  }
}

export function clearQuoteDraft(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada a fazer */
  }
}
