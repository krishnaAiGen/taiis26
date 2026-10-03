-- Field format and length constraints.
--
-- These mirror src/lib/validation.ts, and they — not the form — are the actual
-- guarantee. RLS grants anon INSERT, so anyone holding the publishable key can
-- POST straight to PostgREST and bypass the browser entirely. Validation that
-- exists only in the form is decoration.
--
-- Character classes are Unicode-aware: [[:alpha:]] under a UTF-8 server matches
-- 李雷, José and Müller as readily as ASCII. Restricting names to A-Z would
-- reject a large share of an international conference's registrants.
--
-- Added NOT VALID: existing rows (test data, early registrations entered before
-- these rules) are left alone, while every new or updated row is checked. See
-- the end of this file for how to find and then validate legacy rows.
--
-- Safe to re-run.

do $$
declare
  t text;
  -- Letters, combining marks, spaces, apostrophes (straight and typographic),
  -- periods and hyphens. The hyphen is last so it is a literal, not a range.
  name_chars constant text := '^[[:alpha:][:space:]''’.-]+$';
  -- Citizenship additionally allows separators, for dual citizenship.
  citizenship_chars constant text := '^[[:alpha:][:space:]''’.,/-]+$';
  -- E.164: "+", a country code starting 1-9, 7 to 15 digits in total.
  e164 constant text := '^\+[1-9][0-9]{6,14}$';
begin
  foreach t in array array['dev_taiis', 'prod_taiis'] loop

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_first_name_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(first_name) between 1 and 80
         and first_name ~ %L and first_name ~ ''[[:alpha:]]''
       ) not valid', t, t || '_first_name_valid', name_chars);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_last_name_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(last_name) between 1 and 80
         and last_name ~ %L and last_name ~ ''[[:alpha:]]''
       ) not valid', t, t || '_last_name_valid', name_chars);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_phone_valid');
    execute format(
      'alter table public.%I add constraint %I check (mobile_phone ~ %L) not valid',
      t, t || '_phone_valid', e164);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_email_length');
    execute format(
      'alter table public.%I add constraint %I check (char_length(email) <= 254) not valid',
      t, t || '_email_length');

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_organization_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(organization) between 2 and 120
       ) not valid', t, t || '_organization_valid');

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_citizenship_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(citizenship) between 2 and 100
         and citizenship ~ %L and citizenship ~ ''[[:alpha:]]''
       ) not valid', t, t || '_citizenship_valid', citizenship_chars);

    -- Nullable: attendee categories carry no paper.
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_paper_id_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         paper_id is null or paper_id ~ ''^[0-9]{1,10}$''
       ) not valid', t, t || '_paper_id_valid');

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_paper_title_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         paper_title is null or char_length(paper_title) between 3 and 300
       ) not valid', t, t || '_paper_title_valid');

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_dietary_length');
    execute format(
      'alter table public.%I add constraint %I check (
         dietary_comments is null or char_length(dietary_comments) <= 500
       ) not valid', t, t || '_dietary_length');

  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Legacy rows
-- ---------------------------------------------------------------------------
-- Find rows that would fail the new rules (test data usually shows up here):
--
--   select id, first_name, last_name, mobile_phone, organization
--   from public.prod_taiis
--   where mobile_phone !~ '^\+[1-9][0-9]{6,14}$'
--      or first_name !~ '^[[:alpha:][:space:]''’.-]+$'
--      or last_name  !~ '^[[:alpha:][:space:]''’.-]+$';
--
-- After cleaning them up, promote the constraints so the guarantee covers the
-- whole table:
--
--   alter table public.prod_taiis validate constraint prod_taiis_phone_valid;
--   alter table public.prod_taiis validate constraint prod_taiis_first_name_valid;
--   ... and so on for each constraint above.
