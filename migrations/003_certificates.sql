-- ============================================================================
-- TradeIQ — issued certificates (verification)
-- ============================================================================
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- WHY THIS EXISTS — SECURITY FIX
--   /verify/:certId previously rendered "Certificate Verified — this is a valid
--   certificate issued by TradeIQ Academy" for ANY string, because it checked
--   nothing at all. Anyone could invent an id and produce a page asserting a
--   credential they had not earned. For a certification product that defeats the
--   entire purpose of having a verification URL.
--
--   Certificate ids were also a 32-bit hash of name + score + date, which is
--   both guessable and collision-prone. Issued ids are now random tokens
--   generated client-side with crypto.randomUUID(), so the id cannot be
--   enumerated or derived from a learner's details.
--
-- WHAT IS PUBLIC
--   Verification has to work for someone who is not logged in — an employer
--   checking a candidate. So SELECT is public, and a valid id reveals the
--   learner name, course and score printed on the certificate itself. That is
--   the intended disclosure: the holder chooses who to give the id to. Nothing
--   else about the user is exposed, and ids are unguessable, so the table cannot
--   be walked to enumerate learners.
-- ============================================================================

create table if not exists public.certificates (
  cert_id       text primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  course_id     text not null,
  course_title  text not null,
  learner_name  text not null,
  score         integer not null,
  issued_at     timestamptz not null default now(),
  constraint certificates_score_range check (score >= 0 and score <= 100),
  -- One certificate per learner per course; re-passing updates the score.
  constraint certificates_user_course unique (user_id, course_id)
);

create index if not exists certificates_user_idx on public.certificates (user_id);

alter table public.certificates enable row level security;

-- Public verification. Rows are only reachable by exact cert_id in practice,
-- since the id is a random token.
drop policy if exists "certificates: public verify" on public.certificates;
create policy "certificates: public verify"
  on public.certificates for select to anon, authenticated
  using (true);

-- A learner may issue and update only their own certificate. They cannot forge
-- one for another account: user_id is pinned to their own auth.uid().
drop policy if exists "certificates: issue own" on public.certificates;
create policy "certificates: issue own"
  on public.certificates for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "certificates: update own" on public.certificates;
create policy "certificates: update own"
  on public.certificates for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can revoke.
drop policy if exists "certificates: admin manage" on public.certificates;
create policy "certificates: admin manage"
  on public.certificates for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
