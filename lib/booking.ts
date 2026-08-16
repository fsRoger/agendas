import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocationBySlug } from "@/lib/locations";
import { getLocationConfig } from "@/lib/locations-config";
import { getPixConfig } from "@/lib/pix-config";
import { buildPixPayload, pixPayloadToQrDataUrl } from "@/lib/pix";
import {
  isSlotInPast,
  isValidSlot,
  isWithinBookingWindow,
  slotsForWeekday,
  upcomingOpenDates,
  weekdayOfISO,
} from "@/lib/availability";
import type { Service } from "@/lib/types";

// Mesmo TTL usado em book_appointment() no schema.sql — mantenha os dois em
// sincronia se algum dia mudar o tempo de espera pelo Pix.
const PENDING_TTL_MS = 30 * 60 * 1000;

type Failure = { ok: false; status: number; error: string };

export interface AvailabilityDay {
  date: string;
  weekday: number;
  slots: { time: string; available: boolean }[];
}

export async function computeAvailability(
  locationSlug: string,
): Promise<{ ok: true; services: Service[]; days: AvailabilityDay[] } | Failure> {
  const config = getLocationConfig(locationSlug);
  if (!config) return { ok: false, status: 404, error: "unknown_location" };

  const admin = createAdminClient();
  const location = await getLocationBySlug(admin, locationSlug);
  if (!location) return { ok: false, status: 500, error: "location_not_found" };

  const [{ data: services, error: servicesError }, openDates] = await Promise.all([
    admin
      .from("services")
      .select("id, location_id, category, name, price_cents, active")
      .eq("location_id", location.id)
      .eq("active", true)
      .order("category")
      .order("price_cents"),
    Promise.resolve(upcomingOpenDates(config.schedule)),
  ]);

  if (servicesError) return { ok: false, status: 500, error: "services_query_failed" };

  const dateStrings = openDates.map((d) => d.date);
  const { data: appointments, error: apptError } = await admin
    .from("appointments")
    .select("date, slot_time, status, created_at")
    .eq("location_id", location.id)
    .in("date", dateStrings)
    .neq("status", "cancelled");

  if (apptError) return { ok: false, status: 500, error: "appointments_query_failed" };

  const now = Date.now();
  const takenSlots = new Set<string>();
  for (const appt of appointments ?? []) {
    if (appt.status === "pending") {
      const age = now - new Date(appt.created_at).getTime();
      if (age > PENDING_TTL_MS) continue; // expirado, considera livre de novo
    }
    takenSlots.add(`${appt.date}|${String(appt.slot_time).slice(0, 5)}`);
  }

  const days = openDates
    .map(({ date, weekday }) => ({
      date,
      weekday,
      slots: slotsForWeekday(config.schedule, weekday)
        .filter((time) => !isSlotInPast(date, time))
        .map((time) => ({ time, available: !takenSlots.has(`${date}|${time}`) })),
    }))
    .filter((day) => day.slots.length > 0);

  return { ok: true, services: (services ?? []) as Service[], days };
}

export interface BookInput {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

export interface BookSuccess {
  ok: true;
  appointment: {
    id: string;
    date: string;
    time: string;
    serviceName: string;
    priceCents: number;
    depositCents: number;
  };
  pix: { key: string; payload: string; qrDataUrl: string };
}

export async function bookAppointment(
  locationSlug: string,
  input: BookInput,
): Promise<BookSuccess | Failure> {
  const config = getLocationConfig(locationSlug);
  if (!config) return { ok: false, status: 404, error: "unknown_location" };

  const { serviceId, date, time, clientName, clientPhone } = input;

  if (!isWithinBookingWindow(date)) {
    return { ok: false, status: 400, error: "date_out_of_range" };
  }

  const weekday = weekdayOfISO(date);
  if (!isValidSlot(config.schedule, weekday, time) || isSlotInPast(date, time)) {
    return { ok: false, status: 400, error: "invalid_slot" };
  }

  const admin = createAdminClient();
  const location = await getLocationBySlug(admin, locationSlug);
  if (!location) return { ok: false, status: 500, error: "location_not_found" };

  const { data: service, error: serviceError } = await admin
    .from("services")
    .select("id, name, price_cents, active")
    .eq("id", serviceId)
    .eq("location_id", location.id)
    .single();

  if (serviceError || !service || !service.active) {
    return { ok: false, status: 400, error: "service_not_found" };
  }

  const depositCents = Math.round((service.price_cents * config.depositPercent) / 100);

  const { data: appointment, error: bookError } = await admin.rpc("book_appointment", {
    p_location_id: location.id,
    p_service_id: service.id,
    p_date: date,
    p_slot_time: `${time}:00`,
    p_client_name: clientName,
    p_client_phone: clientPhone,
    p_deposit_cents: depositCents,
  });

  if (bookError) {
    if (bookError.message?.includes("slot_taken")) {
      return { ok: false, status: 409, error: "slot_taken" };
    }
    return { ok: false, status: 500, error: "booking_failed" };
  }

  const pixConfig = getPixConfig(config.pixEnvSuffix);
  if (!pixConfig) return { ok: false, status: 500, error: "pix_not_configured" };

  const appointmentId = Array.isArray(appointment) ? appointment[0]?.id : appointment?.id;

  const payload = buildPixPayload({
    key: pixConfig.key,
    receiverName: pixConfig.receiverName,
    receiverCity: pixConfig.receiverCity,
    amountCents: depositCents,
    txid: `AGD${String(appointmentId).replace(/-/g, "").slice(0, 20)}`,
  });

  const qrDataUrl = await pixPayloadToQrDataUrl(payload);

  return {
    ok: true,
    appointment: {
      id: appointmentId,
      date,
      time,
      serviceName: service.name,
      priceCents: service.price_cents,
      depositCents,
    },
    pix: { key: pixConfig.key, payload, qrDataUrl },
  };
}
