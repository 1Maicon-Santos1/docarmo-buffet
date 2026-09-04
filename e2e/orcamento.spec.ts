import { expect, test, type Page } from '@playwright/test';

const WHATSAPP_PREFIX = 'https://wa.me/5519991773857?text=';

/** Data futura estável para os testes (amanhã). */
function tomorrowISO(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

async function openWizard(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Montar meu orçamento' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

async function next(page: Page) {
  await page.getByRole('button', { name: 'Continuar' }).click();
}

/** Percorre as nove perguntas com respostas completas. */
async function fillFullFlow(page: Page) {
  await page.getByRole('radio', { name: 'Casamento' }).check();
  await next(page);

  await page.getByLabel('Data do evento', { exact: true }).fill(tomorrowISO());
  await next(page);

  await page.getByRole('radio', { name: 'Jantar/noite' }).check();
  await page.getByLabel('Horário aproximado').fill('19:30');
  await next(page);

  await page.getByLabel('Cidade').fill('Aguaí');
  await page.getByLabel('Bairro').fill('Centro');
  await page.getByRole('radio', { name: 'Sim, já sei o local' }).check();
  await page.getByLabel('Nome ou referência do local').fill('Salão São João');
  await next(page);

  await page.getByRole('button', { name: 'Aumentar adultos' }).click();
  await page.getByRole('spinbutton', { name: 'Adultos' }).fill('80');
  await page.getByRole('spinbutton', { name: 'Crianças' }).fill('12');
  await expect(page.getByTestId('guest-total')).toHaveText('92');
  await next(page);

  await page.getByRole('checkbox', { name: 'Refeição completa em self-service' }).check();
  await page.getByRole('checkbox', { name: 'Mesa de frutas' }).check();
  await next(page);

  await page.getByRole('radio', { name: 'Sim', exact: true }).check();
  await page.getByLabel('Quais preferências ou restrições?').fill('Uma pessoa não come lactose');
  await next(page);

  await page.getByLabel(/Observações/).fill('A recepção começa às 20h.');
  await next(page);

  await page.getByLabel('Seu nome').fill('Maria de Souza');
  await page.getByLabel('Melhor WhatsApp').fill('19991773857');
  await page.getByLabel(/Concordo em abrir uma conversa/).check();
  await next(page);
}

test.describe('orçamento guiado', () => {
  test('fluxo completo monta o link do WhatsApp com todas as respostas', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await openWizard(page);
    await fillFullFlow(page);

    await expect(page.getByRole('heading', { name: 'Confira antes de enviar' })).toBeVisible();
    await expect(page.getByText('80 adultos + 12 crianças = 92 pessoas')).toBeVisible();

    const link = page.getByRole('link', { name: /Solicitar orçamento no WhatsApp/ });
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();
    expect(href!.startsWith(WHATSAPP_PREFIX)).toBe(true);

    const message = decodeURIComponent(href!.slice(WHATSAPP_PREFIX.length));
    expect(message).toContain('👤 Nome: Maria de Souza');
    expect(message).toContain('📱 WhatsApp: (19) 99177-3857');
    expect(message).toContain('🎉 Tipo de evento: Casamento');
    expect(message).toContain('🕒 Horário/período: Jantar/noite · 19:30');
    expect(message).toContain('📍 Cidade/bairro: Aguaí — Centro');
    expect(message).toContain('🏠 Local definido: Sim — Salão São João');
    expect(message).toContain('👥 Convidados: 80 adultos + 12 crianças = 92 pessoas');
    expect(message).toContain('🥗 Preferências ou restrições: Sim — Uma pessoa não come lactose');
    expect(message).toContain('📝 Observações: A recepção começa às 20h.');
    expect(message).not.toMatch(/undefined|null/);

    expect(await link.getAttribute('target')).toBe('_blank');
    expect(await link.getAttribute('rel')).toBe('noopener noreferrer');

    // O visitante ainda precisa tocar em Enviar dentro do WhatsApp.
    await link.click({ modifiers: ['Shift'] }).catch(() => undefined);
    expect(consoleErrors).toEqual([]);
  });

  test('data não definida e evento "Outro" aparecem corretamente na mensagem', async ({ page }) => {
    await openWizard(page);

    await page.getByRole('radio', { name: 'Outro' }).check();
    await page.getByLabel('Conte qual é o evento').fill('Almoço de confraternização');
    await next(page);

    await page.getByLabel('Ainda não defini a data').check();
    await next(page);

    await page.getByRole('radio', { name: 'Ainda não definido' }).check();
    await next(page);

    await page.getByLabel('Cidade').fill('Aguaí');
    await page.getByRole('radio', { name: 'Ainda não' }).check();
    await next(page);

    await page.getByRole('spinbutton', { name: 'Adultos' }).fill('30');
    await next(page);

    await page.getByRole('checkbox', { name: 'Quero ajuda para escolher' }).check();
    await next(page);

    await page.getByRole('radio', { name: 'Ainda não sei' }).check();
    await next(page);

    await next(page); // observações em branco

    await page.getByLabel('Seu nome').fill('João Pereira');
    await page.getByLabel('Melhor WhatsApp').fill('1936521234');
    await page.getByLabel(/Concordo em abrir uma conversa/).check();
    await next(page);

    const href = await page.getByRole('link', { name: /Solicitar orçamento no WhatsApp/ }).getAttribute('href');
    const message = decodeURIComponent(href!.slice(WHATSAPP_PREFIX.length));

    expect(message).toContain('🎉 Tipo de evento: Outro — Almoço de confraternização');
    expect(message).toContain('📅 Data: Ainda não definida');
    expect(message).toContain('🏠 Local definido: Ainda não definido');
    expect(message).toContain('👥 Convidados: 30 adultos = 30 pessoas');
    expect(message).toContain('🥗 Preferências ou restrições: Ainda não sei');
    expect(message).toContain('📱 WhatsApp: (19) 3652-1234');
    expect(message).not.toContain('📝 Observações');
  });

  test('valida telefone, permite voltar e editar pelo resumo', async ({ page }) => {
    await openWizard(page);
    await fillFullFlow(page);

    await page.getByRole('button', { name: /Editar contato/ }).click();
    await expect(page.getByLabel('Seu nome')).toHaveValue('Maria de Souza');

    await page.getByLabel('Melhor WhatsApp').fill('1999');
    await next(page);
    await expect(page.getByRole('alert')).toHaveText('Informe um WhatsApp válido com DDD.');

    await page.getByLabel('Melhor WhatsApp').fill('19991773857');
    await next(page);
    await expect(page.getByRole('heading', { name: 'Confira antes de enviar' })).toBeVisible();

    await page.getByRole('button', { name: /Editar convidados/ }).click();
    await page.getByRole('spinbutton', { name: 'Crianças' }).fill('0');
    await expect(page.getByTestId('guest-total')).toHaveText('80');
    await next(page);
    await expect(page.getByText('80 adultos = 80 pessoas')).toBeVisible();

    await page.getByRole('button', { name: 'Voltar' }).click();
    await expect(page.getByRole('heading', { name: 'Como falamos com você?' })).toBeVisible();
    await page.getByRole('button', { name: 'Voltar' }).click();
    await expect(page.getByRole('heading', { name: 'Quer contar mais alguma coisa?' })).toBeVisible();
  });

  test('recupera as respostas ao reabrir na mesma sessão', async ({ page }) => {
    await openWizard(page);
    await page.getByRole('radio', { name: 'Aniversário' }).check();
    await next(page);
    await page.getByLabel('Ainda não defini a data').check();
    await next(page);

    await page.getByRole('button', { name: 'Fechar' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.getByRole('button', { name: 'Montar meu orçamento' }).first().click();
    await expect(page.getByRole('heading', { name: 'Em que horário será?' })).toBeVisible();

    await page.getByRole('button', { name: 'Voltar' }).click();
    await expect(page.getByLabel('Ainda não defini a data')).toBeChecked();
    await page.getByRole('button', { name: 'Voltar' }).click();
    await expect(page.getByRole('radio', { name: 'Aniversário' })).toBeChecked();
  });

  test('impede avançar sem responder e mostra o erro em aria-live', async ({ page }) => {
    await openWizard(page);
    await next(page);
    await expect(page.getByRole('alert')).toHaveText('Escolha um tipo de evento para continuar.');
    await expect(page.getByRole('heading', { name: 'Qual é o tipo do evento?' })).toBeVisible();
  });

  test('bloqueia datas passadas no seletor', async ({ page }) => {
    await openWizard(page);
    await page.getByRole('radio', { name: /^Festa/ }).check();
    await next(page);
    const input = page.getByLabel('Data do evento', { exact: true });
    await expect(input).toHaveAttribute('min', /\d{4}-\d{2}-\d{2}/);
    await input.fill('2020-01-01');
    await next(page);
    await expect(page.getByRole('alert')).toHaveText('Escolha uma data a partir de hoje.');
  });

  test('o botão de recomeçar limpa as respostas', async ({ page }) => {
    await openWizard(page);
    await fillFullFlow(page);
    await page.getByRole('button', { name: 'Recomeçar' }).click();
    await expect(page.getByRole('heading', { name: 'Qual é o tipo do evento?' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Casamento' })).not.toBeChecked();
    expect(await page.evaluate(() => window.sessionStorage.getItem('bjc:orcamento:v1'))).toContain(
      '"eventType":null',
    );
  });

  test('o botão "Copiar resumo" leva a mensagem para a área de transferência', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'permissão de área de transferência só no Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await openWizard(page);
    await fillFullFlow(page);
    await page.getByRole('button', { name: 'Copiar resumo' }).click();
    await expect(page.locator('.review__status')).toContainText('Resumo copiado!');

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Olá, Buffet José do Carmo!');
    expect(copied).toContain('👥 Convidados: 80 adultos + 12 crianças = 92 pessoas');
    expect(copied).toContain('Orçamento iniciado pelo site.');
  });

  test('o aviso após o clique deixa claro que falta tocar em Enviar', async ({ page }) => {
    await openWizard(page);
    await fillFullFlow(page);
    const link = page.getByRole('link', { name: /Solicitar orçamento no WhatsApp/ });
    await link.evaluate((element) => element.removeAttribute('target'));
    await page.evaluate(() => {
      document.addEventListener('click', (event) => event.preventDefault(), { capture: true });
    });
    await link.click();
    await expect(page.locator('.review__status')).toContainText(
      'Tudo pronto! Abrimos seu WhatsApp com as informações organizadas. Agora é só tocar em Enviar.',
    );
  });

  test('cards de evento abrem o orçamento com o tipo preenchido', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Montar orçamento para aniversários/ }).click();
    await expect(page.getByRole('radio', { name: 'Aniversário' })).toBeChecked();
  });
});

test.describe('acessibilidade e teclado', () => {
  test('o modal fecha com Esc e devolve o foco ao botão de origem', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Montar meu orçamento' }).first();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('a galeria abre e navega pelo teclado', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Mesa de saladas montada/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-label', /Foto 1 de 13/);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', /Foto 2 de 13/);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('o link de pular navegação leva ao conteúdo', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Ir para o conteúdo' })).toBeFocused();
  });
});

test.describe('layout responsivo', () => {
  const widths = [320, 375, 390, 430, 768, 1440];

  for (const width of widths) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('a primeira dobra mostra headline e CTAs sem cortar', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Montar meu orçamento' }).first()).toBeVisible();
  });
});
