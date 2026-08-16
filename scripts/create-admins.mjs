// Cria os 3 logins de admin de uma vez (usuário no Supabase Auth + papel na
// tabela profiles). Rode uma vez, depois pode apagar ou deixar aí.
//
// 1. Edite os e-mails e senhas abaixo.
// 2. Rode:  node --env-file=.env.local scripts/create-admins.mjs
//
// Usa a API REST da Supabase direto (fetch), sem depender do pacote
// @supabase/supabase-js — assim funciona em qualquer versão do Node,
// sem esbarrar no requisito de WebSocket nativo do cliente realtime.

const ADMINS = [
  { email: "master@vallue.com", password: "TROQUE-ESTA-SENHA-1", role: "master", displayName: "Master" },
  { email: "cilios@vallue.com", password: "TROQUE-ESTA-SENHA-2", role: "adminC", displayName: "Admin Cílios" },
  { email: "unhas@vallue.com", password: "TROQUE-ESTA-SENHA-3", role: "adminU", displayName: "Admin Unhas" },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Rode com: node --env-file=.env.local scripts/create-admins.mjs");
  process.exit(1);
}

const authHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

for (const a of ADMINS) {
  const createRes = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      email: a.email,
      password: a.password,
      email_confirm: true,
    }),
  });

  const created = await createRes.json();

  if (!createRes.ok) {
    console.error(`✗ ${a.email}: ${created.msg || created.message || createRes.statusText}`);
    continue;
  }

  const profileRes = await fetch(`${url}/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: { ...authHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: created.id, role: a.role, display_name: a.displayName }),
  });

  if (!profileRes.ok) {
    const err = await profileRes.text();
    console.error(`✗ ${a.email} criado, mas falhou ao salvar o papel: ${err}`);
    continue;
  }

  console.log(`✓ ${a.email} (${a.role})`);
}
