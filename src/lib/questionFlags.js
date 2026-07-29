// Learner reports that a question is wrong or confusing, and the admin-side
// queue for reviewing them.
//
// Flags are reports, not content: a flag never changes what learners see. Acting
// on one — suppressing or replacing the question — goes through
// questionOverrides.js. Keeping the two apart means the review queue stays
// readable even after the underlying question has been corrected, because each
// flag carries a snapshot of the question as the learner actually saw it.

import { supabase } from '@/lib/supabaseClient';
import { questionId } from '@/lib/questionId';

export const FLAG_REASONS = [
  { id: 'incorrect', label: 'The answer is wrong' },
  { id: 'confusing', label: 'Confusing or ambiguous' },
  { id: 'typo', label: 'Typo or formatting' },
  { id: 'outdated', label: 'Out of date' },
  { id: 'other', label: 'Something else' },
];

// True once we know the migration has been run. Null means "not checked yet".
let _available = null;

// Probe for the tables so the UI can hide flagging entirely rather than offering
// a button that errors. Cached for the session.
export async function flaggingAvailable() {
  if (_available !== null) return _available;
  const { error } = await supabase.from('question_flags').select('id').limit(1);
  // A missing table / permission error means the feature isn't installed. A
  // successful call OR an empty result means it is.
  _available = !error || error.code === 'PGRST116';
  return _available;
}

export async function submitFlag({ question, courseId, moduleId, topicId, reason, note, userId }) {
  if (!userId) throw new Error('Sign in to report a question');
  // Fail with something meaningful rather than letting a missing value surface
  // as a raw not-null constraint violation from Postgres.
  if (!courseId) throw new Error('Could not tell which course this question belongs to');
  if (!question) throw new Error('No question to report');
  const { error } = await supabase.from('question_flags').insert({
    question_id: questionId(question),
    course_id: courseId,
    module_id: moduleId || null,
    topic_id: topicId || null,
    // Strip runtime annotations (_topicId, _card, …) so the snapshot is the
    // question itself, not the shape a particular quiz screen happened to build.
    question: stripRuntimeFields(question),
    reason: reason || 'other',
    note: note?.trim() || null,
    user_id: userId,
  });
  if (error) throw error;
}

function stripRuntimeFields(q) {
  const out = {};
  for (const [k, v] of Object.entries(q || {})) {
    if (!k.startsWith('_')) out[k] = v;
  }
  return out;
}

// Admin: every flag, newest first.
export async function listFlags({ status } = {}) {
  let query = supabase.from('question_flags').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function setFlagStatus(id, status) {
  const { error } = await supabase
    .from('question_flags')
    .update({ status, resolved_at: status === 'open' ? null : new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// Mark every open flag for a question at once — acting on the question resolves
// all of its reports, not just the one the admin happened to click.
export async function setStatusForQuestion(courseId, qid, status) {
  const { error } = await supabase
    .from('question_flags')
    .update({ status, resolved_at: status === 'open' ? null : new Date().toISOString() })
    .eq('course_id', courseId)
    .eq('question_id', qid);
  if (error) throw error;
}
