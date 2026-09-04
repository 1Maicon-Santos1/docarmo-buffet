/** Ordem das etapas e regras de validação do orçamento guiado. */
import { quoteCopy } from '../data/siteContent';
import type { QuoteData } from '../types/quote';
import { totalGuests } from './whatsapp';
import { isPastDate, isValidDate, isValidPhoneBR, isValidTime, sanitizeText } from './validation';

export const STEPS = [
  'eventType',
  'date',
  'period',
  'place',
  'guests',
  'interests',
  'restrictions',
  'notes',
  'contact',
  'review',
] as const;

export type StepId = (typeof STEPS)[number];

export const REVIEW_STEP = STEPS.length - 1;

/** Retorna a mensagem de erro da etapa, ou null quando estiver tudo certo. */
export function validateStep(step: StepId, data: QuoteData): string | null {
  const errors = quoteCopy.errors;
  switch (step) {
    case 'eventType':
      if (!data.eventType) return errors.eventType;
      if (data.eventType === 'outro' && sanitizeText(data.eventTypeOther).length < 2) {
        return errors.eventTypeOther;
      }
      return null;
    case 'date':
      if (data.dateUndecided) return null;
      if (!isValidDate(data.date)) return errors.date;
      if (isPastDate(data.date)) return errors.datePast;
      return null;
    case 'period':
      if (!data.period) return errors.period;
      if (data.time && !isValidTime(data.time)) return errors.time;
      return null;
    case 'place':
      if (sanitizeText(data.city).length < 2) return errors.city;
      if (!data.venueDefined) return errors.venue;
      return null;
    case 'guests':
      if (totalGuests(data) < 1) return errors.guests;
      return null;
    case 'interests':
      if (data.interests.length === 0) return errors.interests;
      if (data.interests.includes('outro') && sanitizeText(data.interestsOther).length < 2) {
        return errors.interestsOther;
      }
      return null;
    case 'restrictions':
      if (!data.restrictions) return errors.restrictions;
      if (data.restrictions === 'sim' && sanitizeText(data.restrictionsDetails).length < 2) {
        return errors.restrictionsDetails;
      }
      return null;
    case 'notes':
      return null;
    case 'contact':
      if (sanitizeText(data.name).length < 2) return errors.name;
      if (!isValidPhoneBR(data.phone)) return errors.phone;
      if (!data.consent) return errors.consent;
      return null;
    case 'review':
      return null;
  }
}
