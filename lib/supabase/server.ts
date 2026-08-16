import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para Server Components / Route Handlers — usa a sessão da cookie
// do usuário logado (só serve para descobrir quem é o usuário; a leitura e
// escrita de dados de verdade acontece via lib/supabase/admin.ts).
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — o middleware já cuida de
            // renovar a sessão, então pode ignorar aqui.
          }
        },
      },
    },
  );
}
