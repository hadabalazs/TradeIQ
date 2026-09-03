-- ============================================================================
-- TradeIQ — certificate integrity
-- ============================================================================
-- Paste the whole file into the Supabase SQL editor and run it once. It is
-- wrapped in a transaction, so it either all applies or none of it does. Safe
-- to re-run.
--
-- RUN THIS BEFORE DEPLOYING THE MATCHING CODE. It removes the policies the
-- currently-live client depends on and replaces them with functions the new
-- client calls.
--
-- ============================================================================
-- WHAT WAS WRONG
-- ============================================================================
--
-- 1. THE TABLE WAS WORLD-READABLE.
--    `certificates: public verify` granted SELECT with `using (true)`. The
--    intent was "an employer can check one id", but a policy cannot express
--    that: PostgREST accepts a query with no filter, so anyone holding the
--    publishable key — which ships in the JS bundle — could read every row.
--    That is every learner's name, score, course and user id in one request.
--    Confirmed against production before writing this.
--
--    The original comment claimed the table could not be walked because ids are
--    unguessable. That reasoning is wrong: `select *` never needs to guess an
--    id.
--
-- 2. ANY SIGNED-IN USER COULD ISSUE THEMSELVES A CERTIFICATE.
--    `certificates: issue own` checked only `auth.uid() = user_id`, and the
--    client supplied course, score and id. So any free account could POST a
--    100% pass for any course without opening a lesson, and /verify would then
--    display it as genuine — defeating the point of having verification.
--
-- ============================================================================
-- HOW IT IS FIXED
-- ============================================================================
--
-- Both reads and writes now go through security-definer functions, which are
-- the only way to express "one row by id" and "only if actually earned".
--
--   verify_certificate(id)  returns AT MOST ONE row, matched by exact id, and
--                           only the fields printed on the certificate. There
--                           is no way to ask it for "all certificates".
--
--   issue_certificate(...)  derives the score from the caller's OWN stored
--                           progress and refuses unless that progress says the
--                           course is certified. The caller cannot pass a score
--                           or choose the id.
--
-- Direct SELECT is reduced to the learner's own rows, which is what the
-- certificate screen needs to show an existing id. Admins keep full access.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Remove the over-permissive policies.
-- ---------------------------------------------------------------------------
drop policy if exists "certificates: public verify" on public.certificates;
drop policy if exists "certificates: issue own"     on public.certificates;
drop policy if exists "certificates: update own"    on public.certificates;

-- The certificate screen reads back the learner's own issued id. Scoped to the
-- caller's own rows, so it cannot be used to read anyone else's.
drop policy if exists "certificates: read own" on public.certificates;
create policy "certificates: read own"
  on public.certificates for select to authenticated
  using (auth.uid() = user_id);

-- `certificates: admin manage` is left in place so an admin can still revoke.

-- ---------------------------------------------------------------------------
-- 2. Public verification, one id at a time.
-- ---------------------------------------------------------------------------
-- security definer so it can read past RLS, but it only ever returns the row
-- whose id was supplied, and only the fields already printed on the
-- certificate. search_path is pinned so the function body cannot be redirected
-- by a caller-controlled search_path.
create or replace function public.verify_certificate(p_cert_id text)
returns table (
  cert_id      text,
  course_title text,
  learner_name text,
  score        integer,
  issued_at    timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select c.cert_id, c.course_title, c.learner_name, c.score, c.issued_at
  from public.certificates c
  where c.cert_id = p_cert_id
  limit 1;
$$;

revoke execute on function public.verify_certificate(text) from public;
grant  execute on function public.verify_certificate(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Issuance, earned only.
-- ---------------------------------------------------------------------------
-- The caller supplies the course and the name to print. Everything that decides
-- WHETHER a certificate exists, and what score it carries, is read from the
-- caller's own user_progress row rather than from the request.
create or replace function public.issue_certificate(
  p_course_id    text,
  p_course_title text,
  p_learner_name text
)
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id    uuid := auth.uid();
  v_course     jsonb;
  v_certified  boolean;
  v_score      integer;
  v_cert_id    text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  if p_course_id is null or length(p_course_id) = 0 or length(p_course_id) > 128 then
    raise exception 'invalid course id' using errcode = '22023';
  end if;

  select up.progress::jsonb #> array['courses', p_course_id]
    into v_course
  from public.user_progress up
  where up.user_id = v_user_id;

  if v_course is null then
    raise exception 'no progress recorded for this course' using errcode = '42501';
  end if;

  v_certified := coalesce((v_course ->> 'certified')::boolean, false);
  if not v_certified then
    raise exception 'course is not certified for this user' using errcode = '42501';
  end if;

  -- Score comes from stored progress, never from the caller.
  v_score := greatest(0, least(100, coalesce((v_course ->> 'final_assessment_score')::numeric, 0)::integer));

  -- Re-passing keeps the original id so links already shared stay valid.
  select c.cert_id into v_cert_id
  from public.certificates c
  where c.user_id = v_user_id and c.course_id = p_course_id;

  if v_cert_id is null then
    -- Generated here, so a caller cannot choose or predict their own id.
    v_cert_id := 'TIQ-' || upper(substring(replace(gen_random_uuid()::text, '-', '') for 16));
  end if;

  insert into public.certificates
    (cert_id, user_id, course_id, course_title, learner_name, score, issued_at)
  values (
    v_cert_id,
    v_user_id,
    p_course_id,
    coalesce(nullif(left(p_course_title, 200), ''), p_course_id),
    coalesce(nullif(left(p_learner_name, 120), ''), 'Learner'),
    v_score,
    now()
  )
  on conflict (user_id, course_id) do update
    set score        = excluded.score,
        course_title = excluded.course_title,
        learner_name = excluded.learner_name,
        issued_at    = excluded.issued_at;

  return v_cert_id;
end;
$$;

revoke execute on function public.issue_certificate(text, text, text) from public;
grant  execute on function public.issue_certificate(text, text, text) to authenticated;

commit;

-- ============================================================================
-- Verification. Expect:
--   policies      : 2  (certificates: admin manage, certificates: read own)
--   public_select : 0  (no policy granting SELECT to anon)
--   functions     : 2
-- ============================================================================
select
  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'certificates') as policies,
  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'certificates'
      and cmd = 'SELECT' and 'anon' = any(roles))               as public_select,
  (select count(*) from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('verify_certificate', 'issue_certificate')) as functions;
