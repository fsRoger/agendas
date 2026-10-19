"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/icons";

export default function Header({ showVideos }: { showVideos: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = NAV_LINKS.filter((link) => showVideos || link.href !== "/videos");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-vallue-border/70 bg-vallue-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/vallue-micromark-institucional-1.png"
            alt=""
            width={36}
            height={36}
            priority
          />
          <span className="leading-none">
            <span className="block font-serif-display text-xl tracking-[0.12em] uppercase">Vallue</span>
            <span className="block text-[0.6rem] tracking-[0.5em] uppercase text-vallue-rose">Studio</span>
          </span>
          <span className="sr-only">{SITE.name} — início</span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`tracking-wide transition hover:text-vallue-wine ${
                    isActive(link.href)
                      ? "text-vallue-wine underline decoration-vallue-mauve underline-offset-8"
                      : "text-vallue-plum-light"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-vallue-wine px-4 py-2 text-sm text-vallue-blush transition hover:bg-vallue-plum"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Agendar
          </a>
          <button
            type="button"
            className="md:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-vallue-plum"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Principal" className="md:hidden border-t border-vallue-border bg-vallue-bg">
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block py-3 font-serif-display text-2xl ${
                    isActive(link.href) ? "text-vallue-wine" : "text-vallue-plum"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-vallue-wine px-4 py-3 text-sm text-vallue-blush"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Agendar pelo WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
