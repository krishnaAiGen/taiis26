-- Registrants now choose their billing currency, and each currency is collected
-- by a different provider:
--
--   USD -> PayPal
--   TWD -> a Taiwanese provider (ECPay / NewebPay / bank transfer)
--
-- PayPal cannot be used for TWD here: the merchant account is registered in
-- Taiwan, and PayPal blocks payments between two Taiwan-registered accounts.
--
-- Safe to re-run.

alter table public.dev_taiis
  add column if not exists payment_method text not null default 'paypal';
alter table public.prod_taiis
  add column if not exists payment_method text not null default 'paypal';

-- 'ntd' stays provider-agnostic on purpose: whichever Taiwanese gateway is
-- chosen, the row is still "collected in NT$" and payment_reference holds that
-- provider's transaction id.
do $$
declare
  t text;
begin
  foreach t in array array['dev_taiis', 'prod_taiis'] loop
    execute format(
      'alter table public.%I drop constraint if exists %I', t, t || '_payment_method');
    execute format(
      'alter table public.%I add constraint %I check (payment_method in (''paypal'', ''ntd''))',
      t, t || '_payment_method');

    -- A USD row must not be routed to the NT$ provider, and vice versa.
    execute format(
      'alter table public.%I drop constraint if exists %I', t, t || '_method_currency');
    execute format(
      'alter table public.%I add constraint %I check (
         payment_currency is null
         or (payment_method = ''paypal'' and payment_currency = ''USD'')
         or (payment_method = ''ntd''    and payment_currency = ''TWD'')
       )', t, t || '_method_currency');
  end loop;
end $$;

create index if not exists dev_taiis_payment_method_idx
  on public.dev_taiis (payment_method, payment_status);
create index if not exists prod_taiis_payment_method_idx
  on public.prod_taiis (payment_method, payment_status);
