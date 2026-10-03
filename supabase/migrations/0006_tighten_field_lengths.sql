-- Tighter length limits, replacing the ones set in 0005.
--
--   first_name / last_name  80 -> 25
--   organization           120 -> 50
--   citizenship            100 -> 25
--
-- Mirrors LIMITS in src/lib/validation.ts. The character rules are unchanged:
-- still Unicode-aware, so 李雷, José and O'Brien remain valid.
--
-- Added NOT VALID, so rows stored under the previous limits are left as they
-- are while new and updated rows must satisfy the tighter bounds.
--
-- Safe to re-run.

do $$
declare
  t text;
  name_chars constant text := '^[[:alpha:][:space:]''’.-]+$';
  citizenship_chars constant text := '^[[:alpha:][:space:]''’.,/-]+$';
begin
  foreach t in array array['dev_taiis', 'prod_taiis'] loop

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_first_name_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(first_name) between 1 and 25
         and first_name ~ %L and first_name ~ ''[[:alpha:]]''
       ) not valid', t, t || '_first_name_valid', name_chars);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_last_name_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(last_name) between 1 and 25
         and last_name ~ %L and last_name ~ ''[[:alpha:]]''
       ) not valid', t, t || '_last_name_valid', name_chars);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_organization_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(organization) between 2 and 50
       ) not valid', t, t || '_organization_valid');

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_citizenship_valid');
    execute format(
      'alter table public.%I add constraint %I check (
         char_length(citizenship) between 2 and 25
         and citizenship ~ %L and citizenship ~ ''[[:alpha:]]''
       ) not valid', t, t || '_citizenship_valid', citizenship_chars);

  end loop;
end $$;

-- Rows exceeding the new limits (if any) can be found with:
--
--   select id, first_name, last_name, organization, citizenship
--   from public.prod_taiis
--   where char_length(first_name) > 25
--      or char_length(last_name) > 25
--      or char_length(organization) > 50
--      or char_length(citizenship) > 25;
