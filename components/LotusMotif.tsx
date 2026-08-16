// Floreio decorativo inspirado no emblema do Vallue Studio: uma flor de 8
// pétalas alternando tom escuro/claro, igual ao logo, redesenhada em SVG
// puro pra usar como marca d'água leve no fundo da página.
export default function LotusMotif({ className }: { className?: string }) {
  const petal = "M100,100 C78,78 72,45 100,10 C128,45 122,78 100,100 Z";

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={petal}
          fill={i % 2 === 0 ? "var(--color-vallue-plum)" : "var(--color-vallue-rose)"}
          transform={`rotate(${i * 45} 100 100)`}
        />
      ))}
    </svg>
  );
}
