import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { computeAvailability, bookAppointment } from "@/lib/booking";

const bookSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().trim().min(2).max(120),
  clientPhone: z.string().trim().min(8).max(20),
});

/** Cria o handler GET de disponibilidade de um local. Uso em app/api/<slug>/availability/route.ts */
export function createAvailabilityHandler(locationSlug: string) {
  return async function GET() {
    const result = await computeAvailability(locationSlug);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ services: result.services, days: result.days });
  };
}

/** Cria o handler POST de reserva de um local. Uso em app/api/<slug>/book/route.ts */
export function createBookHandler(locationSlug: string) {
  return async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = bookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const result = await bookAppointment(locationSlug, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ appointment: result.appointment, pix: result.pix });
  };
}
