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

Signed-in users with `profiles.is_super_user = true` see a permanent left-hand admin drawer with
**All orders** (`/admin/orders`) and **Manage products** (`/admin/products`, including
create/edit/delete). `/addproduct` also now requires
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

## Payments (Stripe)

In-stock products can be bought via Stripe Checkout. This runs as two Supabase Edge Functions
(`supabase/functions/create-checkout-session` and `supabase/functions/stripe-webhook`) rather
than a separately hosted server — Stripe has no monthly fee, only a per-transaction fee, and
edge functions run on Supabase's existing free tier.

**How it works:** clicking "Buy now" on an in-stock product calls
`create-checkout-session` (requires a logged-in Supabase user), which creates a Stripe Checkout
Session and redirects to Stripe's hosted payment page. On success, Stripe calls the
`stripe-webhook` function, which verifies the event's signature, then creates the `orders` and
`order_items` rows and marks the product `sold_out` using the service-role key (bypassing RLS,
since the customer isn't a super user).

### One-time setup

1. Create a free [Stripe](https://stripe.com) account. Stay in **test mode** while developing —
   test-mode API keys and test card numbers (e.g. `4242 4242 4242 4242`) don't move real money.
2. In the Stripe dashboard, copy your test **Secret key** (**Developers > API keys**).
3. Set the edge function secrets (run this yourself — it's your Stripe key, not something to
   paste into chat):
   ```bash
   pnpm exec supabase secrets set STRIPE_SECRET_KEY=sk_test_... SITE_URL=http://localhost:5173
   ```
   (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are already
   auto-provided to every edge function by Supabase — no need to set those.)
4. Deploy the functions:
   ```bash
   pnpm exec supabase functions deploy create-checkout-session
   pnpm exec supabase functions deploy stripe-webhook
   ```
5. In the Stripe dashboard, go to **Developers > Webhooks > Add endpoint**, set the URL to:
   ```
   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
   ```
   and subscribe it to the `checkout.session.completed` event.
6. Copy the webhook's **Signing secret** (starts `whsec_...`) and set it the same way:
   ```bash
   pnpm exec supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

Update `SITE_URL` (and redeploy `create-checkout-session`) once there's a real production
domain, so Stripe redirects customers back to the live site instead of localhost. Switching
from test mode to live mode later just means repeating steps 2–6 with live keys.

## SEO & pre-rendering

This is a client-rendered React SPA, which is a weak foundation for search visibility on its
own — search engines have to execute JavaScript to see per-page content, and things like
Facebook/WhatsApp link previews often don't execute JS at all. To fix this, `pnpm run build`
runs a pre-rendering step (`scripts/prerender.mjs`) after the normal Vite build that:

- Renders the Home page, the Products listing, and every individual product page to real
  static HTML (via `src/entry-server.tsx`, using React's `renderToString` and React Query's
  `dehydrate`/`hydrate` so the client picks up the same data without a "Loading…" flash),
  each with the correct `<title>`, meta description, canonical URL, Open Graph tags, and
  JSON-LD structured data (`LocalBusiness` on Home, `Product` on each product page).
- Generates `dist/sitemap.xml` and `dist/robots.txt` from the same product data (the latter
  disallows `/admin/`, `/addproduct`, `/account`, and `/login`, since those are private and
  have no SEO value).
- Writes a generic `dist/app-shell.html` for those private routes to fall back to, so a fresh
  visit to e.g. `/account` doesn't hydrate on top of the Home page's prerendered markup. Which
  URL maps to which file is handled by `public/_redirects` — Cloudflare Pages and Netlify both
  read this format natively; a different host will need the equivalent rewrite rules
  translated from that file.

**Before deploying**, set `VITE_SITE_URL` in `.env` to the real production domain (used for
canonical URLs, Open Graph URLs, and the sitemap) — it defaults to `http://localhost:5173`.

On-page copy targets realistic search terms: broad national terms like "kitchen knives" are
extremely competitive and unlikely to rank for a new small site regardless of technical SEO;
the actual strategy here is long-tail + local ("custom kitchen knife Lancashire", "handmade
knife maker Chorley") plus the lower-competition niches (karambits, custom swords). Setting up
a free Google Business Profile for the Chorley area is likely to matter at least as much as
anything on the site itself for local search visibility, and isn't something code can do.

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
