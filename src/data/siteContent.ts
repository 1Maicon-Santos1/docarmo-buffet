/**
 * Todo o conteúdo do site em um lugar só.
 *
 * Para alterar textos, telefone, seções, perguntas do FAQ ou legendas das fotos,
 * edite este arquivo — os componentes apenas leem o que está aqui.
 */
import type { MediaName } from './media.generated';
import type { EventTypeId, InterestId, PeriodId, RestrictionAnswer } from '../types/quote';

const whatsappNumber = '5519991773857';

export const site = {
  name: 'Buffet José do Carmo',
  shortName: 'José do Carmo',
  familyLine: 'Nossa família trabalhando para atender a sua.',
  region: 'Aguaí–SP e região',
  whatsapp: {
    /** Número internacional usado no link wa.me (só dígitos). */
    number: whatsappNumber,
    /** Como o telefone aparece na tela. */
    display: '(19) 99177-3857',
    /** Link direto, sem mensagem pré-preenchida. */
    href: `https://wa.me/${whatsappNumber}`,
  },
} as const;

export const nav = [
  { href: '#experiencia', label: 'Experiência' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#como-funciona', label: 'Como funciona' },
] as const;

export const hero = {
  eyebrow: 'Buffet para eventos em Aguaí e região',
  headline: 'Comida de verdade para reunir quem importa.',
  subheadline:
    'Buffet self-service para casamentos, aniversários, festas e confraternizações, com cardápio e atendimento alinhados ao seu evento.',
  primaryCta: 'Montar meu orçamento',
  secondaryCta: 'Ver nosso trabalho',
  safetyLine: 'Orçamento sem compromisso • Atendimento pelo WhatsApp',
  locationBadge: 'Aguaí–SP e região',
  image: 'mesa-de-saladas' satisfies MediaName,
} as const;

export const manifesto = {
  eyebrow: 'Nosso jeito de servir',
  title: 'Mesa farta, bem apresentada e sem pressa.',
  paragraphs: [
    'Buffet é comida boa, mas também é organização. A gente monta a mesa com quantidade que dá conforto para todo mundo repetir, cuida da apresentação de cada travessa e acompanha o serviço enquanto a festa acontece.',
    'Quando o evento pede, servimos em pratos individuais já montados — a fila anda rápido e ninguém fica esperando.',
  ],
  highlight: 'Nossa família cuidando de cada detalhe para a sua celebrar com tranquilidade.',
  points: [
    'Quantidade pensada para o número de convidados',
    'Montagem e organização da mesa no local do evento',
    'Apresentação cuidada em cada travessa',
    'Opção de porções individuais já montadas',
  ],
  image: 'mesa-farta-do-evento' satisfies MediaName,
} as const;

export interface EventTypeCard {
  id: EventTypeId;
  title: string;
  description: string;
  image: MediaName;
}

export const eventTypes = {
  eyebrow: 'Para quais eventos',
  title: 'Cada celebração pede uma mesa diferente.',
  lede: 'Escolha o tipo de evento e já começamos o seu orçamento com essa resposta preenchida.',
  cards: [
    {
      id: 'casamento',
      title: 'Casamentos',
      description:
        'Serviço para a recepção, com mesa montada, saladas variadas e pratos quentes servidos no ritmo da festa.',
      image: 'self-service-saladas',
    },
    {
      id: 'aniversario',
      title: 'Aniversários',
      description:
        'De almoço em família a festa à noite, com o cardápio combinado a partir do que a pessoa homenageada gosta.',
      image: 'pratos-com-paes-e-batatas',
    },
    {
      id: 'festa',
      title: 'Festas',
      description:
        'Chá de bebê, batizado, formatura ou aquele encontro grande em casa: a parte da comida fica com a gente.',
      image: 'mesa-de-frutas-noite',
    },
    {
      id: 'confraternizacao',
      title: 'Confraternizações',
      description:
        'Time de trabalho, vizinhos, igreja ou a família toda reunida: comida que serve bastante gente sem complicar.',
      image: 'pratos-individuais-area-de-festa',
    },
  ] satisfies EventTypeCard[],
  otherCard: {
    id: 'outro' as EventTypeId,
    title: 'Outros eventos sob consulta',
    description:
      'Almoço de empresa, evento de fim de ano, encontro comemorativo ou algo fora do comum — conte o que você precisa e a gente avalia.',
  },
} as const;

export interface ExperienceTile {
  title: string;
  description: string;
  image: MediaName;
}

export const experience = {
  eyebrow: 'A experiência do buffet',
  title: 'O que costuma estar na mesa.',
  lede: 'Estas são referências do nosso trabalho, registradas em eventos reais. Cada festa tem o seu próprio cardápio: a gente combina tudo no orçamento, de acordo com o número de convidados, o horário e o seu gosto.',
  tiles: [
    {
      title: 'Refeição em self-service',
      description:
        'Mesa completa com pratos quentes, arroz, acompanhamentos e uma sequência grande de saladas, servidos em travessas.',
      image: 'self-service-saladas',
    },
    {
      title: 'Pratos quentes',
      description: 'Carnes assadas, massas, farofa e a base da comida brasileira que todo mundo reconhece.',
      image: 'mesa-farta-do-evento',
    },
    {
      title: 'Entradas e petiscos',
      description: 'Porções para abrir a festa enquanto os convidados vão chegando.',
      image: 'torresmo',
    },
    {
      title: 'Porções individuais',
      description:
        'Pratos montados um a um, prontos para entregar — bom para eventos com muita gente ou espaço apertado.',
      image: 'pratos-individuais-bancada',
    },
    {
      title: 'Mesa de frutas',
      description: 'Frutas cortadas e montadas na hora, com apresentação que vira enfeite da mesa.',
      image: 'mesa-de-frutas',
    },
    {
      title: 'Bebidas e drinks',
      description: 'Estrutura de bebidas com frutas preparadas, copos e utensílios organizados.',
      image: 'bebidas-e-frutas',
    },
  ] satisfies ExperienceTile[],
  menu: {
    title: 'Um cardápio que já servimos',
    note: 'Cardápio de um evento real atendido pelo buffet. Serve como referência — o seu é montado do jeito que fizer sentido para a sua festa.',
    columns: [
      {
        title: 'Pratos quentes',
        items: [
          'Arroz de forno',
          'Arroz branco',
          'Tutu de feijão',
          'Nhoque',
          'Lagarto ao molho madeira',
          'Coxa e sobrecoxa assada',
          'Farofa com bacon',
          'Pernil assado',
          'Linguiça assada',
          'Escondidinho de carne-seca com mandioca',
          'Macarrão com brócolis ao alho e óleo',
        ],
      },
      {
        title: 'Saladas',
        items: [
          'Salada de beterraba com cebola',
          'Salada de cenoura com vagem e azeitona',
          'Salada de brócolis com tomate cereja',
          'Salada de abacaxi e uva passas',
          'Salada de berinjela com pimentão e uva passas',
          'Salada de alface com rúcula, mussarela, morango e manga',
          'Salada de quiabo com mussarela',
          'Salada de batatinha',
          'Salada de manga',
          'Salada de maionese',
          'Salada de abobrinha',
          'Salpicão',
          'Vinagrete',
          'Salada de tomate',
        ],
      },
    ],
  },
} as const;

export interface GalleryItem {
  image: MediaName;
  caption: string;
  /** Tamanho no mosaico do desktop (o celular usa carrossel). */
  size?: 'normal' | 'alta' | 'larga';
}

export const gallery = {
  eyebrow: 'Galeria',
  title: 'Fotos dos nossos eventos.',
  lede: 'Registros feitos durante o serviço, do jeito que a mesa ficou na hora.',
  hint: 'Clique ou toque em uma foto para ampliar',
  items: [
    { image: 'mesa-de-saladas', caption: 'Mesa de saladas montada para o serviço', size: 'alta' },
    { image: 'mesa-farta-do-evento', caption: 'Travessas na mesa durante a festa' },
    { image: 'self-service-saladas', caption: 'Self-service pronto para abrir' },
    { image: 'pratos-individuais-bancada', caption: 'Pratos individuais em sequência', size: 'larga' },
    { image: 'mesa-de-frutas-noite', caption: 'Mesa de frutas em festa à noite' },
    { image: 'tomate-recheado', caption: 'Tomate recheado da entrada', size: 'alta' },
    { image: 'pratos-individuais-area-de-festa', caption: 'Serviço montado na área de festa' },
    { image: 'estrutura-de-drinks', caption: 'Estrutura de drinks montada' },
    { image: 'pratos-com-paes-e-batatas', caption: 'Porções montadas uma a uma', size: 'alta' },
    { image: 'porcoes-em-bancada', caption: 'Detalhe das porções na bancada' },
    { image: 'torresmo', caption: 'Torresmo saindo para o petisco' },
    { image: 'bebidas-e-frutas', caption: 'Frutas preparadas para os drinks', size: 'larga' },
    { image: 'mesa-de-frutas', caption: 'Melancia servida como suqueira' },
  ] satisfies GalleryItem[],
} as const;

export interface VideoItem {
  /** Arquivo em /public/media/videos */
  src: string;
  /** Imagem em /public/media/posters exibida antes do play */
  poster: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

/**
 * Vídeos dos eventos.
 *
 * A seção só aparece quando houver pelo menos um item aqui. Para publicar:
 * 1. coloque os arquivos .mp4 em `public/media/videos/`;
 * 2. gere o poster (`public/media/posters/<nome>.jpg`);
 * 3. descreva cada vídeo nesta lista.
 * O passo a passo com os comandos está no README.
 */
export const videos: VideoItem[] = [];

export const process = {
  eyebrow: 'Como funciona',
  title: 'Três passos até o seu orçamento.',
  steps: [
    {
      title: 'Você conta como será o evento',
      description:
        'Responde algumas perguntas rápidas aqui pelo site: tipo de festa, data, cidade, quantidade de convidados e o que você quer na mesa.',
    },
    {
      title: 'A gente analisa o que o evento pede',
      description:
        'Com essas informações dá para entender quantidade, cardápio e estrutura necessária para atender bem os seus convidados.',
    },
    {
      title: 'Os detalhes saem pelo WhatsApp',
      description:
        'A conversa continua direto com a nossa família, para acertar cardápio, valores e combinados do dia. Sem compromisso.',
    },
  ],
  note: 'O orçamento é personalizado: não trabalhamos com tabela fixa de preço pelo site.',
} as const;

export const about = {
  eyebrow: 'Nossa história',
  title: 'Nossa família trabalhando para atender a sua.',
  paragraphs: [
    'Cada evento reúne pessoas que importam. Por isso, o cuidado aparece na quantidade, na apresentação e no atendimento. Nossa família trabalha para que a sua possa aproveitar a celebração.',
  ],
  image: 'porcoes-em-bancada' satisfies MediaName,
  caption: 'Porções montadas uma a uma, prontas para servir',
} as const;

export const faq = {
  eyebrow: 'Perguntas frequentes',
  title: 'O que costumam nos perguntar.',
  items: [
    {
      question: 'Quais tipos de eventos o buffet atende?',
      answer:
        'Casamentos, aniversários, festas em geral e confraternizações. Outros tipos de evento, como almoços de empresa, podem ser atendidos sob consulta — é só contar o que você precisa.',
    },
    {
      question: 'O atendimento é feito em quais regiões?',
      answer:
        'Atendemos Aguaí–SP e região. Se o seu evento for em uma cidade vizinha, informe a cidade no orçamento que a gente avalia o atendimento.',
    },
    {
      question: 'Como funciona o pedido de orçamento?',
      answer:
        'Você responde às perguntas do site, confere o resumo e toca em “Solicitar orçamento no WhatsApp”. O aplicativo abre com as informações organizadas e você envia a mensagem. A partir daí a conversa continua com a gente, por lá mesmo.',
    },
    {
      question: 'Posso informar preferências e restrições alimentares?',
      answer:
        'Pode, e ajuda bastante. Existe uma etapa no orçamento para isso e um campo de observações. Combinamos os detalhes na conversa, porque a cozinha prepara vários pratos no mesmo ambiente.',
    },
    {
      question: 'Como combinamos o cardápio?',
      answer:
        'O cardápio é montado junto com você, considerando o tipo de evento, o horário, a quantidade de convidados e o que você quer ver na mesa. As fotos e a lista do site servem como referência do nosso trabalho.',
    },
  ],
} as const;

export const finalCta = {
  title: 'Vamos começar a planejar o seu evento?',
  description:
    'Responda algumas perguntas rápidas. No fim, você confere um resumo e envia tudo pelo WhatsApp, do seu jeito.',
  button: 'Montar meu orçamento',
} as const;

export const footer = {
  familyLine: 'Nossa família trabalhando para atender a sua.',
  privacy:
    'Privacidade: as respostas do orçamento ficam apenas no seu navegador até você tocar em “Solicitar orçamento no WhatsApp”. Nada é enviado automaticamente e não guardamos seus dados neste site.',
} as const;

/** Textos das etapas do orçamento guiado. */
export const quoteCopy = {
  title: 'Orçamento do seu evento',
  intro: 'Uma pergunta por vez. Leva menos de dois minutos.',
  stepLabel: (current: number, total: number) => `Etapa ${current} de ${total}`,
  back: 'Voltar',
  next: 'Continuar',
  restart: 'Recomeçar',
  close: 'Fechar',
  optional: 'opcional',
  steps: {
    eventType: {
      title: 'Qual é o tipo do evento?',
      help: 'Escolha a opção mais próxima. Depois você pode detalhar.',
      otherLabel: 'Conte qual é o evento',
      otherPlaceholder: 'Ex.: almoço de confraternização da empresa',
    },
    date: {
      title: 'Qual é a data do evento?',
      help: 'Se ainda estiver escolhendo, tudo bem — dá para seguir sem data.',
      fieldLabel: 'Data do evento',
      undecided: 'Ainda não defini a data',
    },
    period: {
      title: 'Em que horário será?',
      help: 'Escolha o período. Se já souber a hora, pode informar.',
      timeLabel: 'Horário aproximado',
    },
    place: {
      title: 'Onde vai acontecer?',
      help: 'A cidade ajuda a avaliar o atendimento e o deslocamento.',
      cityLabel: 'Cidade',
      cityPlaceholder: 'Ex.: Aguaí',
      neighborhoodLabel: 'Bairro',
      neighborhoodPlaceholder: 'Ex.: Centro',
      venueQuestion: 'O local do evento já está definido?',
      venueLabel: 'Nome ou referência do local',
      venuePlaceholder: 'Ex.: Salão da igreja, chácara na estrada de Casa Branca',
      venueHint: 'Não precisa de endereço completo agora.',
    },
    guests: {
      title: 'Quantas pessoas você espera?',
      help: 'Uma estimativa já serve. Dá para ajustar depois na conversa.',
      adults: 'Adultos',
      children: 'Crianças',
      total: 'Total de convidados',
      decrease: 'Diminuir',
      increase: 'Aumentar',
    },
    interests: {
      title: 'O que você quer incluir?',
      help: 'Pode marcar mais de uma opção. São itens de interesse — confirmamos tudo no orçamento.',
      otherLabel: 'Conte o que mais você quer',
      otherPlaceholder: 'Ex.: mesa de café',
    },
    restrictions: {
      title: 'Existe alguma preferência ou restrição alimentar?',
      help: 'Se houver, escreva os detalhes que a gente considera no cardápio.',
      detailsLabel: 'Quais preferências ou restrições?',
      detailsPlaceholder: 'Ex.: uma pessoa não come lactose, duas são vegetarianas',
      disclaimer:
        'Preparamos vários pratos na mesma cozinha, então não é possível garantir ausência de contato entre alimentos. Combinamos o que dá para adaptar na conversa.',
    },
    notes: {
      title: 'Quer contar mais alguma coisa?',
      help: 'Algum detalhe importante sobre o evento, o espaço ou o serviço.',
      label: 'Observações',
      placeholder: 'Ex.: a festa começa às 12h e o salão tem cozinha de apoio',
    },
    contact: {
      title: 'Como falamos com você?',
      help: 'Usamos só para continuar a conversa no WhatsApp.',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Ex.: Maria Souza',
      phoneLabel: 'Melhor WhatsApp',
      phonePlaceholder: '(19) 99999-9999',
      consent:
        'Concordo em abrir uma conversa no WhatsApp e enviar estas informações ao Buffet José do Carmo.',
    },
    review: {
      title: 'Confira antes de enviar',
      help: 'Toque em “Editar” em qualquer bloco para ajustar a resposta.',
      edit: 'Editar',
      submit: 'Solicitar orçamento no WhatsApp',
      copy: 'Copiar resumo',
      copied: 'Resumo copiado!',
      copyFailed: 'Não foi possível copiar. Selecione o texto do resumo e copie manualmente.',
      afterClick: 'Tudo pronto! Abrimos seu WhatsApp com as informações organizadas. Agora é só tocar em Enviar.',
      emptyValue: 'Não informado',
    },
  },
  errors: {
    eventType: 'Escolha um tipo de evento para continuar.',
    eventTypeOther: 'Conte rapidamente qual é o evento.',
    date: 'Escolha uma data válida ou marque “Ainda não defini a data”.',
    datePast: 'Escolha uma data a partir de hoje.',
    period: 'Escolha um período para continuar.',
    time: 'Informe um horário válido, como 12:30.',
    city: 'Informe a cidade do evento.',
    venue: 'Diga se o local já está definido.',
    guests: 'Informe pelo menos uma pessoa.',
    interests: 'Escolha pelo menos uma opção.',
    interestsOther: 'Conte o que você quer incluir.',
    restrictions: 'Escolha uma das opções.',
    restrictionsDetails: 'Descreva a preferência ou restrição.',
    name: 'Informe seu nome.',
    phone: 'Informe um WhatsApp válido com DDD.',
    consent: 'É preciso concordar para abrir o WhatsApp.',
  },
} as const;

export const eventTypeOptions: ReadonlyArray<{ id: EventTypeId; label: string; hint: string }> = [
  { id: 'casamento', label: 'Casamento', hint: 'Recepção e festa' },
  { id: 'aniversario', label: 'Aniversário', hint: 'Almoço, tarde ou noite' },
  { id: 'festa', label: 'Festa', hint: 'Comemorações em geral' },
  { id: 'confraternizacao', label: 'Confraternização', hint: 'Amigos, igreja, vizinhos' },
  { id: 'empresarial', label: 'Evento empresarial', hint: 'Equipe e clientes' },
  { id: 'outro', label: 'Outro', hint: 'Conte para a gente' },
];

export const periodOptions: ReadonlyArray<{ id: PeriodId; label: string; hint: string }> = [
  { id: 'manha', label: 'Manhã', hint: 'Café e almoço cedo' },
  { id: 'almoco', label: 'Almoço', hint: 'Serviço no meio do dia' },
  { id: 'tarde', label: 'Tarde', hint: 'Lanche e comemorações' },
  { id: 'noite', label: 'Jantar/noite', hint: 'Festa à noite' },
  { id: 'indefinido', label: 'Ainda não definido', hint: 'Decidimos depois' },
];

export const interestOptions: ReadonlyArray<{ id: InterestId; label: string; hint: string }> = [
  { id: 'refeicao-completa', label: 'Refeição completa em self-service', hint: 'Pratos quentes e acompanhamentos' },
  { id: 'entradas', label: 'Entradas e petiscos', hint: 'Para o começo da festa' },
  { id: 'saladas', label: 'Saladas e acompanhamentos', hint: 'Variedade de saladas' },
  { id: 'frutas', label: 'Mesa de frutas', hint: 'Frutas cortadas e montadas' },
  { id: 'bebidas', label: 'Bebidas/drinks', hint: 'Estrutura de bebidas' },
  { id: 'ajuda', label: 'Quero ajuda para escolher', hint: 'A gente sugere' },
  { id: 'outro', label: 'Outro', hint: 'Conte o que falta' },
];

export const restrictionOptions: ReadonlyArray<{ id: RestrictionAnswer; label: string }> = [
  { id: 'nao', label: 'Não' },
  { id: 'sim', label: 'Sim' },
  { id: 'nao-sei', label: 'Ainda não sei' },
];
