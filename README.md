# Vallue Studio — Blog + Agendamentos

Site do Vallue Studio (extensão de cílios, Jandira/SP), feito em Next.js +
Tailwind e hospedado na Vercel.

## O site

| Rota | O que é |
| --- | --- |
| `/` | Home: apresentação, últimos posts, técnicas, cuidados e contato |
| `/blog` e `/blog/<slug>` | Posts sobre cuidados e curiosidades |
| `/tecnicas` | Técnicas e valores (do catálogo oficial) |
| `/videos` | Vídeos do YouTube/Instagram (aparece no menu quando houver vídeos) |
| `/contato` | WhatsApp, Instagram, endereço e formulário |
| `/agendamento` | Agendamento online com sinal via Pix — fora do menu e do Google |
| `/admin` | Painel: agendamentos e mensagens do formulário |

### Onde editar o conteúdo

- **Posts:** um arquivo `.md` por post em [`content/posts/`](content/posts). O nome
  do arquivo vira a URL. Copie um post existente e troque o cabeçalho
  (`title`, `description`, `date`, `category`, `gem`; opcionalmente
  `cover: /blog/foto.jpg` para usar uma foto salva em `public/blog/`, ou
  `draft: true` para esconder). Formatação aceita: `##`/`###` títulos,
  listas com `-` ou `1.`, `> citação`, `**negrito**`, `*itálico*` e
  `[link](url)`.
- **Vídeos:** cole os links em [`lib/videos.ts`](lib/videos.ts).
- **Técnicas, preços e cuidados:** [`lib/techniques.ts`](lib/techniques.ts).
- **WhatsApp, Instagram, endereço:** [`lib/site.ts`](lib/site.ts).
- **Cores da marca:** [`app/globals.css`](app/globals.css) (paleta oficial).

### Formulário de contato

As mensagens ficam salvas no Supabase (tabela `contact_messages`) e aparecem
em `/admin/mensagens`. Se o banco já existia antes do blog, rode
[`supabase/migrations/2026-10-17_contact_messages.sql`](supabase/migrations/2026-10-17_contact_messages.sql)
no SQL Editor. Se o envio falhar, o formulário oferece mandar pelo WhatsApp.

## Agendamento (parte separada)

O sistema abaixo continua funcionando em `/agendamento/cilios` e
`/agendamento/unhas` (os links antigos `/cilios` e `/unhas` redirecionam).
Cliente escolhe serviço, data e horário, reserva e paga um sinal de 30% via Pix
(chave estática, sem gateway de pagamento).

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

Abra [http://localhost:3000](http://localhost:3000) para ver o blog.
O agendamento fica em `/agendamento` e o painel em `/admin/login`.

## 4. Deploy na Vercel

1. Suba o projeto para um repositório Git e importe na Vercel.
2. Em **Settings > Environment Variables**, adicione as mesmas variáveis do
   `.env.local`.
3. Deploy. O domínio principal abre o blog; o link de agendamento é
   `/agendamento/cilios`.

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

- `app/(site)` — blog e páginas públicas (header/footer próprios).
- `content/posts` — posts em Markdown.
- `app/agendamento` — fluxo público de agendamento.
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
