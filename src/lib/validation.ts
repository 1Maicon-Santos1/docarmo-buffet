/** Validação e normalização dos dados digitados no orçamento. */

export const MAX_GUESTS_PER_GROUP = 2000;
export const MAX_NOTES = 500;

/** Caracteres de controle (inclui quebras de linha) — removidos de propósito. */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
/** Caracteres de controle preservando \n. */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_KEEP_BREAKS = /[\u0000-\u0009\u000b-\u001f\u007f]/g;

/** Remove caracteres de controle, normaliza espaços e limita o tamanho. */
export function sanitizeText(value: string, maxLength = 160): string {
  return value.replace(CONTROL_CHARS, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, maxLength);
}

/** Igual a sanitizeText, mas preserva quebras de linha (campo de observações). */
export function sanitizeMultiline(value: string, maxLength = MAX_NOTES): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS_KEEP_BREAKS, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, maxLength)
    .trim();
}

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '');
}

/** Máscara brasileira progressiva: (19) 99177-3857 / (19) 3123-4567. */
export function formatPhoneInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const pivot = rest.length > 8 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, pivot)}-${rest.slice(pivot)}`;
}

/** Telefone brasileiro: 10 ou 11 dígitos, DDD válido e celular começando em 9. */
export function isValidPhoneBR(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (digits.length === 11 && digits[2] !== '9') return false;
  if (digits.length === 10 && Number(digits[2]) < 2) return false;
  return true;
}

/** Formata para leitura: (19) 99177-3857. */
export function formatPhoneReadable(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value.trim();
}

/** Data de hoje no formato yyyy-mm-dd, no fuso do visitante. */
export function todayISO(date = new Date()): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function isPastDate(value: string, today = todayISO()): boolean {
  if (!isValidDate(value)) return false;
  return value < today;
}

/** Data em português do Brasil: 12/09/2026. */
export function formatDateBR(value: string): string {
  if (!isValidDate(value)) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

/** Horário HH:MM (24h). */
export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** Mantém a contagem de convidados dentro de um intervalo plausível. */
export function clampGuests(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_GUESTS_PER_GROUP, Math.max(0, Math.trunc(value)));
}
