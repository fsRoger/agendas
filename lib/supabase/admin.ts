import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente com a service role key: ignora RLS. Só pode ser importado por
// código que roda no servidor (route handlers). O pacote "server-only"
// garante isso em tempo de build.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
