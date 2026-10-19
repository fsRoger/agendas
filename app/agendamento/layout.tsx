import type { Metadata } from "next";

// Agendamento online com sinal via Pix. Fica fora do menu do site e fora do
// Google por enquanto — o acesso é só por link direto (/agendamento).
export const metadata: Metadata = {
  title: "Agendamento",
  robots: { index: false, follow: false },
};

export default function AgendamentoLayout({ children }: LayoutProps<"/agendamento">) {
  return children;
}
