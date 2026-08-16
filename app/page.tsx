import Link from "next/link";
import Image from "next/image";
import { LOCATIONS } from "@/lib/locations-config";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif-display text-3xl mb-2">Agendamentos</h1>
        <p className="text-sm text-vallue-plum-light mb-10">Escolha onde quer agendar</p>

        <div className="flex flex-col gap-4">
          {Object.values(LOCATIONS).map((location) => (
            <Link
              key={location.slug}
              href={`/${location.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-vallue-border bg-vallue-surface px-6 py-5 text-left shadow-sm transition hover:border-vallue-rose"
            >
              {location.logoSrc && (
                <Image
                  src={location.logoSrc}
                  alt={location.studioName}
                  width={48}
                  height={48}
                  className="shrink-0 rounded-full shadow-sm"
                />
              )}
              <div>
                <span className="block text-xs tracking-[0.2em] text-vallue-rose uppercase mb-1">
                  {location.studioName}
                </span>
                <span className="block text-lg font-medium">{location.serviceLabel}</span>
                <span className="block text-sm text-vallue-plum-light mt-1">
                  {location.address ?? "Ver horários disponíveis e agendar"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <Link href="/admin/login" className="text-xs text-vallue-plum-light underline">
            Acesso administrativo
          </Link>
        </div>
      </div>
    </main>
  );
}
