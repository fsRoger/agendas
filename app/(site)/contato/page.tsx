import type { Metadata } from "next";
import { SITE, whatsappLink } from "@/lib/site";
import PageIntro from "@/components/site/PageIntro";
import ContactForm from "@/components/site/ContactForm";
import { InstagramIcon, PinIcon, WhatsAppIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o Vallue Studio pelo WhatsApp, Instagram ou formulário de contato.",
};

export default function ContatoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contato"
        title="Vamos conversar?"
        description="Dúvidas, sugestões ou agendamentos — escolha o jeito que preferir."
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl bg-vallue-wine p-6 text-vallue-blush transition hover:bg-vallue-plum"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vallue-blush/15">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs tracking-[0.2em] uppercase text-vallue-gold">WhatsApp · resposta mais rápida</span>
              <span className="mt-1 block font-serif-display text-2xl">{SITE.whatsapp.display}</span>
            </span>
          </a>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-vallue-border bg-vallue-surface p-6 transition hover:border-vallue-rose"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vallue-lilac text-vallue-wine">
              <InstagramIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs tracking-[0.2em] uppercase text-vallue-rose">Instagram</span>
              <span className="mt-1 block font-serif-display text-2xl">@{SITE.instagram.handle}</span>
            </span>
          </a>
          <a
            href={SITE.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-vallue-border bg-vallue-surface p-6 transition hover:border-vallue-rose"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vallue-lilac text-vallue-wine">
              <PinIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs tracking-[0.2em] uppercase text-vallue-rose">Endereço</span>
              <span className="mt-1 block">{SITE.address.street}</span>
              <span className="block text-sm text-vallue-plum-light">{SITE.address.detail}</span>
            </span>
          </a>
        </div>

        <div className="rounded-3xl border border-vallue-border bg-vallue-surface p-6 sm:p-8">
          <h2 className="font-serif-display text-3xl font-medium">Envie uma mensagem</h2>
          <p className="mt-2 text-sm text-vallue-plum-light">Respondo pelo contato que você deixar aqui.</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
