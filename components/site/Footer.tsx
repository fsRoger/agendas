import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/site";
import { InstagramIcon, PinIcon, WhatsAppIcon } from "@/components/site/icons";

export default function Footer({ showVideos }: { showVideos: boolean }) {
  const links = NAV_LINKS.filter((link) => showVideos || link.href !== "/videos");

  return (
    <footer className="bg-vallue-wine text-vallue-blush">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* O micromark é cor Ameixa sobre transparente; aqui vira rosa claro. */}
            <Image
              src="/vallue-micromark-institucional-1.png"
              alt=""
              width={44}
              height={44}
              className="brightness-0 invert opacity-90"
            />
            <span className="leading-none">
              <span className="block font-serif-display text-2xl tracking-[0.12em] uppercase">Vallue</span>
              <span className="block text-[0.65rem] tracking-[0.5em] uppercase text-vallue-gold">Studio</span>
            </span>
          </div>
          <p className="mt-5 font-serif-display text-xl italic text-vallue-gold">{SITE.tagline}</p>
          <p className="mt-2 max-w-xs text-sm text-vallue-blush/75">
            Extensão de cílios com atendimento individual, por {SITE.owner}, lash designer.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-vallue-gold">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-vallue-blush/85 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-vallue-gold">Contato</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-vallue-blush/85 hover:text-white">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {SITE.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-vallue-blush/85 hover:text-white">
                <InstagramIcon className="h-4 w-4 shrink-0" />@{SITE.instagram.handle}
              </a>
            </li>
            <li>
              <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-vallue-blush/85 hover:text-white">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {SITE.address.street}
                  <br />
                  {SITE.address.detail}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-vallue-blush/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-vallue-blush/60 sm:px-6">
          © {new Date().getFullYear()} {SITE.name} · Jandira/SP
        </p>
      </div>
    </footer>
  );
}
