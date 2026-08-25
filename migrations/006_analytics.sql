-- ============================================================================
-- TradeIQ — anonymous traffic analytics
-- ============================================================================
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- WHY THIS EXISTS
--   Course links get shared, and there was no way to tell whether anyone opened
--   them. This records page views in your own database rather than sending
--   traffic to a third-party analytics service.
--
-- WHAT IS DELIBERATELY NOT STORED
--   No IP address. No user agent string. No user id, even for signed-in
--   learners — only a boolean saying whether the viewer was signed in. No
--   cookies and no persistent identifier: `session_id` is a random value held
--   in sessionStorage that dies when the tab closes, so the same person
--   returning tomorrow is not linkable to today.
--
--   That makes "unique visitors" really "browser sessions". It undercounts
--   nothing and overcounts returning visitors, which is the honest trade for
--   not tracking people across visits.
--
--   `referrer_host` is the HOST ONLY (e.g. "linkedin.com"), never the full URL,
--   because a full referrer can carry search terms and private path segments.
-- ============================================================================

create table if not exists public.page_views (
  id             bigint generated always as identity primary key,
  -- App route, e.g. "/course/uae-banking-fundamentals". Query strings and
  -- fragments are stripped client-side before insert.
  path           text not null,
  -- Set when the path is a course page, so course traffic can be grouped
  -- without parsing paths at read time.
  course_id      text,
  referrer_host  text,
  -- "mobile" | "tablet" | "desktop", derived from viewport width.
  device         text,
  is_authenticated boolean not null default false,
  -- Ephemeral, per-tab. Not a user identifier.
  session_id     text,
  created_at     timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_course_idx  on public.page_views (course_id) where course_id is not null;
create index if not exists page_views_path_idx    on public.page_views (path);

alter table public.page_views enable row level security;

-- Anyone may record a view, including guests — that is the whole point, since
-- most shared-link traffic is signed out.
--
-- The insert is deliberately unauthenticated, so the table is writable by
-- anyone who finds the endpoint. The length limits below bound what a spammer
-- can store per row; they cannot bound how many rows. If the table is ever
-- abused, revoke this policy and the site keeps working — analytics fails
-- silently by design.
drop policy if exists "page_views: anyone may record" on public.page_views;
create policy "page_views: anyone may record"
  on public.page_views for insert to anon, authenticated
  with check (
    length(path) between 1 and 512
    and (course_id is null or length(course_id) <= 128)
    and (referrer_host is null or length(referrer_host) <= 253)
    and (device is null or device in ('mobile', 'tablet', 'desktop'))
    and (session_id is null or length(session_id) <= 64)
  );

-- Reading is admin-only. Traffic data is a business metric, not public
-- information — without this, anyone could read the whole table.
drop policy if exists "page_views: admin read" on public.page_views;
create policy "page_views: admin read"
  on public.page_views for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "page_views: admin delete" on public.page_views;
create policy "page_views: admin delete"
  on public.page_views for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- Retention
-- ============================================================================
-- Nothing here identifies a person, but keeping raw rows forever has no upside
-- either. Run this occasionally, or schedule it with pg_cron if you enable the
-- extension:
--
--   delete from public.page_views where created_at < now() - interval '400 days';
-- ============================================================================
