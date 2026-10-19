import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  email: z.union([z.literal(""), z.email().max(160)]).optional().default(""),
  message: z.string().trim().min(5).max(2000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { name, phone, email, message, website } = parsed.data;

  // Honeypot preenchido = robô. Responde "ok" pra não dar pista, mas não salva.
  if (website) return NextResponse.json({ ok: true });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { error } = await createAdminClient()
    .from("contact_messages")
    .insert({ name, phone, email: email || null, message });

  if (error) {
    console.error("contact_messages insert failed", error);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
