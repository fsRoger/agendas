import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/types";

export interface AuthedProfile {
  userId: string;
  email: string | null;
  role: Role;
  displayName: string | null;
}

// Locais que cada papel pode ver/gerenciar.
export function allowedLocationSlugs(role: Role): string[] {
  if (role === "master") return ["cilios", "unhas"];
  if (role === "adminC") return ["cilios"];
  return ["unhas"];
}

// Sempre valida com getUser() (que confere com o servidor de auth), nunca
// com getSession() — é o que a própria Supabase recomenda para checagens
// de autorização no servidor.
export async function getAuthedProfile(): Promise<AuthedProfile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    role: profile.role as Role,
    displayName: profile.display_name as string | null,
  };
}
