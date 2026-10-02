-- Payment integrity hardening.
--
-- Two problems are closed here.
--
-- 1. The anon INSERT policy pinned only payment_status and paid_at, which left
--    every other column writable from a browser -- including payment_reference.
--    Pre-setting that to the id of an order that had already been captured made
--    confirm-paypal-payment report ORDER_ALREADY_CAPTURED, which it treated as
--    success without verifying anything. One real payment could therefore be
--    replayed into unlimited paid registrations. The policy below pins every
--    payment column a browser has no business setting.
--
-- 2. payment_reference used to be overwritten with the PayPal *capture* id once
--    money moved, destroying the only link back to the order and making the
--    order unverifiable afterwards. The capture id now has its own column, and
--    payment_reference always holds the order id.
--
-- Run this whole file in the Supabase dashboard -> SQL Editor.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- 1. Separate the capture id from the order id.
--
--    payment_reference    -- the PayPal order id, written at order creation
--    payment_capture_id   -- the PayPal transaction id, written once captured
-- ---------------------------------------------------------------------------
alter table public.dev_taiis  add column if not exists payment_capture_id text;
alter table public.prod_taiis add column if not exists payment_capture_id text;

-- ---------------------------------------------------------------------------
-- 2. Replace the anon INSERT policy.
--
--    A browser may submit the registrant's own answers and nothing about
--    payment. Every column that decides whether money arrived is written by the
--    Edge Functions using the service_role key, which bypasses RLS. There is
--    still deliberately no UPDATE, SELECT or DELETE policy for anon.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['dev_taiis', 'prod_taiis'] loop
    execute format(
      'drop policy if exists "anon can submit registration" on public.%I', t);
    execute format(
      'create policy "anon can submit registration"
         on public.%I for insert to anon
         with check (
           payment_status = ''pending''
           and paid_at is null
           and payment_reference is null
           and payment_capture_id is null
         )', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Reconciliation lookups by PayPal id.
-- ---------------------------------------------------------------------------
create index if not exists dev_taiis_payment_reference_idx
  on public.dev_taiis (payment_reference);
create index if not exists prod_taiis_payment_reference_idx
  on public.prod_taiis (payment_reference);
