import { describe, expect, it } from 'vitest';
import { STEPS, validateStep } from './quoteRules';
import { emptyQuote, type QuoteData } from '../types/quote';
import { todayISO } from './validation';

const quote = (patch: Partial<QuoteData> = {}): QuoteData => ({ ...emptyQuote, ...patch });

describe('validateStep', () => {
  it('cobre todas as dez etapas do orçamento', () => {
    expect(STEPS).toHaveLength(10);
    expect(STEPS[STEPS.length - 1]).toBe('review');
  });

  it('exige o tipo de evento e o detalhe quando for "Outro"', () => {
    expect(validateStep('eventType', quote())).not.toBeNull();
    expect(validateStep('eventType', quote({ eventType: 'festa' }))).toBeNull();
    expect(validateStep('eventType', quote({ eventType: 'outro' }))).not.toBeNull();
    expect(validateStep('eventType', quote({ eventType: 'outro', eventTypeOther: 'Formatura' }))).toBeNull();
  });

  it('aceita seguir sem data, mas bloqueia data passada', () => {
    expect(validateStep('date', quote())).not.toBeNull();
    expect(validateStep('date', quote({ dateUndecided: true }))).toBeNull();
    expect(validateStep('date', quote({ date: '2020-01-01' }))).not.toBeNull();
    expect(validateStep('date', quote({ date: todayISO() }))).toBeNull();
    expect(validateStep('date', quote({ date: '2099-12-31' }))).toBeNull();
  });

  it('exige período e valida o horário opcional', () => {
    expect(validateStep('period', quote())).not.toBeNull();
    expect(validateStep('period', quote({ period: 'almoco' }))).toBeNull();
    expect(validateStep('period', quote({ period: 'almoco', time: '25:00' }))).not.toBeNull();
    expect(validateStep('period', quote({ period: 'almoco', time: '12:30' }))).toBeNull();
  });

  it('exige cidade e a resposta sobre o local', () => {
    expect(validateStep('place', quote())).not.toBeNull();
    expect(validateStep('place', quote({ city: 'Aguaí' }))).not.toBeNull();
    expect(validateStep('place', quote({ city: 'Aguaí', venueDefined: 'nao' }))).toBeNull();
    expect(validateStep('place', quote({ city: 'Aguaí', venueDefined: 'sim' }))).toBeNull();
  });

  it('exige pelo menos um convidado', () => {
    expect(validateStep('guests', quote())).not.toBeNull();
    expect(validateStep('guests', quote({ children: 1 }))).toBeNull();
    expect(validateStep('guests', quote({ adults: 30, children: 5 }))).toBeNull();
  });

  it('exige pelo menos um interesse e o detalhe de "Outro"', () => {
    expect(validateStep('interests', quote())).not.toBeNull();
    expect(validateStep('interests', quote({ interests: ['frutas'] }))).toBeNull();
    expect(validateStep('interests', quote({ interests: ['outro'] }))).not.toBeNull();
    expect(
      validateStep('interests', quote({ interests: ['outro'], interestsOther: 'Mesa de café' })),
    ).toBeNull();
  });

  it('exige resposta sobre restrições e detalhe quando for "Sim"', () => {
    expect(validateStep('restrictions', quote())).not.toBeNull();
    expect(validateStep('restrictions', quote({ restrictions: 'nao' }))).toBeNull();
    expect(validateStep('restrictions', quote({ restrictions: 'sim' }))).not.toBeNull();
    expect(
      validateStep('restrictions', quote({ restrictions: 'sim', restrictionsDetails: 'Sem lactose' })),
    ).toBeNull();
  });

  it('deixa as observações livres', () => {
    expect(validateStep('notes', quote())).toBeNull();
  });

  it('exige nome, WhatsApp válido e consentimento', () => {
    expect(validateStep('contact', quote())).not.toBeNull();
    expect(validateStep('contact', quote({ name: 'Maria' }))).not.toBeNull();
    expect(validateStep('contact', quote({ name: 'Maria', phone: '(19) 9917-385' }))).not.toBeNull();
    expect(validateStep('contact', quote({ name: 'Maria', phone: '(19) 99177-3857' }))).not.toBeNull();
    expect(
      validateStep('contact', quote({ name: 'Maria', phone: '(19) 99177-3857', consent: true })),
    ).toBeNull();
  });

  it('não bloqueia o resumo', () => {
    expect(validateStep('review', quote())).toBeNull();
  });
});
