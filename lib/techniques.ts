// Técnicas e valores do catálogo oficial
// (public/catalogo_vallue_studio_paleta_oficial.pdf, página 2).
// Atualize aqui quando o catálogo mudar.

export interface Technique {
  name: string;
  /** Nome da pedra — vira o ícone (GemIcon) e o "apelido" da técnica. */
  gem: string | null;
  subtitle?: string;
  description: string;
  applicationBRL: number;
  maintenanceBRL: number;
}

export const TECHNIQUES: Technique[] = [
  {
    name: "Brasileiro",
    gem: null,
    subtitle: "Fio 2D Y ou U",
    description: "Efeito leve e definido para realçar o olhar com naturalidade.",
    applicationBRL: 100,
    maintenanceBRL: 80,
  },
  {
    name: "2D",
    gem: "Ametista",
    description: "Efeito delicado e texturizado, com leveza e mais personalidade.",
    applicationBRL: 100,
    maintenanceBRL: 80,
  },
  {
    name: "3D",
    gem: "Safira",
    description: "Volume intermediário com mais preenchimento, definição e elegância.",
    applicationBRL: 100,
    maintenanceBRL: 80,
  },
  {
    name: "4D",
    gem: "Rubi",
    description: "Um resultado mais marcante, volumoso e sofisticado.",
    applicationBRL: 110,
    maintenanceBRL: 90,
  },
  {
    name: "5D",
    gem: "Diamante",
    description: "Volume intenso e glamouroso para um olhar de impacto.",
    applicationBRL: 120,
    maintenanceBRL: 100,
  },
  {
    name: "Sirena",
    gem: null,
    description: "Efeito alongado que não começa no canto interno e valoriza o canto externo.",
    applicationBRL: 110,
    maintenanceBRL: 90,
  },
  {
    name: "Fox Eyes",
    gem: null,
    description: "Efeito alongado que valoriza os cantos externos e cria um olhar mais puxado.",
    applicationBRL: 120,
    maintenanceBRL: 100,
  },
];

export const MAINTENANCE_DAYS = 20;

export const REMOVAL = {
  withNewApplicationBRL: 25,
  standaloneBRL: 35,
};

export const CARE_TIPS = [
  "Mantenha os cílios limpos e higienize-os diariamente com produto adequado.",
  "Evite esfregar, puxar ou dormir pressionando os cílios.",
  "Penteie delicadamente com uma escovinha limpa.",
  "Evite produtos oleosos na região dos olhos e o uso de curvex.",
  "Siga a orientação profissional sobre água, vapor e cuidados após a aplicação.",
  "Respeite o prazo recomendado para a manutenção.",
];
