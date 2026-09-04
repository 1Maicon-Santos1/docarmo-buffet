# Buffet José do Carmo — site

Landing page do Buffet José do Carmo (Aguaí–SP e região), com orçamento guiado
que termina abrindo o WhatsApp do buffet com todas as respostas organizadas.

- **Stack:** React 19 + TypeScript + Vite, CSS próprio (sem framework de UI).
- **Conteúdo:** só material real do buffet — fotografias e vídeo dos eventos e o
  cardápio de um evento já atendido.
- **Sem back-end:** nada é enviado para servidores. As respostas ficam no
  `sessionStorage` do navegador até a pessoa tocar em “Solicitar orçamento no
  WhatsApp”.

---

## Como rodar

Requer Node.js 20+.

```bash
npm install       # instala dependências
npm run dev       # ambiente de desenvolvimento (http://localhost:5173)
npm run build     # build de produção em dist/
npm run preview   # serve o build em http://localhost:4173
```

Qualidade:

```bash
npm run lint      # ESLint
npm test          # testes unitários (Vitest)
npm run test:e2e  # testes ponta a ponta (Playwright, celular + desktop)
```

Para os testes E2E é preciso ter o Chromium do Playwright (`npx playwright install chromium`).
Se o ambiente já tiver um Chromium instalado, aponte para ele:
`PLAYWRIGHT_CHROMIUM_PATH=/caminho/para/chromium npm run test:e2e`.

### Publicação

O projeto está ligado à Vercel (projeto `buffet-jose-do-carmo`, framework Vite
detectado automaticamente): cada push nesta branch gera um novo deploy.

- Site publicado: <https://buffet-jose-do-carmo.vercel.app>
- Proteção de acesso desligada, para que qualquer pessoa consiga abrir o link.
- Nenhum domínio próprio foi conectado ainda.

O site é 100% estático, então também roda em qualquer outra hospedagem: basta
publicar o conteúdo de `dist/`.

As URLs absolutas de Open Graph, canonical, `robots.txt` e `sitemap.xml` saem do
domínio de produção que a Vercel injeta no build. Ao conectar um domínio
próprio, defina `SITE_URL` nas variáveis de ambiente do projeto:

```bash
SITE_URL=https://seudominio.com.br npm run build
```

---

## Onde mexer em cada coisa

| O que você quer mudar | Arquivo |
| --- | --- |
| **Telefone/WhatsApp** | `src/data/siteContent.ts` → `site.whatsapp` (`number` só com dígitos, `display` como aparece na tela) |
| Nome, região, frase da família | `src/data/siteContent.ts` → `site` |
| Textos da primeira dobra | `src/data/siteContent.ts` → `hero` |
| Manifesto, tipos de evento, experiência, cardápio de referência | `src/data/siteContent.ts` → `manifesto`, `eventTypes`, `experience` |
| Legendas e ordem da galeria | `src/data/siteContent.ts` → `gallery.items` (`size: 'alta' \| 'larga'` controla o mosaico no desktop) |
| Passos do “Como funciona”, história, FAQ, chamada final, rodapé | `src/data/siteContent.ts` → `process`, `about`, `faq`, `finalCta`, `footer` |
| **Perguntas e opções do orçamento** | `src/data/siteContent.ts` → `quoteCopy`, `eventTypeOptions`, `periodOptions`, `interestOptions`, `restrictionOptions` |
| Regras de obrigatoriedade das etapas | `src/lib/quoteRules.ts` |
| Formato da mensagem do WhatsApp | `src/lib/whatsapp.ts` (`describeQuote`, `buildWhatsAppMessage`, `buildWhatsAppUrl`) |
| Cores, tipografia e espaçamentos | `src/styles/base.css` (variáveis CSS no `:root`) |
| Título, descrição e dados estruturados (SEO) | `index.html` |

> Se mudar a foto principal (`hero.image`), atualize também o `<link rel="preload">`
> do `index.html`, que aponta para o arquivo da primeira dobra.

### Trocar o número do WhatsApp

Só existe um lugar:

```ts
// src/data/siteContent.ts
const whatsappNumber = '5519991773857'; // país + DDD + número, só dígitos
```

O `display` (`(19) 99177-3857`) é o texto mostrado na tela. Os testes em
`src/lib/whatsapp.test.ts` conferem o número de destino — ajuste-os junto.

---

## Fotos e vídeos

Os originais ficam em `media-source/originals/` e são descritos em
`media-source/manifest.mjs` (recorte, texto alternativo e enquadramento).
As versões publicadas em `public/media/images` são geradas por:

```bash
npm run media
```

O script gera AVIF + JPEG em três larguras (480/800/1200), a imagem social
(`public/og-image.jpg`) e o arquivo `src/data/media.generated.ts` com as
dimensões exatas e um mini-placeholder de cada foto — é isso que evita
deslocamento de layout durante o carregamento.

**Para trocar ou acrescentar uma foto:** coloque o arquivo em
`media-source/originals/`, descreva-o em `media-source/manifest.mjs` e rode
`npm run media`. Depois use o `slug` nos textos de `src/data/siteContent.ts`.

### Vídeos

O site publica **um** vídeo real: `public/media/videos/mesa-do-buffet.mp4`
(24 s, 720×1296, sem áudio, ~4,3 MB), com pôster em
`public/media/posters/mesa-do-buffet.jpg`. Ele começa mudo, exige toque no play,
usa `preload="metadata"` (só o cabeçalho do arquivo é baixado antes do play) e
pausa sozinho ao sair da tela.

Os outros três vídeos do acervo não foram publicados porque mostram convidados
com o rosto identificável — divulgá-los exigiria autorização de imagem dessas
pessoas. Eles continuam disponíveis no Drive e podem ser preparados a qualquer
momento pelo fluxo abaixo.

**Preparar novos vídeos.** Os originais são grandes demais para o ambiente de
desenvolvimento, então o processamento roda no GitHub Actions:

1. Edite a lista de arquivos em `.github/workflows/preparar-videos.yml`
   (cada linha `processar <id-do-arquivo-no-drive> <nome>`).
2. Rode o fluxo em *Actions › Preparar vídeos do buffet › Run workflow*.
   Ele baixa, comprime (720 px no lado maior, sem áudio, `faststart`, 24 s),
   gera pôster e uma folha de contato para curadoria, e comita tudo em
   `media-source/videos/`.
3. Escolha o que vai ao ar, copie para `public/media/videos` e
   `public/media/posters` e descreva em `src/data/siteContent.ts`:

   ```ts
   export const videos: VideoItem[] = [
     {
       src: '/media/videos/mesa-do-buffet.mp4',
       poster: '/media/posters/mesa-do-buffet.jpg',
       title: 'Da mesa de saladas aos pratos quentes',
       description: 'Trecho de 24 segundos gravado em um evento atendido pelo buffet. Sem som.',
       width: 720,
       height: 1296,
     },
   ];
   ```

Com a lista vazia, a seção de vídeos simplesmente não aparece.

---

## Analytics

Os eventos ficam em `src/lib/analytics.ts` e são empilhados em `window.dataLayer`
**apenas se ele existir** (nenhuma ferramenta é instalada pelo site):

`quote_start`, `quote_step_completed`, `quote_review_viewed`,
`whatsapp_quote_click`, `gallery_open`, `video_play`.

Nenhum dado pessoal (nome, telefone, observações) é enviado nos eventos.

---

## Estrutura

```
index.html                 SEO, Open Graph, dados estruturados, preloads
media-source/              fotos originais + catálogo de recortes e alt text
scripts/optimize-media.mjs geração das imagens otimizadas
scripts/sync-fonts.mjs     cópia das fontes (Cormorant Garamond e Manrope, OFL)
public/                    fontes, imagens geradas, favicon e imagem social
src/components/            seções da página
src/components/quote/      orçamento guiado (modal, etapas, resumo)
src/data/siteContent.ts    todo o conteúdo e todas as perguntas
src/lib/                   WhatsApp, validação, regras das etapas, storage, analytics
src/styles/                design system (base, layout, seções, orçamento)
e2e/                       testes de ponta a ponta
```

## Resultados medidos

- **Lighthouse (mobile, 4G simulado):** Performance 97 · Acessibilidade 100 ·
  Boas práticas 100 · SEO 100 — LCP 2,5 s, CLS 0, TBT 10 ms.
- **Lighthouse (desktop):** 100 · 100 · 100 · 100 — LCP 0,6 s.
- **Testes:** 53 unitários (Vitest) e 42 de ponta a ponta (Playwright, celular e desktop).
