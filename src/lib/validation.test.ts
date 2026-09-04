import { describe, expect, it } from 'vitest';
import {
  clampGuests,
  formatDateBR,
  formatPhoneInput,
  formatPhoneReadable,
  isPastDate,
  isValidDate,
  isValidPhoneBR,
  isValidTime,
  onlyDigits,
  sanitizeMultiline,
  sanitizeText,
  todayISO,
} from './validation';

describe('telefone brasileiro', () => {
  it('aceita celular com 11 dígitos e fixo com 10', () => {
    expect(isValidPhoneBR('(19) 99177-3857')).toBe(true);
    expect(isValidPhoneBR('19991773857')).toBe(true);
    expect(isValidPhoneBR('(19) 3652-1234')).toBe(true);
  });

  it('recusa telefones curtos, longos ou com DDD inválido', () => {
    expect(isValidPhoneBR('9917738')).toBe(false);
    expect(isValidPhoneBR('199917738571')).toBe(false);
    expect(isValidPhoneBR('(01) 99177-3857')).toBe(false);
    expect(isValidPhoneBR('')).toBe(false);
  });

  it('recusa celular de 11 dígitos que não começa com 9', () => {
    expect(isValidPhoneBR('19891773857')).toBe(false);
  });

  it('recusa sequências repetidas', () => {
    expect(isValidPhoneBR('11111111111')).toBe(false);
  });

  it('aplica a máscara enquanto o visitante digita', () => {
    expect(formatPhoneInput('1')).toBe('(1');
    expect(formatPhoneInput('19')).toBe('(19');
    expect(formatPhoneInput('19991')).toBe('(19) 991');
    expect(formatPhoneInput('1999177385')).toBe('(19) 9917-7385');
    expect(formatPhoneInput('19991773857')).toBe('(19) 99177-3857');
    expect(formatPhoneInput('19991773857999')).toBe('(19) 99177-3857');
    expect(formatPhoneInput('abc')).toBe('');
  });

  it('formata para leitura na mensagem', () => {
    expect(formatPhoneReadable('19991773857')).toBe('(19) 99177-3857');
    expect(formatPhoneReadable('1936521234')).toBe('(19) 3652-1234');
  });

  it('extrai apenas dígitos', () => {
    expect(onlyDigits('(19) 99177-3857')).toBe('19991773857');
  });
});

describe('datas', () => {
  it('valida o formato e a existência da data', () => {
    expect(isValidDate('2099-02-28')).toBe(true);
    expect(isValidDate('2099-02-30')).toBe(false);
    expect(isValidDate('15/05/2099')).toBe(false);
    expect(isValidDate('')).toBe(false);
  });

  it('reconhece datas passadas', () => {
    expect(isPastDate('2020-01-01')).toBe(true);
    expect(isPastDate('2099-01-01')).toBe(false);
    expect(isPastDate(todayISO())).toBe(false);
  });

  it('formata em português do Brasil', () => {
    expect(formatDateBR('2099-05-15')).toBe('15/05/2099');
    expect(formatDateBR('data inválida')).toBe('');
  });

  it('valida horários de 24 horas', () => {
    expect(isValidTime('19:30')).toBe(true);
    expect(isValidTime('09:05')).toBe(true);
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('7:30')).toBe(false);
  });
});

describe('convidados', () => {
  it('mantém o número dentro de limites plausíveis', () => {
    expect(clampGuests(50)).toBe(50);
    expect(clampGuests(-3)).toBe(0);
    expect(clampGuests(10.7)).toBe(10);
    expect(clampGuests(99999)).toBe(2000);
    expect(clampGuests(Number.NaN)).toBe(0);
  });
});

describe('limpeza de texto', () => {
  it('normaliza espaços e limita o tamanho', () => {
    expect(sanitizeText('  Aguaí   SP  ')).toBe('Aguaí SP');
    expect(sanitizeText('a'.repeat(300), 10)).toHaveLength(10);
  });

  it('preserva quebras de linha nas observações', () => {
    expect(sanitizeMultiline('linha 1\n\n\n\nlinha 2')).toBe('linha 1\n\nlinha 2');
  });

  it('respeita o limite de 500 caracteres das observações', () => {
    expect(sanitizeMultiline('x'.repeat(800))).toHaveLength(500);
  });
});
