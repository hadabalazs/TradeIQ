-- ============================================================================
-- TradeIQ — course content overrides (admin course editor)
-- ============================================================================
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- WHY THIS EXISTS
--   Same reason as question_overrides and course_overrides: the built-in
--   courses are compiled into the JS bundle and cannot be edited at runtime.
--   This table stores edits to the TEXT INSIDE a course — module titles and
--   overviews, topic titles, lesson markdown — so the admin course editor can
--   change any of it without a redeploy.
--
--   The three override tables cover different things and are deliberately
--   separate:
--     course_overrides    course-level display text (name, subtitle, certificate)
--     question_overrides  a question replaced or pulled from circulation
--     content_overrides   everything else inside the course body (this table)
--
-- PATH FORMAT
--   `path` identifies what is overridden, e.g.
--     module:m1:title        module:m1:subtitle
--     module:m1:overview     module:m1:objectives   (objectives is a JSON array)
--     topic:m1t1:title       topic:m1t1:lesson
--   Storing a path rather than a column per field means a new editable field
--   needs no migration — only the editor and the apply step change.
-- ============================================================================

create table if not exists public.content_overrides (
  course_id   text not null,
  path        text not null,
  value       jsonb not null,
  updated_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (course_id, path)
);

create index if not exists content_overrides_course_idx on public.content_overrides (course_id);

alter table public.content_overrides enable row level security;

-- World-readable: edited lesson text has to render for guests too.
drop policy if exists "content_overrides: read all" on public.content_overrides;
create policy "content_overrides: read all"
  on public.content_overrides for select to anon, authenticated
  using (true);

-- Only admins write. app_metadata.role is settable only from the Supabase
-- dashboard or SQL, so users cannot grant it to themselves.
drop policy if exists "content_overrides: admin write" on public.content_overrides;
create policy "content_overrides: admin write"
  on public.content_overrides for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.touch_content_overrides()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_overrides_touch on public.content_overrides;
create trigger content_overrides_touch
  before update on public.content_overrides
  for each row execute function public.touch_content_overrides();
