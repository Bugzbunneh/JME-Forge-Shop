-- The stripe-webhook edge function uses the service_role key to bypass RLS
-- when recording orders after a successful payment. RLS bypass only skips
-- policies — it does not skip ordinary table-level GRANTs, and service_role
-- was never explicitly granted any (same class of bug fixed for
-- anon/authenticated in grant_table_privileges).

grant select, insert, update, delete on public.products to service_role;
grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.orders to service_role;
grant select, insert, update, delete on public.order_items to service_role;
