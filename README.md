# JME Forge Shop

A React + TypeScript + Vite storefront, styled with Tailwind CSS, using React Query for
server state and Zustand for client state.

## Getting started

```bash
pnpm install
pnpm run dev
```

## Database setup (Supabase)

Products, user profiles, and orders are stored in [Supabase](https://supabase.com) (hosted
Postgres, on its free tier). Schema changes are managed as migrations via the Supabase CLI
(installed as a dev dependency, run through `pnpm exec supabase ...`) rather than by
hand-pasting SQL into the dashboard.

### One-time project setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In **Project Settings > API**, copy your **Project URL** (not the "REST API URL" — it looks
   similar but has `/rest/v1/` on the end, which will break the app) and **anon public** key.
3. Copy `.env.example` to `.env` and fill in those two values:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Log in to the CLI (opens a browser to authorize):
   ```
   pnpm exec supabase login
   ```
5. Link this repo to your project (find your project ref in the dashboard URL or in
   `VITE_SUPABASE_URL`, e.g. `https://<project-ref>.supabase.co`):
   ```
   pnpm exec supabase link --project-ref <project-ref>
   ```
   This will prompt for your database password (set when the project was created — not the
   anon key).
6. Push the schema:
   ```
   pnpm exec supabase db push
   ```
   This creates the `products`, `profiles`, `orders`, and `order_items` tables, their Row
   Level Security policies, and a public `product-images` storage bucket.
7. Optionally seed the placeholder catalog this project shipped with during development by
   pasting [`supabase/seed.sql`](supabase/seed.sql) into the dashboard's **SQL Editor** and
   running it once.
8. Restart `pnpm run dev` so Vite picks up the new environment variables.

### Making schema changes later

Don't edit old migration files or paste full schemas by hand. For each change:

```bash
pnpm exec supabase migration new <short_description>
```

This creates a new timestamped file in `supabase/migrations/` — write just the SQL for that
one change in it, then apply it with:

```bash
pnpm exec supabase db push
```

### Admin area

Signed-in users with `profiles.is_super_user = true` see an "Admin" link in the nav, leading to
a permanent left-hand admin section with **All orders** (`/admin/orders`) and **Manage
products** (`/admin/products`, including create/edit/delete). `/addproduct` also now requires
super-user auth — the `products`/`order`/`order_items` RLS policies and the `product-images`
storage upload policy are scoped to `profiles.is_super_user` (see
`supabase/migrations/20260919224249_admin_permissions.sql`), replacing the temporary
anyone-with-the-anon-key policies from earlier in development.

To make an account a super user (there's no self-service UI for this — it's meant to be rare):

```sql
update public.profiles set is_super_user = true where id = '<user-id>';
```

Run that once in the Supabase dashboard's SQL Editor (find the user's id under
**Authentication > Users**).

## Before going live

- **Set up a real email provider.** Supabase's default built-in SMTP (used for account
  confirmation/password-reset emails) is a shared testing service with a very low rate limit
  (a handful of emails per hour) — fine for development, but it will start failing with "email
  rate limit exceeded" under any real signup traffic. Before launch, connect a real provider
  (Resend, Postmark, SendGrid, etc. all have free tiers) under **Authentication > Settings >
  SMTP Settings** in the Supabase dashboard. Until then, "Confirm email" can be turned off
  under **Authentication > Sign In / Providers > Email** to keep testing signup/login locally
  without sending any email at all.

## Scripts

- `pnpm run dev` — start the Vite dev server with hot module reloading
- `pnpm run build` — type-check and build for production
- `pnpm run lint` — run oxlint
- `pnpm run format` / `pnpm run format:check` — run Prettier
