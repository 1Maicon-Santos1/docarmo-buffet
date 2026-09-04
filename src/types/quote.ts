/** Tipos do orçamento guiado. */

export type EventTypeId =
  | 'casamento'
  | 'aniversario'
  | 'festa'
  | 'confraternizacao'
  | 'empresarial'
  | 'outro';

export type PeriodId = 'manha' | 'almoco' | 'tarde' | 'noite' | 'indefinido';

export type InterestId =
  | 'refeicao-completa'
  | 'entradas'
  | 'saladas'
  | 'frutas'
  | 'bebidas'
  | 'ajuda'
  | 'outro';

export type YesNo = 'sim' | 'nao';

export type RestrictionAnswer = 'nao' | 'sim' | 'nao-sei';

export interface QuoteData {
  eventType: EventTypeId | null;
  eventTypeOther: string;
  dateUndecided: boolean;
  date: string;
  period: PeriodId | null;
  time: string;
  city: string;
  neighborhood: string;
  venueDefined: YesNo | null;
  venueName: string;
  adults: number;
  children: number;
  interests: InterestId[];
  interestsOther: string;
  restrictions: RestrictionAnswer | null;
  restrictionsDetails: string;
  notes: string;
  name: string;
  phone: string;
  consent: boolean;
}

export const emptyQuote: QuoteData = {
  eventType: null,
  eventTypeOther: '',
  dateUndecided: false,
  date: '',
  period: null,
  time: '',
  city: '',
  neighborhood: '',
  venueDefined: null,
  venueName: '',
  adults: 0,
  children: 0,
  interests: [],
  interestsOther: '',
  restrictions: null,
  restrictionsDetails: '',
  notes: '',
  name: '',
  phone: '',
  consent: false,
};

/** Rótulos legíveis usados no resumo e na mensagem do WhatsApp. */
export const eventTypeLabels: Record<EventTypeId, string> = {
  casamento: 'Casamento',
  aniversario: 'Aniversário',
  festa: 'Festa',
  confraternizacao: 'Confraternização',
  empresarial: 'Evento empresarial',
  outro: 'Outro',
};

export const periodLabels: Record<PeriodId, string> = {
  manha: 'Manhã',
  almoco: 'Almoço',
  tarde: 'Tarde',
  noite: 'Jantar/noite',
  indefinido: 'Ainda não definido',
};

export const interestLabels: Record<InterestId, string> = {
  'refeicao-completa': 'Refeição completa em self-service',
  entradas: 'Entradas e petiscos',
  saladas: 'Saladas e acompanhamentos',
  frutas: 'Mesa de frutas',
  bebidas: 'Bebidas/drinks',
  ajuda: 'Quero ajuda para escolher',
  outro: 'Outro',
};

export const restrictionLabels: Record<RestrictionAnswer, string> = {
  nao: 'Não',
  sim: 'Sim',
  'nao-sei': 'Ainda não sei',
};
