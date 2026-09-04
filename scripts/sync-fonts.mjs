/**
 * Copia apenas os arquivos latinos das fontes variáveis para public/fonts,
 * onde recebem URLs estáveis (permitindo <link rel="preload"> no index.html).
 *
 *   npm run fonts
 *
 * Fontes: Cormorant Garamond e Manrope, ambas sob SIL Open Font License 1.1,
 * distribuídas via pacotes @fontsource-variable (devDependencies).
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'fonts');

const files = [
  ['@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2', 'cormorant-garamond-latin.woff2'],
  ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'manrope-latin.woff2'],
];

await mkdir(out, { recursive: true });
for (const [from, to] of files) {
  await copyFile(path.join(root, 'node_modules', from), path.join(out, to));
  process.stdout.write(`  ✓ public/fonts/${to}\n`);
}
