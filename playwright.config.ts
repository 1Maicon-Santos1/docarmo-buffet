import { defineConfig, devices } from '@playwright/test';

/**
 * Em ambientes que já trazem o Chromium instalado, aponte para o binário com
 * PLAYWRIGHT_CHROMIUM_PATH. Sem essa variável, vale o navegador baixado pelo
 * próprio Playwright (`npx playwright install chromium`).
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const launchOptions = executablePath ? { executablePath } : {};

/**
 * Testes de ponta a ponta rodam sobre o build de produção (`npm run preview`),
 * em um celular e em um desktop.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions,
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
