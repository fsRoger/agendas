// Config central de cada local atendido. Sem "server-only" de propósito —
// isso é usado tanto no servidor (rotas de API) quanto no cliente (páginas
// de agendamento), então não pode conter segredos (chave Pix vem de env var
// no servidor, lida via lib/pix-config.ts).

export type LocationSlug = "cilios" | "unhas";

// 0 = domingo, 1 = segunda, ..., 6 = sábado.
export type WeekSchedule = Record<number, string[]>;

export interface LocationConfig {
  slug: LocationSlug;
  studioName: string;
  serviceLabel: string;
  address: string | null;
  minGapHours: number;
  depositPercent: number;
  schedule: WeekSchedule;
  /** Sufixo das variáveis de ambiente do Pix: PIX_KEY_<sufixo>, etc. */
  pixEnvSuffix: string;
  /** Caminho em /public do emblema do local, se já existir uma identidade visual. */
  logoSrc: string | null;
  /** Mostra o floreio decorativo (motivo floral) no fundo da página. */
  decorative: boolean;
}

const EVERY_DAY_9_TO_19_EVERY_3H = [0, 1, 2, 3, 4, 5, 6].reduce<WeekSchedule>((acc, weekday) => {
  acc[weekday] = ["09:00", "12:00", "15:00", "18:00"];
  return acc;
}, {});

export const LOCATIONS: Record<LocationSlug, LocationConfig> = {
  cilios: {
    slug: "cilios",
    studioName: "Vallue Studio",
    serviceLabel: "Cílios",
    address: null,
    minGapHours: 4,
    depositPercent: 30,
    pixEnvSuffix: "CILIOS",
    logoSrc: "/brand/vallue-mark.jpg",
    decorative: true,
    schedule: {
      0: ["10:00", "14:00", "18:00"], // domingo
      1: ["17:00"], // segunda
      2: [], // terça — fechado
      3: ["17:00"], // quarta
      4: [], // quinta — fechado
      5: ["17:00"], // sexta
      6: ["10:00", "14:00", "18:00"], // sábado
    },
  },
  unhas: {
    slug: "unhas",
    studioName: "Thany Studio",
    serviceLabel: "Unhas",
    address: "Rua Daniel de Souza Guerra, 37 — Barueri/SP",
    minGapHours: 3,
    depositPercent: 30,
    pixEnvSuffix: "UNHAS",
    logoSrc: null,
    decorative: false,
    // Atende todos os dias, 9h-19h, com 3h entre agendamentos.
    schedule: EVERY_DAY_9_TO_19_EVERY_3H,
  },
};

export function getLocationConfig(slug: string): LocationConfig | null {
  return Object.prototype.hasOwnProperty.call(LOCATIONS, slug)
    ? LOCATIONS[slug as LocationSlug]
    : null;
}

export function isKnownLocationSlug(slug: string): slug is LocationSlug {
  return getLocationConfig(slug) !== null;
}
