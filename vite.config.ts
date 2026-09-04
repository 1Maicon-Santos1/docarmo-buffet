import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Domínio final do site. Defina `SITE_URL` ao publicar para que as tags
 * Open Graph, o canonical, o robots.txt e o sitemap.xml usem URLs absolutas:
 *
 *   SITE_URL=https://seudominio.com.br npm run build
 */
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '');

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
