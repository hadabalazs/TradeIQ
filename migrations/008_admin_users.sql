-- ============================================================================
-- TradeIQ — admin user directory
-- ============================================================================
-- Paste the whole file into the Supabase SQL editor and run it once. Wrapped in
-- a transaction; safe to re-run.
--
-- WHY FUNCTIONS, NOT A POLICY
--   Accounts live in auth.users, which the browser cannot read and must never be
--   able to read — the publishable key ships in the JS bundle. The only safe way
--   to show accounts in the admin panel is a security-definer function that
--   checks the CALLER is an admin before returning anything. A non-admin, or a
--   signed-out visitor, gets an error and no rows.
--
-- WHAT AN ADMIN CAN SEE
--   Email, join date, last sign-in, whether the email is confirmed, admin role,
--   display name, XP, streak, per-course progress, and issued certificates.
--
-- WHAT IS DELIBERATELY NOT RETURNED
--   Private lesson notes and spaced-repetition cards. They sit in the same
--   user_progress row but are the learner's own working material, and nothing
--   about managing an account needs them.
--
-- TESTING FROM THE SQL EDITOR
--   Calling these here returns "admin only". That is expected: the editor runs
--   without a signed-in user, so there is no admin role on the request. Use the
--   admin panel to see results.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. The directory: one row per account, with learning stats.
-- ---------------------------------------------------------------------------
-- All progress fields are read defensively. Progress is JSON written by the
-- client, and one malformed row must not take down the whole admin list — so
-- numbers are pattern-checked before casting and types are checked before
-- walking arrays or objects.
create or replace function public.admin_list_users()
returns table (
  user_id            uuid,
  email              text,
  created_at         timestamptz,
  last_sign_in_at    timestamptz,
  email_confirmed    boolean,
  is_admin           boolean,
  display_name       text,
  total_xp           integer,
  streak_count       integer,
  last_active_date   text,
  courses_started    integer,
  lessons_completed  integer,
  certified_courses  integer,
  certificates       integer,
  progress_synced_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
#variable_conflict use_column
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'admin only' using errcode = '42501';
  end if;

  return query
  with base as (
    select
      u.id                      as uid,
      u.email::text             as mail,
      u.created_at              as joined_at,
      u.last_sign_in_at         as signed_in_at,
      u.email_confirmed_at      as confirmed_at,
      u.raw_app_meta_data       as app_meta,
      p.progress::jsonb         as prog,
      p.updated_at::timestamptz as synced_at
    from auth.users u
    left join public.user_progress p on p.user_id = u.id
  ),
  cc as (
    select
      b.uid,
      case when jsonb_typeof(b.prog -> 'courses') = 'object'
           then b.prog -> 'courses' else '{}'::jsonb end as courses_obj
    from base b
  )
  select
    b.uid,
    b.mail,
    b.joined_at,
    b.signed_in_at,
    b.confirmed_at is not null,
    coalesce(b.app_meta ->> 'role', '') = 'admin',
    nullif(b.prog ->> 'user_name', ''),
    case when (b.prog ->> 'total_xp') ~ '^-?[0-9]+(\.[0-9]+)?$'
         then round((b.prog ->> 'total_xp')::numeric)::integer else 0 end,
    case when (b.prog ->> 'streak_count') ~ '^-?[0-9]+(\.[0-9]+)?$'
         then round((b.prog ->> 'streak_count')::numeric)::integer else 0 end,
    nullif(b.prog ->> 'last_active_date', ''),
    -- "Started" matches the app's own rule: enrolled, certified, or any lesson
    -- or quiz activity. Every course has an empty entry by default, so counting
    -- entries alone would report every learner as taking every course.
    (select count(*)::integer
       from jsonb_each(c.courses_obj) as cp(k, v)
      where jsonb_typeof(cp.v) = 'object'
        and (   (cp.v ->> 'enrolled')  = 'true'
             or (cp.v ->> 'certified') = 'true'
             or (jsonb_typeof(cp.v -> 'completed_topics') = 'array'
                 and jsonb_array_length(cp.v -> 'completed_topics') > 0)
             or (jsonb_typeof(cp.v -> 'quiz_scores') = 'object'
                 and cp.v -> 'quiz_scores' <> '{}'::jsonb))),
    (select coalesce(sum(jsonb_array_length(cp.v -> 'completed_topics')), 0)::integer
       from jsonb_each(c.courses_obj) as cp(k, v)
      where jsonb_typeof(cp.v -> 'completed_topics') = 'array'),
    (select count(*)::integer
       from jsonb_each(c.courses_obj) as cp(k, v)
      where (cp.v ->> 'certified') = 'true'),
    (select count(*)::integer
       from public.certificates ct
      where ct.user_id = b.uid),
    b.synced_at
  from base b
  join cc c on c.uid = b.uid
  order by b.joined_at desc;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. One account in detail: full course progress and certificates.
-- ---------------------------------------------------------------------------
-- Returns null for an id that does not exist.
create or replace function public.admin_get_user(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_result jsonb;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'admin only' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'user_id',            u.id,
    'email',              u.email,
    'created_at',         u.created_at,
    'last_sign_in_at',    u.last_sign_in_at,
    'email_confirmed',    u.email_confirmed_at is not null,
    'is_admin',           coalesce(u.raw_app_meta_data ->> 'role', '') = 'admin',
    -- The progress document only. Notes and review cards are separate columns
    -- and are intentionally left out.
    'progress',           coalesce(p.progress::jsonb, '{}'::jsonb),
    'progress_synced_at', p.updated_at,
    'certificates',       coalesce((
        select jsonb_agg(jsonb_build_object(
                 'cert_id',      ct.cert_id,
                 'course_id',    ct.course_id,
                 'course_title', ct.course_title,
                 'score',        ct.score,
                 'issued_at',    ct.issued_at
               ) order by ct.issued_at desc)
        from public.certificates ct
        where ct.user_id = u.id
      ), '[]'::jsonb)
  )
  into v_result
  from auth.users u
  left join public.user_progress p on p.user_id = u.id
  where u.id = p_user_id;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Who may call them.
-- ---------------------------------------------------------------------------
-- Supabase grants EXECUTE on new public functions to anon by default, so anon
-- is revoked explicitly rather than relying on the PUBLIC revoke. The admin
-- check inside each function is the real guard either way; this just means a
-- signed-out request is refused before the function body runs at all.
revoke all on function public.admin_list_users()     from public, anon;
revoke all on function public.admin_get_user(uuid)   from public, anon;
grant execute on function public.admin_list_users()   to authenticated;
grant execute on function public.admin_get_user(uuid) to authenticated;

commit;

-- ============================================================================
-- Verification. Expect: functions = 2, anon_can_list = false,
-- anon_can_read = false, signed_in_can_call = true.
-- ============================================================================
select
  (select count(*) from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('admin_list_users', 'admin_get_user'))                as functions,
  has_function_privilege('anon', 'public.admin_list_users()', 'execute')      as anon_can_list,
  has_function_privilege('anon', 'public.admin_get_user(uuid)', 'execute')    as anon_can_read,
  has_function_privilege('authenticated', 'public.admin_list_users()', 'execute') as signed_in_can_call;
