"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-vallue-border bg-vallue-bg/60 px-4 py-3 text-base text-vallue-plum outline-none transition placeholder:text-vallue-rose/70 focus:border-vallue-rose focus:bg-vallue-surface focus:ring-2 focus:ring-vallue-rose-light/40";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [lastMessage, setLastMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus("sending");
    setLastMessage(data.message ?? "");

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 rounded-2xl bg-vallue-blush/70 px-6 py-8 text-center" role="status">
        <p className="font-serif-display text-2xl">Mensagem enviada 💜</p>
        <p className="mt-2 text-sm text-vallue-plum-light">Obrigada pelo contato! Te respondo em breve.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-vallue-wine underline underline-offset-4"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block text-sm">
        Nome
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          WhatsApp
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            required
            minLength={8}
            maxLength={20}
            autoComplete="tel"
            placeholder="(11) 90000-0000"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          E-mail <span className="text-vallue-rose">(opcional)</span>
          <input name="email" type="email" maxLength={160} autoComplete="email" className={inputClass} />
        </label>
      </div>
      <label className="block text-sm">
        Mensagem
        <textarea name="message" required minLength={5} maxLength={2000} rows={5} className={`${inputClass} resize-y`} />
      </label>

      {/* Campo armadilha contra spam: invisível pra pessoas, robôs costumam preencher. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Não preencha
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-vallue-blush px-4 py-3 text-sm" role="alert">
          Não consegui enviar agora.{" "}
          <a
            href={whatsappLink(lastMessage || undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-vallue-wine underline underline-offset-4"
          >
            Mande pelo WhatsApp
          </a>{" "}
          que eu respondo por lá.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-vallue-wine px-6 py-3.5 text-sm text-vallue-blush transition hover:bg-vallue-plum disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
