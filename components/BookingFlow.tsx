"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { centsToBRL, formatDateLabel } from "@/lib/format";
import { getLocationConfig, type LocationSlug } from "@/lib/locations-config";
import type { Service } from "@/lib/types";
import LotusMotif from "@/components/LotusMotif";

interface DaySlot {
  time: string;
  available: boolean;
}

interface Day {
  date: string;
  weekday: number;
  slots: DaySlot[];
}

interface BookingResult {
  appointment: {
    date: string;
    time: string;
    serviceName: string;
    priceCents: number;
    depositCents: number;
  };
  pix: {
    key: string;
    payload: string;
    qrDataUrl: string;
  };
}

function StudioHeader({ logoSrc, studioName }: { logoSrc: string | null; studioName: string }) {
  if (!logoSrc) {
    return (
      <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase mb-2">{studioName}</p>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-2">
      <Image
        src={logoSrc}
        alt={studioName}
        width={44}
        height={44}
        className="rounded-full shadow-sm"
      />
      <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase">{studioName}</p>
    </div>
  );
}

export default function BookingFlow({ locationSlug }: { locationSlug: LocationSlug }) {
  // LocationSlug já garante, em tempo de compilação, que existe uma entrada
  // em LOCATIONS — evita um throw antes dos hooks abaixo.
  const config = getLocationConfig(locationSlug)!;

  const [services, setServices] = useState<Service[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/${locationSlug}/availability`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        setServices(data.services);
        setDays(data.days);
      })
      .catch(() => setLoadError("Não foi possível carregar os horários. Tente novamente."))
      .finally(() => setLoading(false));
  }, [locationSlug]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [services, serviceId],
  );

  const selectedDay = useMemo(() => days.find((d) => d.date === date) ?? null, [days, date]);

  const groupedServices = useMemo(() => {
    const groups = new Map<string, Service[]>();
    for (const service of services) {
      const list = groups.get(service.category) ?? [];
      list.push(service);
      groups.set(service.category, list);
    }
    return Array.from(groups.entries());
  }, [services]);

  function selectDate(newDate: string) {
    setDate(newDate);
    setTime(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/${locationSlug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, clientName, clientPhone }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "slot_taken") {
          setSubmitError("Esse horário acabou de ser reservado por outra pessoa. Escolha outro.");
          setTime(null);
          fetch(`/api/${locationSlug}/availability`)
            .then((r) => r.json())
            .then((d) => setDays(d.days));
        } else {
          setSubmitError("Não foi possível concluir o agendamento. Tente novamente.");
        }
        return;
      }

      setResult(data);
    } catch {
      setSubmitError("Não foi possível concluir o agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyPixKey(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (result) {
    return (
      <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-12">
        {config.decorative && (
          <LotusMotif className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 opacity-[0.06]" />
        )}
        <div className="relative w-full max-w-md">
          <StudioHeader logoSrc={config.logoSrc} studioName={config.studioName} />
          <h1 className="font-serif-display text-2xl mb-1">Horário reservado!</h1>
          <p className="text-sm text-vallue-plum-light mb-8">
            Falta só confirmar o sinal para garantir sua vaga.
          </p>

          <div className="rounded-2xl border border-vallue-border bg-vallue-surface p-5 mb-6">
            <p className="text-sm text-vallue-plum-light">{result.appointment.serviceName}</p>
            <p className="text-lg font-medium">
              {formatDateLabel(
                result.appointment.date,
                days.find((d) => d.date === result.appointment.date)?.weekday ??
                  new Date(`${result.appointment.date}T12:00:00`).getDay(),
              )}{" "}
              às {result.appointment.time}
            </p>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-vallue-plum-light">Valor do serviço</span>
              <span>{centsToBRL(result.appointment.priceCents)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Sinal ({config.depositPercent}%)</span>
              <span>{centsToBRL(result.appointment.depositCents)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-vallue-border bg-vallue-surface p-5 flex flex-col items-center text-center mb-6">
            <p className="text-sm mb-4">
              Pague o sinal de <strong>{centsToBRL(result.appointment.depositCents)}</strong> via
              PIX para confirmar:
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.pix.qrDataUrl}
              alt="QR Code PIX"
              width={220}
              height={220}
              className="rounded-lg"
            />
            <button
              type="button"
              onClick={() => copyPixKey(result.pix.payload)}
              className="mt-4 w-full rounded-full bg-vallue-plum px-4 py-3 text-sm text-white transition hover:bg-vallue-plum-light"
            >
              {copied ? "Copiado!" : "Copiar código Pix"}
            </button>
            <p className="mt-3 text-xs text-vallue-plum-light">
              Depois de pagar, envie o comprovante para a profissional confirmar seu horário.
            </p>
          </div>

          <Link
            href={`/${locationSlug}`}
            className="block text-center text-xs text-vallue-plum-light underline"
          >
            Fazer outro agendamento
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-12">
      {config.decorative && (
        <LotusMotif className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 opacity-[0.06]" />
      )}
      <div className="relative w-full max-w-md">
        <StudioHeader logoSrc={config.logoSrc} studioName={config.studioName} />
        <h1 className="font-serif-display text-2xl mb-1">Agende seu horário</h1>
        <p className="text-sm text-vallue-plum-light mb-1">
          {config.serviceLabel} · sinal de {config.depositPercent}% via Pix para confirmar
        </p>
        {config.address && (
          <p className="text-sm text-vallue-plum-light mb-8">{config.address}</p>
        )}
        {!config.address && <div className="mb-8" />}

        {loading && <p className="text-sm text-vallue-plum-light">Carregando horários...</p>}
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}

        {!loading && !loadError && services.length === 0 && (
          <p className="text-sm text-vallue-plum-light">
            Catálogo em breve por aqui — volte em alguns dias.
          </p>
        )}

        {!loading && !loadError && services.length > 0 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <section>
              <h2 className="text-sm font-medium mb-3">1. Escolha a técnica</h2>
              <div className="flex flex-col gap-4">
                {groupedServices.map(([category, items]) => (
                  <div key={category}>
                    <p className="text-xs uppercase tracking-wide text-vallue-plum-light mb-2">
                      {category}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {items.map((service) => (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => setServiceId(service.id)}
                          className={`rounded-xl border px-3 py-3 text-left transition ${
                            serviceId === service.id
                              ? "border-vallue-rose bg-vallue-rose-light/20"
                              : "border-vallue-border bg-vallue-surface hover:border-vallue-rose"
                          }`}
                        >
                          <span className="block text-sm font-medium">{service.name}</span>
                          <span className="block text-sm text-vallue-plum-light">
                            {centsToBRL(service.price_cents)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {serviceId && (
              <section>
                <h2 className="text-sm font-medium mb-3">2. Escolha a data</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map((day) => (
                    <button
                      type="button"
                      key={day.date}
                      onClick={() => selectDate(day.date)}
                      className={`shrink-0 rounded-xl border px-3 py-2 text-sm transition ${
                        date === day.date
                          ? "border-vallue-rose bg-vallue-rose-light/20"
                          : "border-vallue-border bg-vallue-surface hover:border-vallue-rose"
                      }`}
                    >
                      {formatDateLabel(day.date, day.weekday)}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {selectedDay && (
              <section>
                <h2 className="text-sm font-medium mb-3">3. Escolha o horário</h2>
                <div className="flex gap-2 flex-wrap">
                  {selectedDay.slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setTime(slot.time)}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        !slot.available
                          ? "border-vallue-border bg-vallue-taken text-vallue-plum-light line-through cursor-not-allowed"
                          : time === slot.time
                            ? "border-vallue-rose bg-vallue-rose-light/20"
                            : "border-vallue-border bg-vallue-surface hover:border-vallue-rose"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {time && (
              <section>
                <h2 className="text-sm font-medium mb-3">4. Seus dados</h2>
                <div className="flex flex-col gap-3">
                  <input
                    required
                    minLength={2}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo"
                    className="rounded-xl border border-vallue-border bg-vallue-surface px-4 py-3 text-sm outline-none focus:border-vallue-rose"
                  />
                  <input
                    required
                    minLength={8}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="WhatsApp (com DDD)"
                    className="rounded-xl border border-vallue-border bg-vallue-surface px-4 py-3 text-sm outline-none focus:border-vallue-rose"
                  />
                </div>

                {selectedService && (
                  <div className="mt-4 flex justify-between text-sm text-vallue-plum-light">
                    <span>Sinal a pagar ({config.depositPercent}%)</span>
                    <span className="font-medium text-vallue-plum">
                      {centsToBRL(
                        Math.round((selectedService.price_cents * config.depositPercent) / 100),
                      )}
                    </span>
                  </div>
                )}

                {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 w-full rounded-full bg-vallue-plum px-4 py-3 text-sm text-white transition hover:bg-vallue-plum-light disabled:opacity-60"
                >
                  {submitting ? "Reservando..." : "Reservar horário"}
                </button>
              </section>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
