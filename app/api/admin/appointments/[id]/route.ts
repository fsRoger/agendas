import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedProfile, allowedLocationSlugs } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["confirmed", "cancelled"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getAuthedProfile();
  if (!profile) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const admin = createAdminClient();
  const slugs = allowedLocationSlugs(profile.role);

  const { data: appointment } = await admin
    .from("appointments")
    .select("id, location_id, locations(slug)")
    .eq("id", id)
    .single<{ id: string; location_id: string; locations: { slug: string } | null }>();

  const locationSlug = appointment?.locations?.slug ?? null;

  if (!appointment || !locationSlug || !slugs.includes(locationSlug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { error } = await admin
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
