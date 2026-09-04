/**
 * Catálogo das fotografias reais do Buffet José do Carmo.
 *
 * Cada item aponta para um arquivo em `media-source/originals/`, define o
 * recorte aplicado (quando necessário, para remover marca d'água do celular
 * ou reenquadrar a cena) e o texto alternativo usado no site.
 *
 * Para trocar/adicionar uma foto: coloque o arquivo em `media-source/originals/`,
 * descreva-a aqui e rode `npm run media`.
 */

/** @typedef {{ left: number, top: number, width: number, height: number }} Crop */

/**
 * @typedef {Object} SourceAsset
 * @property {string} slug        identificador usado no código (`<Picture name="..." />`)
 * @property {string} file        arquivo em media-source/originals
 * @property {string} alt         texto alternativo verdadeiro e específico
 * @property {Crop=} crop         recorte opcional aplicado antes de redimensionar
 * @property {string=} position   object-position sugerido para enquadramentos difíceis
 */

/** @type {SourceAsset[]} */
export const assets = [
  {
    slug: 'mesa-de-saladas',
    file: '02-mesa-de-saladas.jpg',
    alt: 'Mesa comprida com bandejas de saladas coloridas, folhas, manga e morangos servidas em um evento do Buffet José do Carmo.',
    position: '50% 62%',
  },
  {
    slug: 'mesa-farta-do-evento',
    file: '17-mesa-farta-do-evento.jpg',
    crop: { left: 230, top: 0, width: 850, height: 1079 },
    alt: 'Mesa de buffet com travessas de massa, carnes, saladas e pratos empilhados durante o serviço de um evento.',
  },
  {
    slug: 'self-service-saladas',
    file: '13-self-service-saladas.jpg',
    alt: 'Mesa de self-service com bandejas de saladas, legumes e folhas frescas, com réchauds ao fundo.',
  },
  {
    slug: 'pratos-individuais-bancada',
    file: '09-pratos-individuais-bancada.jpg',
    crop: { left: 0, top: 0, width: 1200, height: 1400 },
    alt: 'Fileiras de pratos individuais montados com batata, linguiça, pão e molho sobre uma bancada de granito.',
  },
  {
    slug: 'pratos-individuais-area-de-festa',
    file: '07-pratos-individuais-area-de-festa.jpg',
    crop: { left: 0, top: 0, width: 1200, height: 1400 },
    alt: 'Pratos individuais servidos em mesa ao lado da piscina durante uma festa.',
  },
  {
    slug: 'pratos-com-paes-e-batatas',
    file: '12-pratos-com-paes-e-batatas.jpg',
    alt: 'Pratos com pães, batatas e molhos preparados e organizados para servir os convidados.',
  },
  {
    slug: 'porcoes-em-bancada',
    file: '11-porcoes-em-bancada.jpg',
    alt: 'Porções individuais com pães, batatas, amendoim e molho organizadas lado a lado em uma bancada.',
  },
  {
    slug: 'tomate-recheado',
    file: '16-tomate-recheado.jpg',
    alt: 'Tomates recheados com creme e cheiro-verde, servidos sobre folhas de alface.',
  },
  {
    slug: 'mesa-de-frutas',
    file: '14-mesa-de-frutas.jpg',
    alt: 'Melancia servida como suqueira, cercada por fatias de melão, maçã, mamão e uvas.',
  },
  {
    slug: 'mesa-de-frutas-noite',
    file: '03-mesa-de-frutas-noite.jpg',
    alt: 'Mesa de frutas montada à noite, com melancia decorada e fatias de melão, maçã e uvas em volta.',
  },
  {
    slug: 'bebidas-e-frutas',
    file: '15-bebidas-e-frutas.jpg',
    alt: 'Bancada de bebidas com taças de morango, kiwi e banana preparadas para os drinks do evento.',
  },
  {
    slug: 'estrutura-de-drinks',
    file: '04-estrutura-de-drinks.jpg',
    alt: 'Estrutura de drinks montada com frutas, coqueteleiras e copos durante um evento à noite.',
  },
  {
    slug: 'torresmo',
    file: '01-torresmo.jpg',
    alt: 'Travessa de torresmo crocante servido como petisco.',
  },
];

/** Foto usada como LCP da primeira dobra e base da imagem social. */
export const heroSlug = 'mesa-de-saladas';

/** Larguras geradas para cada foto (px). */
export const widths = [480, 800, 1200];
