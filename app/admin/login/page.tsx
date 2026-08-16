"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase mb-2 text-center">
          Vallue Studio
        </p>
        <h1 className="font-serif-display text-2xl mb-8 text-center">Acesso administrativo</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            autoComplete="username"
            className="rounded-xl border border-vallue-border bg-vallue-surface px-4 py-3 text-sm outline-none focus:border-vallue-rose"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoComplete="current-password"
            className="rounded-xl border border-vallue-border bg-vallue-surface px-4 py-3 text-sm outline-none focus:border-vallue-rose"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-vallue-plum px-4 py-3 text-sm text-white transition hover:bg-vallue-plum-light disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
