// Question overrides — admin corrections layered onto course content at load.
//
// WHY THIS EXISTS
// The two built-in courses are compiled into the JS bundle, so a bad question
// cannot be fixed at runtime by editing source. Overrides are a thin layer read
// from Supabase and applied when the course registry is built, which means a
// correction takes effect for everyone immediately with no redeploy — and works
// identically for custom courses stored in the database.
//
// Applying at registry-build time is deliberate: module quizzes, topic quizzes,
// practice mode, the daily/mixed review SRS pool, expert questions and the final
// assessment all read from the same COURSES array, so they inherit corrections
// automatically. There is no per-surface filtering to forget.
//
// ON IDs: questionId() hashes question text + answer, so editing a question
// changes its id. An override therefore stores the ORIGINAL id as the key and
// the replacement's id separately, letting SRS carry review history across the
// edit (see remapQuestionId).

import { supabase } from '@/lib/supabaseClient';
import { questionId } from '@/lib/srs';

// Set once the overrides table has been read successfully. While false — the
// migration has not been run, or the fetch failed — the app behaves exactly as
// it did before this feature existed.
let _index = { suppress: new Set(), replace: new Map(), idRemap: new Map() };

export function indexOverrides(rows = []) {
  const suppress = new Set();
  const replace = new Map();
  const idRemap = new Map();
  for (const row of rows) {
    const key = `${row.course_id}::${row.question_id}`;
    if (row.action === 'suppress') {
      suppress.add(key);
    } else if (row.action === 'replace' && row.replacement) {
      replace.set(key, row.replacement);
      const newId = row.replacement_id || questionId(row.replacement);
      if (newId && newId !== row.question_id) idRemap.set(row.question_id, newId);
    }
  }
  return { suppress, replace, idRemap };
}

export function setOverrideIndex(index) {
  _index = index;
}

export function getOverrideIndex() {
  return _index;
}

// Map a pre-edit question id onto its replacement's id, so an SRS card written
// before a correction still matches the corrected question. Identity when the
// question was never replaced.
export function remapQuestionId(id) {
  return _index.idRemap.get(id) || id;
}

// Apply overrides to one quiz array: drop suppressed questions, swap replaced
// ones. Returns the same array instance when nothing changed, so React consumers
// don't re-render for no reason.
function applyToQuiz(quiz, courseId) {
  if (!Array.isArray(quiz) || quiz.length === 0) return quiz;
  if (_index.suppress.size === 0 && _index.replace.size === 0) return quiz;

  let changed = false;
  const out = [];
  for (const q of quiz) {
    const key = `${courseId}::${questionId(q)}`;
    if (_index.suppress.has(key)) { changed = true; continue; }
    const replacement = _index.replace.get(key);
    if (replacement) { out.push({ ...q, ...replacement }); changed = true; continue; }
    out.push(q);
  }
  return changed ? out : quiz;
}

// Apply overrides across a whole course — every surface that can show a question.
export function applyOverridesToCourse(course) {
  if (_index.suppress.size === 0 && _index.replace.size === 0) return course;
  return {
    ...course,
    modules: (course.modules || []).map((m) => ({
      ...m,
      topics: (m.topics || []).map((t) => ({ ...t, quiz: applyToQuiz(t.quiz, course.id) })),
    })),
    finalAssessment: applyToQuiz(course.finalAssessment, course.id),
    expertQuestions: applyToQuiz(course.expertQuestions, course.id),
  };
}

export function applyOverridesToCourses(courses) {
  if (_index.suppress.size === 0 && _index.replace.size === 0) return courses;
  return courses.map(applyOverridesToCourse);
}

// ---------- Supabase I/O ----------

// Read every override. Public read (see RLS) because suppression has to apply to
// signed-out users too. Returns null when the table is missing so callers can
// distinguish "no overrides" from "feature not installed".
export async function fetchOverrides() {
  const { data, error } = await supabase.from('question_overrides').select('*');
  if (error) return null;
  return data || [];
}

export async function suppressQuestion({ courseId, questionId: qid, moduleId, topicId, note, userId }) {
  const { error } = await supabase.from('question_overrides').upsert(
    {
      course_id: courseId,
      question_id: qid,
      action: 'suppress',
      replacement: null,
      replacement_id: null,
      module_id: moduleId || null,
      topic_id: topicId || null,
      note: note || null,
      created_by: userId || null,
    },
    { onConflict: 'course_id,question_id' }
  );
  if (error) throw error;
}

// Reinstating removes the row entirely rather than writing a counter-row, so the
// table always reads as the current set of corrections.
export async function clearOverride({ courseId, questionId: qid }) {
  const { error } = await supabase
    .from('question_overrides')
    .delete()
    .eq('course_id', courseId)
    .eq('question_id', qid);
  if (error) throw error;
}

export async function replaceQuestion({ courseId, questionId: qid, replacement, moduleId, topicId, note, userId }) {
  const { error } = await supabase.from('question_overrides').upsert(
    {
      course_id: courseId,
      question_id: qid,
      action: 'replace',
      replacement,
      replacement_id: questionId(replacement),
      module_id: moduleId || null,
      topic_id: topicId || null,
      note: note || null,
      created_by: userId || null,
    },
    { onConflict: 'course_id,question_id' }
  );
  if (error) throw error;
}
