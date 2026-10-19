// Dados públicos do estúdio (tirados do catálogo e do cartão fidelidade em
// /public). Usado tanto no servidor quanto no cliente — nada secreto aqui.

export const SITE = {
  name: "Vallue Studio",
  tagline: "O valor está nos detalhes",
  description:
    "Blog do Vallue Studio: cuidados, curiosidades e técnicas de extensão de cílios, por Thainá, lash designer em Jandira/SP.",
  owner: "Thainá",
  whatsapp: {
    display: "(11) 95342-2980",
    /** Formato internacional, só dígitos, para links wa.me. */
    number: "5511953422980",
  },
  instagram: {
    handle: "vallue.studio",
    url: "https://www.instagram.com/vallue.studio/",
  },
  address: {
    street: "Rua Benedito Pereira Leite, nº 20",
    detail: "Campainha 3 · Jandira/SP",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Benedito+Pereira+Leite+20+Jandira+SP",
  },
} as const;

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Thainá! Vim pelo site do Vallue Studio e gostaria de agendar um horário.";

export function whatsappLink(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** URL pública do site (sitemap, Open Graph). Na Vercel usa o domínio de produção. */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/blog", label: "Blog" },
  { href: "/tecnicas", label: "Técnicas" },
  { href: "/videos", label: "Vídeos" },
  { href: "/contato", label: "Contato" },
] as const;
