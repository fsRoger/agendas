// Ícones de pedra pro catálogo de cílios (cada técnica do Vallue Studio leva
// o nome de uma pedra no catálogo original: Esmeralda, Âmbar, Ametista,
// Safira, Rubi, Diamante). Detecta a pedra pelo nome do serviço — não
// depende de nenhum campo novo no banco.

type GemCut = "emerald" | "pear" | "trillion" | "oval" | "cushion" | "round";

interface GemDef {
  cut: GemCut;
  color: string;
  highlight: string;
}

const GEM_BY_KEYWORD: [string, GemDef][] = [
  ["esmeralda", { cut: "emerald", color: "#1f7a4d", highlight: "#6fc399" }],
  ["âmbar", { cut: "pear", color: "#c8792b", highlight: "#eab06a" }],
  ["ambar", { cut: "pear", color: "#c8792b", highlight: "#eab06a" }],
  ["ametista", { cut: "trillion", color: "#7a4f9e", highlight: "#bb98d8" }],
  ["safira", { cut: "oval", color: "#2f5fa8", highlight: "#8fb3e6" }],
  ["rubi", { cut: "cushion", color: "#a3273c", highlight: "#e28c9a" }],
  ["diamante", { cut: "round", color: "#a7abb6", highlight: "#f4f6f9" }],
];

export function getGemForServiceName(name: string): GemDef | null {
  const lower = name.toLowerCase();
  const match = GEM_BY_KEYWORD.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : null;
}

const CUT_SHAPES: Record<GemCut, { outline: string; facet: string }> = {
  emerald: {
    outline: "M11,4 L21,4 L28,10 L28,22 L21,28 L11,28 L4,22 L4,10 Z",
    facet: "M11,4 L21,4 L24,7.5 L8,7.5 Z",
  },
  pear: {
    outline:
      "M16,3 C20,3 23,7 23,13 C23,20 20,29 16,29 C12,29 9,20 9,13 C9,7 12,3 16,3 Z",
    facet: "M16,3 C18.5,3 20.5,5.5 21.5,9.5 L10.5,9.5 C11.5,5.5 13.5,3 16,3 Z",
  },
  trillion: {
    outline: "M16,3 L29,27 L3,27 Z",
    facet: "M16,3 L22.5,15.5 L9.5,15.5 Z",
  },
  oval: {
    outline:
      "M16,3 C22.5,3 26.5,9 26.5,16 C26.5,23 22.5,29 16,29 C9.5,29 5.5,23 5.5,16 C5.5,9 9.5,3 16,3 Z",
    facet: "M16,5 C19.5,5 22.5,8.5 23.5,13 L8.5,13 C9.5,8.5 12.5,5 16,5 Z",
  },
  cushion: {
    outline:
      "M10,4 L22,4 Q28,4 28,10 L28,22 Q28,28 22,28 L10,28 Q4,28 4,22 L4,10 Q4,4 10,4 Z",
    facet: "M10,4 L22,4 Q26.5,4 27.5,8.5 L4.5,10.5 Q5,5.5 10,4 Z",
  },
  round: {
    outline:
      "M16,2 L21.5,6 L29.5,9.5 L27.5,17 L29.5,24.5 L21.5,26.5 L16,30 L10.5,26.5 L2.5,24.5 L4.5,17 L2.5,9.5 L10.5,6 Z",
    facet: "M16,10 L21.5,13 L19.5,19 L12.5,19 L10.5,13 Z",
  },
};

export default function GemIcon({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const gem = getGemForServiceName(name);
  if (!gem) return null;

  const shape = CUT_SHAPES[gem.cut];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={shape.outline} fill={gem.color} stroke={gem.color} strokeWidth="0.5" strokeLinejoin="round" />
      <path d={shape.facet} fill={gem.highlight} opacity="0.6" />
    </svg>
  );
}
