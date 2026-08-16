-- Schema do sistema de agendamentos (Vallue Studio)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  category text not null,
  name text not null,
  price_cents integer not null check (price_cents > 0),
  active boolean not null default true
);

-- role já define o escopo de acesso: master (tudo), adminC (cilios), adminU (unhas)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('master', 'adminC', 'adminU')),
  display_name text
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,
  date date not null,
  slot_time time not null,
  client_name text not null,
  client_phone text not null,
  deposit_cents integer not null check (deposit_cents > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Trava de corrida: impede 2 agendamentos ativos no mesmo horário/local.
-- Agendamentos cancelados não contam, então o horário libera de novo.
create unique index if not exists one_active_booking_per_slot
  on appointments (location_id, date, slot_time)
  where status <> 'cancelled';

create index if not exists appointments_location_date_idx
  on appointments (location_id, date);

-- ---------------------------------------------------------------------------
-- RLS: fechado por padrão. Toda leitura/escrita passa pelas rotas do Next.js
-- usando a service role key (nunca exposta ao navegador), então as regras de
-- negócio (cálculo do sinal, papel do admin, regra das 4h) ficam só no servidor.
-- ---------------------------------------------------------------------------

alter table locations enable row level security;
alter table services enable row level security;
alter table profiles enable row level security;
alter table appointments enable row level security;
-- Nenhuma policy criada = nenhum acesso via anon/authenticated key. Só a
-- service role (que ignora RLS) consegue ler/escrever.

-- ---------------------------------------------------------------------------
-- Função de reserva atômica
-- Libera automaticamente reservas "pending" abandonadas há mais de 30 min
-- (cliente nunca mandou o PIX) antes de tentar inserir a nova.
-- ---------------------------------------------------------------------------

create or replace function book_appointment(
  p_location_id uuid,
  p_service_id uuid,
  p_date date,
  p_slot_time time,
  p_client_name text,
  p_client_phone text,
  p_deposit_cents integer
) returns appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_appointment appointments;
begin
  update appointments
    set status = 'cancelled'
    where location_id = p_location_id
      and date = p_date
      and slot_time = p_slot_time
      and status = 'pending'
      and created_at < now() - interval '30 minutes';

  insert into appointments (
    location_id, service_id, date, slot_time,
    client_name, client_phone, deposit_cents, status
  ) values (
    p_location_id, p_service_id, p_date, p_slot_time,
    p_client_name, p_client_phone, p_deposit_cents, 'pending'
  )
  returning * into v_appointment;

  return v_appointment;
exception
  when unique_violation then
    raise exception 'slot_taken';
end;
$$;

-- ---------------------------------------------------------------------------
-- Seed: local + catálogo de cílios (Vallue Studio)
-- ---------------------------------------------------------------------------

insert into locations (slug, name)
values ('cilios', 'Vallue Studio - Cílios')
on conflict (slug) do nothing;

insert into services (location_id, category, name, price_cents, active)
select l.id, v.category, v.name, v.price_cents, true
from locations l
join (values
  ('Clássicos', 'Brasileirinho (Esmeralda)', 6000),
  ('Clássicos', 'Fox Eyes (Âmbar)', 8000),
  ('Linha Vallue', 'Fio U (Ametista)', 6000),
  ('Linha Vallue', '3D (Safira)', 6500),
  ('Linha Vallue', '4D (Rubi)', 7500),
  ('Linha Vallue', '5D (Diamante)', 8500)
) as v(category, name, price_cents) on true
where l.slug = 'cilios'
  and not exists (
    select 1 from services s where s.location_id = l.id and s.name = v.name
  );

-- ---------------------------------------------------------------------------
-- Seed: local + catálogo de unhas (Thany Studio, Barueri/SP)
-- ---------------------------------------------------------------------------

insert into locations (slug, name)
values ('unhas', 'Thany Studio')
on conflict (slug) do nothing;

insert into services (location_id, category, name, price_cents, active)
select l.id, v.category, v.name, v.price_cents, true
from locations l
join (values
  ('Serviços', 'Alongamento no molde F1', 8000),
  ('Serviços', 'Manutenção do alongamento', 5000),
  ('Serviços', 'Banho de gel', 6000),
  ('Serviços', 'Esmaltação em gel', 4500)
) as v(category, name, price_cents) on true
where l.slug = 'unhas'
  and not exists (
    select 1 from services s where s.location_id = l.id and s.name = v.name
  );

-- ---------------------------------------------------------------------------
-- Depois de rodar este arquivo, crie os 3 admins:
-- 1. Painel Supabase > Authentication > Users > Add user (e-mail + senha)
-- 2. Para cada um, rode (trocando o uuid pelo "User UID" mostrado no painel):
--
-- insert into profiles (id, role, display_name) values
--   ('uuid-do-master', 'master', 'Master'),
--   ('uuid-do-adminC', 'adminC', 'Admin Cílios'),
--   ('uuid-do-adminU', 'adminU', 'Admin Unhas');
-- ---------------------------------------------------------------------------
