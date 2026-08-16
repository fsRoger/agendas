# Vallue Studio — Agendamentos

Sistema de agendamento online. Cliente escolhe serviço, data e horário
disponíveis em `/cilios`, reserva o horário e paga um sinal de 30% via Pix
(chave estática, sem gateway de pagamento). Admins logam em `/admin` para ver
e confirmar/cancelar agendamentos.

## 1. Criar o projeto no Supabase

1. Crie uma conta/projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
   inteiro. Isso cria as tabelas, a trava contra choque de horário e já
   cadastra o local "cílios" com os 6 serviços do catálogo.
3. Crie os 3 logins de admin (e-mail + senha) e já vincule o papel de cada
   um. Duas formas:

   **A. Script (mais rápido)** — depois de preencher `.env.local` (passo 2),
   edite os e-mails/senhas no topo de
   [`scripts/create-admins.mjs`](scripts/create-admins.mjs) e rode:

   ```bash
   node --env-file=.env.local scripts/create-admins.mjs
   ```

   Isso cria os 3 usuários no Supabase Auth e já grava o papel de cada um
   na tabela `profiles`, tudo de uma vez.

   **B. Manual, pelo painel** — em **Authentication > Users > Add user**,
   crie cada login (e-mail + senha) e anote o **User UID**. Depois, no
   **SQL Editor**, rode (trocando pelos UIDs reais):

   ```sql
   insert into profiles (id, role, display_name) values
     ('uuid-do-master', 'master', 'Master'),
     ('uuid-do-adminC', 'adminC', 'Admin Cílios'),
     ('uuid-do-adminU', 'adminU', 'Admin Unhas');
   ```

   - `master` vê e gerencia todos os locais.
   - `adminC` só vê os agendamentos de cílios.
   - `adminU` já existe para quando o serviço de unhas for adicionado.

5. Em **Project Settings > API**, copie a **Project URL**, a **anon public
   key** e a **service_role key** (essa última é secreta — nunca vai para o
   navegador).

## 2. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`: valores do passo anterior.
- `PIX_KEY`: a chave Pix que vai receber o sinal (CPF/CNPJ, e-mail, telefone
  ou chave aleatória).
- `PIX_RECEIVER_NAME`: nome do recebedor como deve aparecer no app do banco
  de quem paga (máx. 25 caracteres, sem acento).
- `PIX_RECEIVER_CITY`: cidade do recebedor (máx. 15 caracteres, sem acento).

O QR Code e o código "copia e cola" são gerados localmente (algoritmo padrão
do Banco Central), sem nenhuma API de pagamento envolvida — o valor cobrado
é sempre calculado no servidor a partir do preço do serviço, nunca confiado
ao que vem do navegador.

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — a página inicial linka
para `/cilios` (agendamento) e `/admin/login` (painel).

## 4. Deploy na Vercel

1. Suba o projeto para um repositório Git e importe na Vercel.
2. Em **Settings > Environment Variables**, adicione as mesmas variáveis do
   `.env.local`.
3. Deploy. O link de `/cilios` é o que vai para as clientes.

## Regras de agenda (cílios)

| Dias | Horários |
| --- | --- |
| Domingo, Sábado | 10:00, 14:00, 18:00 |
| Segunda, Quarta, Sexta | 17:00 |
| Terça, Quinta | Fechado |

O intervalo mínimo de 4h entre atendimentos já está garantido pela própria
grade de horários. Para mudar dias/horários, edite `SCHEDULE` em
[`lib/availability.ts`](lib/availability.ts).

## Estrutura

- `app/cilios` — fluxo público de agendamento.
- `app/admin` — painel protegido (login + lista de agendamentos).
- `app/api/cilios` — disponibilidade e criação de reserva.
- `app/api/admin` — listagem/atualização de agendamentos (autenticado).
- `lib/availability.ts` — regras de dias/horários abertos.
- `lib/pix.ts` — geração do payload Pix (EMV/BR Code) e QR Code.
- `supabase/schema.sql` — schema completo do banco + seed do catálogo.

## Próximo serviço (unhas)

O banco já suporta múltiplos locais (`locations`) e o papel `adminU` já
existe. Para adicionar "unhas": inserir o local e os serviços no banco,
criar `app/unhas/page.tsx` (copiando o padrão de `app/cilios/page.tsx`) e as
rotas equivalentes em `app/api/unhas/`.
