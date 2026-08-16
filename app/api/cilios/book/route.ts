import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocationBySlug } from "@/lib/locations";
import { isSlotInPast, isValidSlot, isWithinBookingWindow, weekdayOfISO } from "@/lib/availability";
import { buildPixPayload, pixPayloadToQrDataUrl } from "@/lib/pix";

export const dynamic = "force-dynamic";

const bookSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().trim().min(2).max(120),
  clientPhone: z.string().trim().min(8).max(20),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { serviceId, date, time, clientName, clientPhone } = parsed.data;

  if (!isWithinBookingWindow(date)) {
    return NextResponse.json({ error: "date_out_of_range" }, { status: 400 });
  }

  const weekday = weekdayOfISO(date);
  if (!isValidSlot(weekday, time) || isSlotInPast(date, time)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }

  const admin = createAdminClient();
  const location = await getLocationBySlug(admin, "cilios");
  if (!location) {
    return NextResponse.json({ error: "location_not_found" }, { status: 500 });
  }

  const { data: service, error: serviceError } = await admin
    .from("services")
    .select("id, name, price_cents, active")
    .eq("id", serviceId)
    .eq("location_id", location.id)
    .single();

  if (serviceError || !service || !service.active) {
    return NextResponse.json({ error: "service_not_found" }, { status: 400 });
  }

  const depositCents = Math.round(service.price_cents * 0.3);

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
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "booking_failed" }, { status: 500 });
  }

  const pixKey = process.env.PIX_KEY;
  const receiverName = process.env.PIX_RECEIVER_NAME;
  const receiverCity = process.env.PIX_RECEIVER_CITY;

  if (!pixKey || !receiverName || !receiverCity) {
    return NextResponse.json({ error: "pix_not_configured" }, { status: 500 });
  }

  const appointmentId = Array.isArray(appointment) ? appointment[0]?.id : appointment?.id;

  const payload = buildPixPayload({
    key: pixKey,
    receiverName,
    receiverCity,
    amountCents: depositCents,
    txid: `AGD${appointmentId?.replace(/-/g, "").slice(0, 20)}`,
  });

  const qrDataUrl = await pixPayloadToQrDataUrl(payload);

  return NextResponse.json({
    appointment: {
      id: appointmentId,
      date,
      time,
      serviceName: service.name,
      priceCents: service.price_cents,
      depositCents,
    },
    pix: {
      key: pixKey,
      payload,
      qrDataUrl,
    },
  });
}
