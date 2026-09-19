-- ============================================================================
-- products
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(10, 2) not null,
  category text not null default 'New Arrivals',
  description text not null default '',
  sold_out boolean not null default false,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- TEMPORARY: there is no super-user auth flow yet, so product creation is
-- left open to anyone with the app's public (anon) key. Once auth is wired
-- up, replace this with a check against a super-user profile, e.g.:
--   with check (exists (
--     select 1 from public.profiles
--     where id = auth.uid() and is_super_user = true
--   ))
drop policy if exists "Anyone can add products (temporary, until admin auth exists)" on public.products;
create policy "Anyone can add products (temporary, until admin auth exists)"
  on public.products for insert
  with check (true);

-- ============================================================================
-- profiles (extends auth.users with app-specific fields, e.g. super-user flag)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_super_user boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- orders + order_items
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null
);

alter table public.order_items enable row level security;

drop policy if exists "Users can view items on their own orders" on public.order_items;
create policy "Users can view items on their own orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Users can add items to their own orders" on public.order_items;
create policy "Users can add items to their own orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- ============================================================================
-- storage bucket for product images
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- TEMPORARY: same caveat as the products insert policy above.
drop policy if exists "Anyone can upload product images (temporary, until admin auth exists)" on storage.objects;
create policy "Anyone can upload product images (temporary, until admin auth exists)"
  on storage.objects for insert
  with check (bucket_id = 'product-images');
