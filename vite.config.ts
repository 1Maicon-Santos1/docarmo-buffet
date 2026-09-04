import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Domínio final do site, usado nas tags Open Graph, no canonical, no robots.txt
 * e no sitemap.xml.
 *
 * Ordem: `SITE_URL` (defina ao publicar em domínio próprio) e, se ela não
 * existir, o domínio de produção que a Vercel injeta no build.
 *
 *   SITE_URL=https://seudominio.com.br npm run build
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : '')).replace(/\/+$/, '');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'buffet-site-url',
      transformIndexHtml(html) {
        return html
          .replace(/%OG_IMAGE%/g, siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg')
          .replace(
            /<!--%CANONICAL%-->/g,
            siteUrl ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />` : '',
          );
      },
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
        });
        if (siteUrl) {
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source:
              `<?xml version="1.0" encoding="UTF-8"?>\n` +
              `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
              `  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n` +
              `</urlset>\n`,
          });
        }
      },
    },
  ],
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
  },
});
