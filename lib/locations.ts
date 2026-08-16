import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getLocationBySlug(admin: SupabaseClient, slug: string) {
  const { data, error } = await admin
    .from("locations")
    .select("id, slug, name")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as { id: string; slug: string; name: string };
}
