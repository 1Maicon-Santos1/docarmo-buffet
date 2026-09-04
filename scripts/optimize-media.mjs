/**
 * Gera as versões otimizadas das fotografias reais do buffet.
 *
 *   npm run media
 *
 * Entrada : media-source/originals + media-source/manifest.mjs
 * Saída   : public/media/images/*.avif|.jpg, public/og-image.jpg
 *           e src/data/media.generated.ts (dimensões exatas + LQIP)
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { assets, heroSlug, widths } from '../media-source/manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originals = path.join(root, 'media-source', 'originals');
const outDir = path.join(root, 'public', 'media', 'images');

const AVIF = { quality: 52, effort: 4, chromaSubsampling: '4:2:0' };
const JPEG = { quality: 76, mozjpeg: true, progressive: true };

/** @param {import('../media-source/manifest.mjs').SourceAsset} asset */
function pipelineFor(asset) {
  const pipeline = sharp(path.join(originals, asset.file), { failOn: 'none' }).rotate();
  return asset.crop ? pipeline.extract(asset.crop) : pipeline;
}

async function run() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const entries = [];

  for (const asset of assets) {
    const base = pipelineFor(asset);
    const meta = await base.metadata();
    const width = asset.crop ? asset.crop.width : meta.width;
    const height = asset.crop ? asset.crop.height : meta.height;
    const sizes = widths.filter((w) => w <= width);
    if (sizes.length === 0 || sizes[sizes.length - 1] !== Math.min(width, widths[widths.length - 1])) {
      sizes.push(Math.min(width, widths[widths.length - 1]));
    }

    for (const w of sizes) {
      const resized = () => pipelineFor(asset).resize({ width: w, withoutEnlargement: true });
      await resized().avif(AVIF).toFile(path.join(outDir, `${asset.slug}-${w}.avif`));
      await resized().jpeg(JPEG).toFile(path.join(outDir, `${asset.slug}-${w}.jpg`));
    }

    // LQIP minúsculo embutido no HTML: evita "flash" branco sem custo de rede.
    const lqipBuffer = await pipelineFor(asset)
      .resize({ width: 20 })
      .blur(1.2)
      .jpeg({ quality: 40 })
      .toBuffer();

    entries.push({
      slug: asset.slug,
      alt: asset.alt,
      width,
      height,
      widths: sizes,
      position: asset.position ?? null,
      lqip: `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`,
    });
    process.stdout.write(`  ✓ ${asset.slug} (${width}×${height}) → ${sizes.join(', ')}\n`);
  }

  // Imagem social 1200×630 a partir da foto principal, com faixa e assinatura.
  const hero = assets.find((a) => a.slug === heroSlug) ?? assets[0];
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stop-color="#241A14" stop-opacity="0.15"/>
           <stop offset="55%" stop-color="#241A14" stop-opacity="0.72"/>
           <stop offset="100%" stop-color="#241A14" stop-opacity="0.94"/>
         </linearGradient>
       </defs>
       <rect width="1200" height="630" fill="url(#g)"/>
       <text x="80" y="452" fill="#D7A441" font-family="Georgia, serif" font-size="26" letter-spacing="6">BUFFET PARA EVENTOS</text>
       <text x="80" y="530" fill="#F7F1E7" font-family="Georgia, serif" font-size="64">Buffet José do Carmo</text>
       <text x="80" y="576" fill="#F7F1E7" font-family="Helvetica, Arial, sans-serif" font-size="26" opacity="0.85">Aguaí–SP e região · Self-service para o seu evento</text>
     </svg>`,
  );
  await pipelineFor(hero)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(root, 'public', 'og-image.jpg'));

  const banner = `// Arquivo gerado por \`npm run media\`. Não edite à mão.\n`;
  const body =
    `${banner}\n` +
    `export type MediaAsset = {\n` +
    `  readonly slug: string;\n` +
    `  readonly alt: string;\n` +
    `  readonly width: number;\n` +
    `  readonly height: number;\n` +
    `  readonly widths: readonly number[];\n` +
    `  readonly position: string | null;\n` +
    `  readonly lqip: string;\n` +
    `};\n\n` +
    `export const media = ${JSON.stringify(
      Object.fromEntries(entries.map((e) => [e.slug, e])),
      null,
      2,
    )} as const satisfies Record<string, MediaAsset>;\n\n` +
    `export type MediaName = keyof typeof media;\n`;

  await writeFile(path.join(root, 'src', 'data', 'media.generated.ts'), body, 'utf8');
  process.stdout.write(`\n${entries.length} fotos otimizadas em public/media/images\n`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
