import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase mb-2">
          Vallue Studio
        </p>
        <h1 className="font-serif-display text-3xl mb-10">Agendamentos</h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/cilios"
            className="block rounded-2xl border border-vallue-border bg-vallue-surface px-6 py-5 text-left shadow-sm transition hover:border-vallue-rose"
          >
            <span className="block text-lg font-medium">Cílios</span>
            <span className="block text-sm text-vallue-plum-light mt-1">
              Ver horários disponíveis e agendar
            </span>
          </Link>

          <div className="block rounded-2xl border border-dashed border-vallue-border px-6 py-5 text-left opacity-60">
            <span className="block text-lg font-medium">Unhas</span>
            <span className="block text-sm text-vallue-plum-light mt-1">
              Em breve
            </span>
          </div>
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
