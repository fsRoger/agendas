import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocationBySlug } from "@/lib/locations";
import {
  isSlotInPast,
  slotsForWeekday,
  upcomingOpenDates,
} from "@/lib/availability";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

// Mesmo TTL usado em book_appointment() no schema.sql — mantenha os dois em
// sincronia se algum dia mudar o tempo de espera pelo PIX.
const PENDING_TTL_MS = 30 * 60 * 1000;

export async function GET() {
  const admin = createAdminClient();
  const location = await getLocationBySlug(admin, "cilios");

  if (!location) {
    return NextResponse.json({ error: "location_not_found" }, { status: 500 });
  }

  const [{ data: services, error: servicesError }, openDates] = await Promise.all([
    admin
      .from("services")
      .select("id, location_id, category, name, price_cents, active")
      .eq("location_id", location.id)
      .eq("active", true)
      .order("category")
      .order("price_cents"),
    Promise.resolve(upcomingOpenDates()),
  ]);

  if (servicesError) {
    return NextResponse.json({ error: "services_query_failed" }, { status: 500 });
  }

  const dateStrings = openDates.map((d) => d.date);
  const { data: appointments, error: apptError } = await admin
    .from("appointments")
    .select("date, slot_time, status, created_at")
    .eq("location_id", location.id)
    .in("date", dateStrings)
    .neq("status", "cancelled");

  if (apptError) {
    return NextResponse.json({ error: "appointments_query_failed" }, { status: 500 });
  }

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
      slots: slotsForWeekday(weekday)
        .filter((time) => !isSlotInPast(date, time))
        .map((time) => ({
          time,
          available: !takenSlots.has(`${date}|${time}`),
        })),
    }))
    .filter((day) => day.slots.length > 0);

  return NextResponse.json({
    services: (services ?? []) as Service[],
    days,
  });
}
