"use client";

import { useEffect, useMemo, useState } from "react";
import { centsToBRL, formatDateLabel } from "@/lib/format";
import type { AppointmentStatus, AppointmentWithDetails, Role } from "@/lib/types";
import { weekdayOfISO } from "@/lib/availability";
import { getLocationConfig } from "@/lib/locations-config";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Aguardando sinal",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-vallue-taken text-vallue-plum-light",
};

function locationLabel(slug: string): string {
  const config = getLocationConfig(slug);
  return config ? `${config.studioName} (${config.serviceLabel})` : slug;
}

export default function AppointmentsClient({ role }: { role: Role }) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/appointments")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => setAppointments(data.appointments))
      .catch(() => setError("Não foi possível carregar os agendamentos."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const availableLocations = useMemo(() => {
    const slugs = new Set(appointments.map((a) => a.locations?.slug).filter(Boolean));
    return Array.from(slugs) as string[];
  }, [appointments]);

  const visible = useMemo(() => {
    return appointments
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => locationFilter === "all" || a.locations?.slug === locationFilter);
  }, [appointments, statusFilter, locationFilter]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a)),
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-sm text-vallue-plum-light">Carregando...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      {role === "master" && availableLocations.length > 1 && (
        <div className="flex gap-2 mb-4">
          <FilterButton active={locationFilter === "all"} onClick={() => setLocationFilter("all")}>
            Todos os locais
          </FilterButton>
          {availableLocations.map((slug) => (
            <FilterButton
              key={slug}
              active={locationFilter === slug}
              onClick={() => setLocationFilter(slug)}
            >
              {locationLabel(slug)}
            </FilterButton>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((status) => (
          <FilterButton
            key={status}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all" ? "Todos" : STATUS_LABELS[status]}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-vallue-plum-light">Nenhum agendamento por aqui ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((appt) => (
            <div
              key={appt.id}
              className="rounded-2xl border border-vallue-border bg-vallue-surface p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {formatDateLabel(appt.date, weekdayOfISO(appt.date))} às{" "}
                    {appt.slot_time.slice(0, 5)}
                  </span>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${STATUS_STYLES[appt.status]}`}
                  >
                    {STATUS_LABELS[appt.status]}
                  </span>
                  {role === "master" && appt.locations && (
                    <span className="text-xs text-vallue-plum-light">
                      {locationLabel(appt.locations.slug)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-vallue-plum-light mt-1">
                  {appt.services?.name} · {appt.client_name} · {appt.client_phone}
                </p>
                <p className="text-sm mt-1">Sinal: {centsToBRL(appt.deposit_cents)}</p>
              </div>

              {appt.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyId === appt.id}
                    onClick={() => updateStatus(appt.id, "confirmed")}
                    className="rounded-full bg-vallue-plum px-4 py-2 text-xs text-white transition hover:bg-vallue-plum-light disabled:opacity-60"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    disabled={busyId === appt.id}
                    onClick={() => updateStatus(appt.id, "cancelled")}
                    className="rounded-full border border-vallue-border px-4 py-2 text-xs transition hover:border-vallue-rose disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-vallue-rose bg-vallue-rose-light/20"
          : "border-vallue-border bg-vallue-surface hover:border-vallue-rose"
      }`}
    >
      {children}
    </button>
  );
}
