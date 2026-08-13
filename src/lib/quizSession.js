// In-progress quiz persistence.
//
// Quiz state used to live only in React component state, so navigating away —
// to check a lesson, follow a link, or just hitting back — unmounted the
// component and discarded everything answered so far. Nothing was written until
// the quiz finished.
//
// Resuming needs the QUESTIONS themselves, not just an index. A module quiz is a
// random sample of 20 drawn from a much larger pool, so remounting builds a
// different quiz; an index into it would point at unrelated questions. Storing
// the exact set the learner started means they finish the quiz they began, and
// it also means a mid-quiz content edit (an admin suppressing a question) can't
// renumber a quiz underneath them.

const KEY = 'tradeiq_quiz_sessions';

// Abandoned sessions shouldn't resurface days later — by then the learner has
// forgotten the earlier answers and resuming is worse than starting fresh.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* quota or private mode — resuming is a convenience, never a requirement */
  }
}

function prune(map) {
  const now = Date.now();
  const out = {};
  for (const [k, v] of Object.entries(map)) {
    if (v?.savedAt && now - v.savedAt < MAX_AGE_MS) out[k] = v;
  }
  return out;
}

export function loadQuizSession(key) {
  if (!key) return null;
  const map = prune(readAll());
  const s = map[key];
  if (!s || !Array.isArray(s.questions) || s.questions.length === 0) return null;
  // A saved position past the end means the data is inconsistent; start over
  // rather than crashing on an undefined question.
  if (typeof s.current !== 'number' || s.current >= s.questions.length) return null;
  return s;
}

export function saveQuizSession(key, state) {
  if (!key || !state?.questions?.length) return;
  const map = prune(readAll());
  map[key] = { ...state, savedAt: Date.now() };
  writeAll(map);
}

export function clearQuizSession(key) {
  if (!key) return;
  const map = prune(readAll());
  delete map[key];
  writeAll(map);
}

// Lightweight "is there something to resume?" for entry-point buttons. Returns
// just the position, not the stored questions, so a page listing several
// resumable sessions doesn't pull every question array into its render.
export function getQuizSessionInfo(key) {
  const s = loadQuizSession(key);
  if (!s) return null;
  return { current: s.current, total: s.questions.length, savedAt: s.savedAt };
}
