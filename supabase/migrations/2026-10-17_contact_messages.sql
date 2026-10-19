-- ---------------------------------------------------------------------------
-- Mensagens do formulário de contato do site (/contato).
-- Gravadas pela rota /api/contato com a service role; lidas em /admin/mensagens.
-- ---------------------------------------------------------------------------

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

alter table contact_messages enable row level security;
-- Sem policies: só o servidor (service role) acessa.
