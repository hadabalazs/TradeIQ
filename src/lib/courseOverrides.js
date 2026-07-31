// Admin-editable course display text, layered onto courses at load.
//
// Same reasoning as questionOverrides.js: the built-in courses are compiled into
// the JS bundle, so their text cannot be edited at runtime. Applying the layer
// where the course registry is assembled means a rename lands everywhere at once
// — catalog, sidebar, dashboard, module pages, certificate — instead of needing
// each surface to remember to read an override.
//
// Each field is independent and nullable: a row that sets only `certificate_title`
// leaves the course's own title, subtitle and certificate blurb untouched. That
// matters because these four strings are genuinely different things — a course
// called "IFRS & Commodity Trading" in the catalog may want to print as
// "Professional Certificate in IFRS for Commodity Trading" on the certificate.

import { supabase } from '@/lib/supabaseClient';

let _index = new Map();

export function indexCourseOverrides(rows = []) {
  const map = new Map();
  for (const row of rows) {
    if (row?.course_id) map.set(row.course_id, row);
  }
  return map;
}

export function setCourseOverrideIndex(index) {
  _index = index;
}

export function getCourseOverride(courseId) {
  return _index.get(courseId) || null;
}

// Blank strings are treated as "not set" so clearing a field in the admin form
// restores the shipped text rather than rendering an empty heading.
function pick(overrideValue, shipped) {
  if (typeof overrideValue !== 'string') return shipped;
  const trimmed = overrideValue.trim();
  return trimmed.length > 0 ? trimmed : shipped;
}

export function applyCourseOverride(course) {
  const ovr = _index.get(course.id);
  if (!ovr) return course;
  return {
    ...course,
    title: pick(ovr.title, course.title),
    subtitle: pick(ovr.subtitle, course.subtitle),
    // The certificate name falls back to the (possibly overridden) course title,
    // so renaming a course carries onto its certificate unless the certificate
    // name has been set explicitly.
    certificateTitle: pick(ovr.certificate_title, course.certificateTitle || null),
    certificateText: pick(ovr.certificate_text, course.certificateText),
  };
}

export function applyCourseOverrides(courses) {
  if (_index.size === 0) return courses;
  return courses.map(applyCourseOverride);
}

// ---------- Supabase I/O ----------

// Returns null when the table is absent so callers can tell "no overrides" from
// "migration not run".
export async function fetchCourseOverrides() {
  const { data, error } = await supabase.from('course_overrides').select('*');
  if (error) return null;
  return data || [];
}

export async function saveCourseOverride({ courseId, title, subtitle, certificateTitle, certificateText, userId }) {
  const norm = (v) => (typeof v === 'string' && v.trim().length > 0 ? v.trim() : null);
  const { error } = await supabase.from('course_overrides').upsert(
    {
      course_id: courseId,
      title: norm(title),
      subtitle: norm(subtitle),
      certificate_title: norm(certificateTitle),
      certificate_text: norm(certificateText),
      updated_by: userId || null,
    },
    { onConflict: 'course_id' }
  );
  if (error) throw error;
}

// Reverting drops the row entirely, so the course returns to exactly what ships
// in the bundle with no leftover empty-string fields to reason about.
export async function clearCourseOverride(courseId) {
  const { error } = await supabase.from('course_overrides').delete().eq('course_id', courseId);
  if (error) throw error;
}
