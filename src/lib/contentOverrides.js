// Admin edits to the text inside a course — module titles and overviews, topic
// titles, lesson markdown — layered on at course-registry build time.
//
// Same reasoning as questionOverrides.js and courseOverrides.js: the built-in
// courses are compiled into the JS bundle, so their body text cannot be edited
// at runtime. Applying the layer where COURSES is assembled means an edited
// lesson shows up everywhere that lesson is read, with no per-surface wiring.
//
// Overrides are keyed by a PATH rather than a column per field:
//   module:<moduleId>:title | subtitle | overview | objectives
//   topic:<topicId>:title | lesson
// Adding a newly editable field then needs no migration — only this file and
// the editor change.

import { supabase } from '@/lib/supabaseClient';

let _index = new Map();

export function indexContentOverrides(rows = []) {
  const map = new Map();
  for (const row of rows) {
    if (row?.course_id && row?.path) map.set(`${row.course_id}::${row.path}`, row.value);
  }
  return map;
}

export function setContentOverrideIndex(index) {
  _index = index;
}

export function getContentOverride(courseId, path) {
  const v = _index.get(`${courseId}::${path}`);
  return v === undefined ? null : v;
}

// Blank strings mean "not set" so clearing a field in the editor restores the
// text the course shipped with rather than rendering an empty heading.
function pick(courseId, path, shipped) {
  const v = _index.get(`${courseId}::${path}`);
  if (v === undefined || v === null) return shipped;
  if (typeof v === 'string') return v.trim().length > 0 ? v : shipped;
  if (Array.isArray(v)) return v.length > 0 ? v : shipped;
  return v;
}

export function applyContentOverride(course) {
  if (_index.size === 0) return course;
  const cid = course.id;
  return {
    ...course,
    modules: (course.modules || []).map((m) => ({
      ...m,
      title: pick(cid, `module:${m.id}:title`, m.title),
      subtitle: pick(cid, `module:${m.id}:subtitle`, m.subtitle),
      overview: pick(cid, `module:${m.id}:overview`, m.overview),
      objectives: pick(cid, `module:${m.id}:objectives`, m.objectives),
      topics: (m.topics || []).map((t) => ({
        ...t,
        title: pick(cid, `topic:${t.id}:title`, t.title),
        lesson: pick(cid, `topic:${t.id}:lesson`, t.lesson),
      })),
    })),
  };
}

export function applyContentOverrides(courses) {
  if (_index.size === 0) return courses;
  return courses.map(applyContentOverride);
}

// ---------- Supabase I/O ----------

// null distinguishes "migration not run" from "no overrides", so the editor can
// say so instead of silently appearing to save nothing.
export async function fetchContentOverrides() {
  const { data, error } = await supabase.from('content_overrides').select('*');
  if (error) return null;
  return data || [];
}

export async function saveContentOverride({ courseId, path, value, userId }) {
  const { error } = await supabase
    .from('content_overrides')
    .upsert({ course_id: courseId, path, value, updated_by: userId || null }, { onConflict: 'course_id,path' });
  if (error) throw error;
}

// Reverting deletes the row outright, so a reverted field is byte-identical to
// what ships rather than an empty string standing in for "unset".
export async function clearContentOverride({ courseId, path }) {
  const { error } = await supabase
    .from('content_overrides')
    .delete()
    .eq('course_id', courseId)
    .eq('path', path);
  if (error) throw error;
}
