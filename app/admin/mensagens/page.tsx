import Link from "next/link";
import { getAuthedProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import LogoutButton from "../LogoutButton";

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  created_at: string;
}

export default async function MensagensPage() {
  const profile = await getAuthedProfile();

  // O formulário de contato é do site do Vallue Studio (cílios).
  if (!profile || profile.role === "adminU") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm">Você não tem acesso às mensagens do site.</p>
        <Link href="/admin" className="mt-4 text-sm underline">Voltar</Link>
      </main>
    );
  }

  const { data, error } = await createAdminClient()
    .from("contact_messages")
    .select("id, name, phone, email, message, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const messages = (data ?? []) as ContactMessage[];

  return (
    <main className="flex flex-1 flex-col px-6 py-10 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase mb-1">Vallue Studio</p>
          <h1 className="font-serif-display text-2xl">Mensagens do site</h1>
          <Link href="/admin" className="text-sm text-vallue-plum-light underline mt-1 inline-block">
            ← Agendamentos
          </Link>
        </div>
        <LogoutButton />
      </div>

      {error && <p className="text-sm text-red-700">Não foi possível carregar as mensagens.</p>}
      {!error && messages.length === 0 && (
        <p className="text-sm text-vallue-plum-light">Nenhuma mensagem ainda.</p>
      )}

      <ul className="space-y-4">
        {messages.map((msg) => {
          const digits = msg.phone.replace(/\D/g, "");
          const waNumber = digits.length <= 11 ? `55${digits}` : digits;
          return (
            <li key={msg.id} className="rounded-2xl border border-vallue-border bg-vallue-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{msg.name}</p>
                <time dateTime={msg.created_at} className="text-xs text-vallue-plum-light">
                  {new Date(msg.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </time>
              </div>
              <p className="mt-1 text-sm text-vallue-plum-light">
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {msg.phone}
                </a>
                {msg.email && (
                  <>
                    {" · "}
                    <a href={`mailto:${msg.email}`} className="underline">{msg.email}</a>
                  </>
                )}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{msg.message}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
