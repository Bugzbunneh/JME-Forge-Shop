-- Tables created via SQL migrations (rather than the Table Editor UI) don't
-- automatically get table-level privileges for the anon/authenticated roles.
-- Row Level Security policies remain the real gatekeeper for what each role
-- can actually read/write row-by-row; these grants just allow the roles to
-- reach the table at all.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.products to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.orders to anon, authenticated;
grant select, insert, update, delete on public.order_items to anon, authenticated;
