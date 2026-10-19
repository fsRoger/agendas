import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

// Cormorant acompanha a serifa do logo; Jost é a geométrica do cartão fidelidade.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — Extensão de cílios em Jandira/SP`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`h-full ${display.variable} ${body.variable}`}>
      <body className="min-h-full flex flex-col bg-vallue-bg text-vallue-plum antialiased">
        {children}
      </body>
    </html>
  );
}
