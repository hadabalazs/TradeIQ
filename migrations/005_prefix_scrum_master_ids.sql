-- 005 — Namespace the module and topic ids of the-ai-augmented-scrum-master.
--
-- That course uses bare ids ("m1", "m1t1"), which are the same ids the built-in
-- IFRS curriculum uses. Nothing is corrupted today, because every store keys by
-- course id as well, but each collision is a latent bug for anything that later
-- keys by topic id alone — and it blocks adding any further course that uses the
-- same convention. Uploads are namespaced automatically now; this fixes the one
-- course that predates that.
--
-- Safe to run more than once: every rewrite skips values that already carry the
-- prefix.
--
-- Run the two statements together, in this order.

-- 1. Rename the ids inside the course itself.
with renamed as (
  select
    c.id as row_id,
    jsonb_set(
      c.course_data::jsonb,
      '{modules}',
      (
        select jsonb_agg(
                 m.value || jsonb_build_object(
                   'id',
                   case when m.value->>'id' like 'taasm\_%'
                        then m.value->>'id'
                        else 'taasm_' || (m.value->>'id') end,
                   'topics',
                   (
                     select coalesce(
                       jsonb_agg(
                         t.value || jsonb_build_object(
                           'id',
                           case when t.value->>'id' like 'taasm\_%'
                                then t.value->>'id'
                                else 'taasm_' || (t.value->>'id') end
                         )
                         order by t.ordinality
                       ), '[]'::jsonb)
                     from jsonb_array_elements(m.value->'topics')
                          with ordinality as t(value, ordinality)
                   )
                 )
                 order by m.ordinality
               )
        from jsonb_array_elements(c.course_data::jsonb->'modules')
             with ordinality as m(value, ordinality)
      )
    ) as new_data
  from courses c
  where c.course_id = 'the-ai-augmented-scrum-master'
)
update courses c
set course_data = r.new_data
from renamed r
where c.id = r.row_id;

-- 2. Move existing learner progress onto the new ids.
--
-- completed_topics and quiz_completed_topics hold topic ids. quiz_scores and
-- passed_first_time hold topic ids AND module-quiz ids of the form
-- "module_<moduleId>", so those keep the "module_" prefix and gain the namespace
-- after it.
update user_progress up
set progress = jsonb_set(
      up.progress::jsonb,
      '{courses,the-ai-augmented-scrum-master}',
      v.new_cp
    )
from lateral (
  select
    (up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master}')
    || jsonb_build_object(
         'completed_topics', (
           select coalesce(jsonb_agg(
             case when e like 'taasm\_%' then e else 'taasm_' || e end), '[]'::jsonb)
           from jsonb_array_elements_text(coalesce(
             up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master,completed_topics}',
             '[]'::jsonb)) e
         ),
         'quiz_completed_topics', (
           select coalesce(jsonb_agg(
             case when e like 'taasm\_%' then e else 'taasm_' || e end), '[]'::jsonb)
           from jsonb_array_elements_text(coalesce(
             up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master,quiz_completed_topics}',
             '[]'::jsonb)) e
         ),
         'passed_first_time', (
           select coalesce(jsonb_agg(
             case
               when e like 'module\_taasm\_%' or e like 'taasm\_%' then e
               when e like 'module\_%' then 'module_taasm_' || substring(e from 8)
               else 'taasm_' || e
             end), '[]'::jsonb)
           from jsonb_array_elements_text(coalesce(
             up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master,passed_first_time}',
             '[]'::jsonb)) e
         ),
         'quiz_scores', (
           select coalesce(jsonb_object_agg(
             case
               when kv.key like 'module\_taasm\_%' or kv.key like 'taasm\_%' then kv.key
               when kv.key like 'module\_%' then 'module_taasm_' || substring(kv.key from 8)
               else 'taasm_' || kv.key
             end, kv.value), '{}'::jsonb)
           from jsonb_each(coalesce(
             up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master,quiz_scores}',
             '{}'::jsonb)) kv
         )
       ) as new_cp
) v
where up.progress::jsonb #> '{courses,the-ai-augmented-scrum-master}' is not null;
