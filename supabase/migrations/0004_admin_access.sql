-- Admin read access to registrations.
--
-- Credentials are NOT stored here. Supabase Auth owns them: passwords are
-- hashed and sessions issued by the auth service, and no table in this schema
-- ever sees a password. This migration only records WHICH auth users are
-- admins, and opens read access to them.
--
-- Hiding the /admin route is not a security boundary -- anyone can request it.
-- These policies are. Without a session belonging to a row in admin_users, the
-- registration tables return nothing, exactly as they do for anonymous callers.
--
-- Safe to re-run.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- Admin check.
--
-- SECURITY DEFINER matters: a policy on admin_users that queries admin_users
-- recurses infinitely. Running the lookup as the function owner bypasses RLS
-- and breaks that cycle. search_path is pinned so the function cannot be
-- redirected at a shadowed table.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- An admin may see the admin list; nobody else can enumerate it.
drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list"
  on public.admin_users for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Registration read access.
--
-- SELECT only. Admins review registrations through this panel; changing a
-- payment status is still the webhook's job, so no UPDATE or DELETE policy is
-- granted and the panel cannot alter the ledger.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['dev_taiis', 'prod_taiis'] loop
    execute format('drop policy if exists "admins read registrations" on public.%I', t);
    execute format(
      'create policy "admins read registrations" on public.%I
         for select to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Granting someone admin access
-- ---------------------------------------------------------------------------
-- 1. Dashboard -> Authentication -> Users -> Add user (email + password).
--    Tick "Auto Confirm User" so they can sign in immediately.
-- 2. Run, with their address:
--
--      insert into public.admin_users (user_id, email)
--      select id, email from auth.users where email = 'you@example.com'
--      on conflict (user_id) do nothing;
--
-- 3. Revoke by deleting the row; the auth user can stay:
--
--      delete from public.admin_users where email = 'someone@example.com';
--
-- Also turn OFF Dashboard -> Authentication -> Sign In / Providers -> Email ->
-- "Allow new users to sign up". Nothing in this project needs public signup,
-- and leaving it on lets strangers create accounts (they still would not be
-- admins, but there is no reason to allow it).
