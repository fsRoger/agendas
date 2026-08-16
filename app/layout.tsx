import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vallue Studio — Agendamentos",
  description: "Agende seu horário no Vallue Studio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-vallue-bg text-vallue-plum">
        {children}
      </body>
    </html>
  );
}
