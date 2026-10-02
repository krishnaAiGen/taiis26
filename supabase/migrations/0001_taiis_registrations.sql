-- TAIIS 2026 conference registrations.
--
-- Creates two structurally identical tables:
--   dev_taiis   -- used by `npm run dev`   (VITE_REGISTRATION_TABLE in .env.local)
--   prod_taiis  -- used by `npm run build` (VITE_REGISTRATION_TABLE in .env.production)
--
-- Run this whole file once in the Supabase dashboard -> SQL Editor.
-- Safe to re-run: every statement is guarded.

-- ---------------------------------------------------------------------------
-- 1. Development table (the canonical shape)
-- ---------------------------------------------------------------------------
create table if not exists public.dev_taiis (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Participation
  registration_category text not null,
  attendance_mode text not null,

  -- Contact information
  first_name text not null,
  last_name text not null,
  email text not null,
  mobile_phone text not null,
  organization text not null,
  country text not null,
  citizenship text not null,

  -- Paper details (only required for author / presenter categories)
  paper_id text,
  paper_title text,

  -- Attendance confirmation
  attending_dinner boolean not null default false,
  dietary_requirement text,
  dietary_comments text,

  -- Consent
  consent_photos boolean not null default false,
  consent_future_invite boolean not null default false,
  consent_related_events boolean not null default false,
  -- No default: the check below requires an explicit true, so a row that
  -- forgets to send it is rejected rather than silently defaulted.
  consent_terms boolean not null,

  -- Payment.
  --
  -- The browser may only ever create a row, and the check below pins any
  -- anon-created row to 'pending'. Promoting a row to 'paid' is done by the
  -- payment webhook using the service_role key, which bypasses RLS. There is
  -- deliberately no UPDATE policy for anon, so a registrant cannot mark their
  -- own registration as paid.
  payment_status text not null default 'pending',
  payment_reference text,
  payment_amount numeric(10, 2),
  payment_currency text,
  paid_at timestamptz,

  constraint dev_taiis_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint dev_taiis_terms_accepted check (consent_terms is true),
  constraint dev_taiis_payment_status check (
    payment_status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')
  ),
  constraint dev_taiis_currency check (
    payment_currency is null or payment_currency in ('USD', 'TWD')
  )
);

-- ---------------------------------------------------------------------------
-- 2. Production table — cloned so the two schemas cannot drift apart.
--    INCLUDING ALL copies columns, defaults, NOT NULLs, CHECKs and indexes.
-- ---------------------------------------------------------------------------
create table if not exists public.prod_taiis (like public.dev_taiis including all);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security.
--
--    This is a static site, so the publishable key ships inside the browser
--    bundle and must be treated as public. RLS is therefore the only thing
--    protecting the data: anonymous visitors may INSERT their own registration
--    and nothing else. No SELECT policy exists, so nobody can read the table
--    with the publishable key -- not even the rows they just wrote.
--
--    Read registrations through the dashboard or a server-side service_role
--    key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.dev_taiis enable row level security;
alter table public.prod_taiis enable row level security;

-- The WITH CHECK clause pins browser-created rows to an unpaid state. Without
-- it, anyone could POST a row with payment_status 'paid' and register free.
drop policy if exists "anon can submit registration" on public.dev_taiis;
create policy "anon can submit registration"
  on public.dev_taiis for insert to anon
  with check (payment_status = 'pending' and paid_at is null);

drop policy if exists "anon can submit registration" on public.prod_taiis;
create policy "anon can submit registration"
  on public.prod_taiis for insert to anon
  with check (payment_status = 'pending' and paid_at is null);

-- ---------------------------------------------------------------------------
-- 4. Indexes for the organisers' own reporting queries.
-- ---------------------------------------------------------------------------
create index if not exists dev_taiis_created_at_idx on public.dev_taiis (created_at desc);
create index if not exists dev_taiis_email_idx on public.dev_taiis (email);
create index if not exists prod_taiis_created_at_idx on public.prod_taiis (created_at desc);
create index if not exists prod_taiis_email_idx on public.prod_taiis (email);
