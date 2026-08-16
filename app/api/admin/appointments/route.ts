import { NextResponse } from "next/server";
import { getAuthedProfile, allowedLocationSlugs } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getAuthedProfile();
  if (!profile) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const slugs = allowedLocationSlugs(profile.role);
  const admin = createAdminClient();

  const { data: locations } = await admin
    .from("locations")
    .select("id, slug, name")
    .in("slug", slugs);

  const locationIds = (locations ?? []).map((l) => l.id);
  if (locationIds.length === 0) {
    return NextResponse.json({ appointments: [] });
  }

  const { data: appointments, error } = await admin
    .from("appointments")
    .select(
      "id, location_id, service_id, date, slot_time, client_name, client_phone, deposit_cents, status, created_at, services(name, category, price_cents), locations(slug, name)",
    )
    .in("location_id", locationIds)
    .order("date", { ascending: true })
    .order("slot_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  return NextResponse.json({
    appointments: appointments ?? [],
    role: profile.role,
  });
}
