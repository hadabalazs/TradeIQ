-- ============================================================================
-- TradeIQ — course text overrides
-- ============================================================================
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run. Until it is run, the admin editor shows a "not installed"
-- note and courses render exactly as shipped.
--
-- WHY THIS EXISTS
--   Same reason as question_overrides: the built-in courses are compiled into
--   the JS bundle, so their display text cannot be edited at runtime. This is a
--   thin layer applied when the course registry is built, so renaming a course
--   takes effect everywhere — catalog, sidebar, dashboard, certificate — for
--   every user, with no redeploy.
--
-- FOUR SEPARATE FIELDS
--   title             — the course name in the app
--   subtitle          — the one-line subheader under it
--   certificate_title — the name printed on the certificate. Deliberately its
--                       own field: a certificate often wants the formal
--                       qualification name rather than the catalog name.
--                       NULL falls back to the course title.
--   certificate_text  — the blurb under the name on the certificate.
--
--   Any field left NULL falls back to the value shipped with the course, so an
--   override row can change one string without freezing the rest.
-- ============================================================================

create table if not exists public.course_overrides (
  course_id          text primary key,
  title              text,
  subtitle           text,
  certificate_title  text,
  certificate_text   text,
  updated_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.course_overrides enable row level security;

-- World-readable: a renamed course must read the same for guests and
-- signed-out visitors as it does for everyone else.
drop policy if exists "course_overrides: read all" on public.course_overrides;
create policy "course_overrides: read all"
  on public.course_overrides for select to anon, authenticated
  using (true);

-- Only admins write. app_metadata.role is settable only from the Supabase
-- dashboard or SQL, so users cannot grant it to themselves.
drop policy if exists "course_overrides: admin write" on public.course_overrides;
create policy "course_overrides: admin write"
  on public.course_overrides for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.touch_course_overrides()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists course_overrides_touch on public.course_overrides;
create trigger course_overrides_touch
  before update on public.course_overrides
  for each row execute function public.touch_course_overrides();
