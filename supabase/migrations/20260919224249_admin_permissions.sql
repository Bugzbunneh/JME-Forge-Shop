-- Super-user auth now exists, so lock the temporary "anyone with the anon
-- key" write policies down to real super users, and let super users read
-- every order (customers still only see their own via the existing policy).

drop policy if exists "Anyone can add products (temporary, until admin auth exists)" on public.products;
create policy "Super users can insert products"
  on public.products for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true)
  );

drop policy if exists "Super users can update products" on public.products;
create policy "Super users can update products"
  on public.products for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true));

drop policy if exists "Super users can delete products" on public.products;
create policy "Super users can delete products"
  on public.products for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true));

drop policy if exists "Anyone can upload product images (temporary, until admin auth exists)" on storage.objects;
create policy "Super users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true)
  );

drop policy if exists "Super users can view all orders" on public.orders;
create policy "Super users can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true)
  );

drop policy if exists "Super users can view all order items" on public.order_items;
create policy "Super users can view all order items"
  on public.order_items for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_super_user = true)
  );
