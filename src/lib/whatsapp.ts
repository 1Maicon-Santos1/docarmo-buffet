/**
 * Montagem da mensagem enviada ao WhatsApp do Buffet José do Carmo.
 *
 * Regras: só entram na mensagem as respostas realmente preenchidas, nada de
 * "undefined", "null" ou colchetes, acentos preservados e data em pt-BR.
 * O número de destino fica em `src/data/siteContent.ts`.
 */
import { site } from '../data/siteContent';
import {
  eventTypeLabels,
  interestLabels,
  periodLabels,
  restrictionLabels,
  type QuoteData,
} from '../types/quote';
import {
  clampGuests,
  formatDateBR,
  formatPhoneReadable,
  isValidTime,
  sanitizeMultiline,
  sanitizeText,
} from './validation';

const GREETING = `Olá, ${site.name}! 👋`;
const INTRO = 'Gostaria de solicitar um orçamento para o meu evento.';
const HEADING = 'DADOS DO EVENTO';
const SIGNATURE = 'Orçamento iniciado pelo site.';

/** Campo já formatado — `value: null` significa "não responder essa linha". */
export interface QuoteField {
  key:
    | 'name'
    | 'phone'
    | 'eventType'
    | 'date'
    | 'schedule'
    | 'place'
    | 'venue'
    | 'guests'
    | 'interests'
    | 'restrictions'
    | 'notes';
  emoji: string;
  label: string;
  value: string | null;
}

function plural(count: number, singular: string, pluralWord: string): string {
  return `${count} ${count === 1 ? singular : pluralWord}`;
}

/** Total de convidados (adultos + crianças), sempre dentro de limites válidos. */
export function totalGuests(data: Pick<QuoteData, 'adults' | 'children'>): number {
  return clampGuests(data.adults) + clampGuests(data.children);
}

function guestsValue(data: QuoteData): string | null {
  const adults = clampGuests(data.adults);
  const children = clampGuests(data.children);
  const total = adults + children;
  if (total === 0) return null;
  if (adults > 0 && children > 0) {
    return `${plural(adults, 'adulto', 'adultos')} + ${plural(children, 'criança', 'crianças')} = ${plural(
      total,
      'pessoa',
      'pessoas',
    )}`;
  }
  if (adults > 0) return `${plural(adults, 'adulto', 'adultos')} = ${plural(total, 'pessoa', 'pessoas')}`;
  return `${plural(children, 'criança', 'crianças')} = ${plural(total, 'pessoa', 'pessoas')}`;
}

function eventTypeValue(data: QuoteData): string | null {
  if (!data.eventType) return null;
  const label = eventTypeLabels[data.eventType];
  const detail = sanitizeText(data.eventTypeOther, 80);
  if (data.eventType === 'outro' && detail) return `${label} — ${detail}`;
  return label;
}

function dateValue(data: QuoteData): string | null {
  if (data.dateUndecided) return 'Ainda não definida';
  return formatDateBR(data.date) || null;
}

function scheduleValue(data: QuoteData): string | null {
  const period = data.period ? periodLabels[data.period] : '';
  const time = isValidTime(data.time) ? data.time : '';
  if (period && time) return `${period} · ${time}`;
  return period || time || null;
}

function placeValue(data: QuoteData): string | null {
  const city = sanitizeText(data.city, 80);
  const neighborhood = sanitizeText(data.neighborhood, 80);
  if (city && neighborhood) return `${city} — ${neighborhood}`;
  return city || neighborhood || null;
}

function venueValue(data: QuoteData): string | null {
  if (!data.venueDefined) return null;
  if (data.venueDefined === 'nao') return 'Ainda não definido';
  const venue = sanitizeText(data.venueName, 120);
  return venue ? `Sim — ${venue}` : 'Sim';
}

function interestsValue(data: QuoteData): string | null {
  if (data.interests.length === 0) return null;
  const other = sanitizeText(data.interestsOther, 120);
  const parts = data.interests.map((interest) =>
    interest === 'outro' && other ? `${interestLabels.outro}: ${other}` : interestLabels[interest],
  );
  return parts.join(', ');
}

function restrictionsValue(data: QuoteData): string | null {
  if (!data.restrictions) return null;
  const label = restrictionLabels[data.restrictions];
  const details = sanitizeText(data.restrictionsDetails, 240);
  if (data.restrictions === 'sim' && details) return `${label} — ${details}`;
  return label;
}

/**
 * Descreve o orçamento em campos prontos para leitura.
 * Usado tanto pelo resumo na tela quanto pela mensagem do WhatsApp.
 */
export function describeQuote(data: QuoteData): QuoteField[] {
  return [
    { key: 'name', emoji: '👤', label: 'Nome', value: sanitizeText(data.name, 80) || null },
    { key: 'phone', emoji: '📱', label: 'WhatsApp', value: data.phone ? formatPhoneReadable(data.phone) : null },
    { key: 'eventType', emoji: '🎉', label: 'Tipo de evento', value: eventTypeValue(data) },
    { key: 'date', emoji: '📅', label: 'Data', value: dateValue(data) },
    { key: 'schedule', emoji: '🕒', label: 'Horário/período', value: scheduleValue(data) },
    { key: 'place', emoji: '📍', label: 'Cidade/bairro', value: placeValue(data) },
    { key: 'venue', emoji: '🏠', label: 'Local definido', value: venueValue(data) },
    { key: 'guests', emoji: '👥', label: 'Convidados', value: guestsValue(data) },
    { key: 'interests', emoji: '🍽️', label: 'Interesses', value: interestsValue(data) },
    { key: 'restrictions', emoji: '🥗', label: 'Preferências ou restrições', value: restrictionsValue(data) },
    { key: 'notes', emoji: '📝', label: 'Observações', value: sanitizeMultiline(data.notes) || null },
  ];
}

/** Texto final da mensagem. Linhas opcionais vazias são omitidas. */
export function buildWhatsAppMessage(data: QuoteData): string {
  const lines = describeQuote(data)
    .filter((field): field is QuoteField & { value: string } => Boolean(field.value))
    .map((field) => `${field.emoji} ${field.label}: ${field.value}`);

  return [GREETING, INTRO, '', HEADING, ...lines, '', SIGNATURE].join('\n');
}

/** Link wa.me com a mensagem codificada — gerado no momento do clique. */
export function buildWhatsAppUrl(data: QuoteData): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`;
}
