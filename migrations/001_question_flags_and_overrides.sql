-- ============================================================================
-- TradeIQ — question flagging + question overrides
-- ============================================================================
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Until it is run, the app hides the flagging UI and loads zero overrides, so
-- nothing breaks — the feature simply stays dormant.
--
-- WHAT THIS ADDS
--   question_flags     — learner reports that a question is wrong or confusing
--   question_overrides — admin corrections applied to courses at load time
--
-- WHY OVERRIDES EXIST
--   The two built-in courses (IFRS, Open Finance) are compiled into the JS
--   bundle and cannot be edited at runtime. Overrides are a thin layer applied
--   when courses load, so a correction takes effect for every user immediately
--   without a redeploy, and applies to custom courses the same way.
--
-- ON QUESTION IDs
--   Questions have no stored id. `questionId()` in src/lib/srs.js derives a
--   stable hash from the question text + correct answer. That hash is the id
--   used here. Because it is content-derived, EDITING A QUESTION CHANGES ITS
--   ID — which is exactly why an override records both the original id and the
--   replacement's new id, so SRS review history can be carried across the edit.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- question_flags
-- ---------------------------------------------------------------------------
create table if not exists public.question_flags (
  id             uuid primary key default gen_random_uuid(),
  question_id    text not null,
  course_id      text not null,
  module_id      text,
  topic_id       text,
  -- Snapshot of the question as the learner saw it. Kept verbatim so a flag
  -- stays reviewable even after the question is later edited or suppressed.
  question       jsonb not null,
  note           text,
  reason         text not null default 'other',
  status         text not null default 'open',
  user_id        uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  resolved_at    timestamptz,
  constraint question_flags_status_check
    check (status in ('open', 'suppressed', 'resolved', 'dismissed')),
  constraint question_flags_reason_check
    check (reason in ('incorrect', 'confusing', 'typo', 'outdated', 'other'))
);

create index if not exists question_flags_status_idx  on public.question_flags (status, created_at desc);
create index if not exists question_flags_question_idx on public.question_flags (question_id);
create index if not exists question_flags_course_idx   on public.question_flags (course_id);

alter table public.question_flags enable row level security;

-- Signed-in users may file a flag as themselves, and read back only their own.
-- They may not update or delete: a flag is a report, not a mutable record.
drop policy if exists "flags: insert own" on public.question_flags;
create policy "flags: insert own"
  on public.question_flags for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "flags: read own" on public.question_flags;
create policy "flags: read own"
  on public.question_flags for select to authenticated
  using (auth.uid() = user_id);

-- Admins (app_metadata.role = 'admin', settable only from the Supabase
-- dashboard or SQL — users cannot grant it to themselves) see and manage all.
drop policy if exists "flags: admin all" on public.question_flags;
create policy "flags: admin all"
  on public.question_flags for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- question_overrides
-- ---------------------------------------------------------------------------
-- One row per corrected question. `action` is either:
--   'suppress' — hide the question from every pool until reinstated
--   'replace'  — swap it for `replacement`
--
-- Reinstating deletes the row rather than adding a counter-row, so the table
-- always reads as "the current set of corrections" with no history to replay.
create table if not exists public.question_overrides (
  id                  uuid primary key default gen_random_uuid(),
  course_id           text not null,
  question_id         text not null,
  action              text not null,
  replacement         jsonb,
  -- Hash of `replacement`, so SRS can map the old card onto the new question
  -- and a learner's spacing survives a typo fix.
  replacement_id      text,
  module_id           text,
  topic_id            text,
  note                text,
  created_by          uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint question_overrides_action_check check (action in ('suppress', 'replace')),
  -- A replace must actually carry a replacement.
  constraint question_overrides_replacement_check
    check (action <> 'replace' or replacement is not null),
  -- One active override per question per course.
  constraint question_overrides_unique unique (course_id, question_id)
);

create index if not exists question_overrides_course_idx on public.question_overrides (course_id);

alter table public.question_overrides enable row level security;

-- Everyone reads overrides — they are course content, and must apply to guests
-- and signed-out users too, otherwise a suppressed question would still show.
drop policy if exists "overrides: read all" on public.question_overrides;
create policy "overrides: read all"
  on public.question_overrides for select to anon, authenticated
  using (true);

-- Only admins write them.
drop policy if exists "overrides: admin write" on public.question_overrides;
create policy "overrides: admin write"
  on public.question_overrides for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Keep updated_at honest.
create or replace function public.touch_question_overrides()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists question_overrides_touch on public.question_overrides;
create trigger question_overrides_touch
  before update on public.question_overrides
  for each row execute function public.touch_question_overrides();
