import { describe, expect, it } from 'vitest';
import { buildWhatsAppMessage, buildWhatsAppUrl, describeQuote, totalGuests } from './whatsapp';
import { emptyQuote, type QuoteData } from '../types/quote';

const fullQuote: QuoteData = {
  eventType: 'casamento',
  eventTypeOther: '',
  dateUndecided: false,
  date: '2099-05-15',
  period: 'noite',
  time: '19:30',
  city: 'Aguaí',
  neighborhood: 'Centro',
  venueDefined: 'sim',
  venueName: 'Salão São João',
  adults: 80,
  children: 12,
  interests: ['refeicao-completa', 'frutas'],
  interestsOther: '',
  restrictions: 'sim',
  restrictionsDetails: 'Uma pessoa não come lactose',
  notes: 'A recepção começa às 20h e o salão tem cozinha de apoio.',
  name: 'Maria de Souza',
  phone: '(19) 99177-3857',
  consent: true,
};

const quote = (patch: Partial<QuoteData> = {}): QuoteData => ({ ...fullQuote, ...patch });

describe('buildWhatsAppMessage — fluxo completo', () => {
  const message = buildWhatsAppMessage(fullQuote);

  it('abre com a saudação e o cabeçalho do evento', () => {
    expect(message.startsWith('Olá, Buffet José do Carmo! 👋')).toBe(true);
    expect(message).toContain('Gostaria de solicitar um orçamento para o meu evento.');
    expect(message).toContain('DADOS DO EVENTO');
  });

  it('lista todas as respostas preenchidas', () => {
    expect(message).toContain('👤 Nome: Maria de Souza');
    expect(message).toContain('📱 WhatsApp: (19) 99177-3857');
    expect(message).toContain('🎉 Tipo de evento: Casamento');
    expect(message).toContain('📅 Data: 15/05/2099');
    expect(message).toContain('🕒 Horário/período: Jantar/noite · 19:30');
    expect(message).toContain('📍 Cidade/bairro: Aguaí — Centro');
    expect(message).toContain('🏠 Local definido: Sim — Salão São João');
    expect(message).toContain('👥 Convidados: 80 adultos + 12 crianças = 92 pessoas');
    expect(message).toContain('🍽️ Interesses: Refeição completa em self-service, Mesa de frutas');
    expect(message).toContain('🥗 Preferências ou restrições: Sim — Uma pessoa não come lactose');
    expect(message).toContain('📝 Observações: A recepção começa às 20h e o salão tem cozinha de apoio.');
  });

  it('termina avisando que o orçamento veio do site', () => {
    expect(message.endsWith('Orçamento iniciado pelo site.')).toBe(true);
  });

  it('nunca vaza valores técnicos', () => {
    expect(message).not.toMatch(/undefined|null|\[|\]/);
  });

  it('mantém os acentos do português', () => {
    expect(message).toContain('Aguaí');
    expect(message).toContain('Refeição');
    expect(message).toContain('São João');
  });
});

describe('buildWhatsAppMessage — ramificações', () => {
  it('usa "Ainda não definida" quando a data não foi escolhida', () => {
    const message = buildWhatsAppMessage(quote({ dateUndecided: true, date: '' }));
    expect(message).toContain('📅 Data: Ainda não definida');
  });

  it('detalha o tipo de evento quando a resposta é "Outro"', () => {
    const message = buildWhatsAppMessage(
      quote({ eventType: 'outro', eventTypeOther: 'Almoço de confraternização da empresa' }),
    );
    expect(message).toContain('🎉 Tipo de evento: Outro — Almoço de confraternização da empresa');
  });

  it('mostra "Ainda não definido" quando o local não foi escolhido', () => {
    const message = buildWhatsAppMessage(quote({ venueDefined: 'nao', venueName: '' }));
    expect(message).toContain('🏠 Local definido: Ainda não definido');
  });

  it('mostra apenas "Sim" quando o local existe mas não foi nomeado', () => {
    const message = buildWhatsAppMessage(quote({ venueDefined: 'sim', venueName: '   ' }));
    expect(message).toContain('🏠 Local definido: Sim\n');
  });

  it('registra restrições respondidas com "Não" e "Ainda não sei"', () => {
    expect(buildWhatsAppMessage(quote({ restrictions: 'nao', restrictionsDetails: '' }))).toContain(
      '🥗 Preferências ou restrições: Não',
    );
    expect(buildWhatsAppMessage(quote({ restrictions: 'nao-sei' }))).toContain(
      '🥗 Preferências ou restrições: Ainda não sei',
    );
  });

  it('descreve o interesse "Outro" com o texto digitado', () => {
    const message = buildWhatsAppMessage(
      quote({ interests: ['bebidas', 'outro'], interestsOther: 'Mesa de café' }),
    );
    expect(message).toContain('🍽️ Interesses: Bebidas/drinks, Outro: Mesa de café');
  });

  it('omite as linhas opcionais vazias', () => {
    const message = buildWhatsAppMessage(
      quote({
        neighborhood: '',
        venueDefined: null,
        venueName: '',
        time: '',
        period: null,
        notes: '',
        restrictions: null,
        interests: [],
      }),
    );
    expect(message).not.toContain('🕒');
    expect(message).not.toContain('🏠');
    expect(message).not.toContain('📝');
    expect(message).not.toContain('🥗');
    expect(message).not.toContain('🍽️');
    expect(message).toContain('📍 Cidade/bairro: Aguaí');
  });

  it('mostra só o período quando não há horário e vice-versa', () => {
    expect(buildWhatsAppMessage(quote({ time: '' }))).toContain('🕒 Horário/período: Jantar/noite');
    expect(buildWhatsAppMessage(quote({ period: null }))).toContain('🕒 Horário/período: 19:30');
  });

  it('ignora horário inválido', () => {
    expect(buildWhatsAppMessage(quote({ time: '99:99' }))).toContain('🕒 Horário/período: Jantar/noite');
  });

  it('não inventa linhas quando o orçamento está vazio', () => {
    const message = buildWhatsAppMessage(emptyQuote);
    expect(message).toBe(
      [
        'Olá, Buffet José do Carmo! 👋',
        'Gostaria de solicitar um orçamento para o meu evento.',
        '',
        'DADOS DO EVENTO',
        '',
        'Orçamento iniciado pelo site.',
      ].join('\n'),
    );
  });
});

describe('contagem de convidados', () => {
  it('soma adultos e crianças', () => {
    expect(totalGuests({ adults: 80, children: 12 })).toBe(92);
  });

  it('usa singular quando há apenas uma pessoa', () => {
    const message = buildWhatsAppMessage(quote({ adults: 1, children: 1 }));
    expect(message).toContain('👥 Convidados: 1 adulto + 1 criança = 2 pessoas');
  });

  it('escreve só o grupo informado', () => {
    expect(buildWhatsAppMessage(quote({ adults: 40, children: 0 }))).toContain(
      '👥 Convidados: 40 adultos = 40 pessoas',
    );
    expect(buildWhatsAppMessage(quote({ adults: 0, children: 8 }))).toContain(
      '👥 Convidados: 8 crianças = 8 pessoas',
    );
  });

  it('omite a linha quando ninguém foi informado', () => {
    expect(buildWhatsAppMessage(quote({ adults: 0, children: 0 }))).not.toContain('👥');
  });

  it('protege contra números negativos ou absurdos', () => {
    expect(totalGuests({ adults: -5, children: 3 })).toBe(3);
    expect(totalGuests({ adults: 999999, children: 0 })).toBe(2000);
    expect(totalGuests({ adults: Number.NaN, children: 2 })).toBe(2);
  });
});

describe('buildWhatsAppUrl', () => {
  it('aponta para o número oficial do buffet', () => {
    expect(buildWhatsAppUrl(fullQuote).startsWith('https://wa.me/5519991773857?text=')).toBe(true);
  });

  it('codifica a mensagem e permite recuperá-la intacta', () => {
    const url = buildWhatsAppUrl(fullQuote);
    const encoded = url.split('?text=')[1];
    expect(encoded).not.toContain(' ');
    expect(encoded).not.toContain('\n');
    expect(decodeURIComponent(encoded)).toBe(buildWhatsAppMessage(fullQuote));
  });

  it('escapa caracteres especiais digitados pelo visitante', () => {
    const url = buildWhatsAppUrl(quote({ notes: 'Serve 100% dos convidados? Pão & queijo #festa' }));
    expect(url).toContain('100%25');
    expect(url).toContain('%26');
    expect(url).toContain('%23');
    expect(decodeURIComponent(url.split('?text=')[1])).toContain(
      'Serve 100% dos convidados? Pão & queijo #festa',
    );
  });

  it('não deixa quebras de linha cruas na URL', () => {
    expect(buildWhatsAppUrl(fullQuote)).toContain('%0A');
  });
});

describe('describeQuote', () => {
  it('devolve os campos na ordem da mensagem', () => {
    expect(describeQuote(fullQuote).map((field) => field.key)).toEqual([
      'name',
      'phone',
      'eventType',
      'date',
      'schedule',
      'place',
      'venue',
      'guests',
      'interests',
      'restrictions',
      'notes',
    ]);
  });

  it('marca como nulo o que não foi respondido', () => {
    const fields = describeQuote(emptyQuote);
    expect(fields.every((field) => field.value === null)).toBe(true);
  });

  it('limpa caracteres de controle vindos de colagem', () => {
    const field = describeQuote(quote({ name: 'Maria\u0000\tde\u001fSouza' })).find((item) => item.key === 'name');
    expect(field?.value).toBe('Maria de Souza');
  });
});
