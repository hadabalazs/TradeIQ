// Conflict-free merge of two progress snapshots.
//
// WHY THIS EXISTS: the old sync was last-write-wins on a single timestamp, so a
// device with stale or empty data could overwrite good progress — which looked
// like "progress resets on deploy" (a deploy forces a reload, which re-runs
// sync). Merging instead of overwriting means progress can only ever GROW:
// completed topics, quiz bests, streaks, XP and SRS history survive no matter
// which device syncs when, or how often you redeploy.
//
// The rule for every field is "keep the better/union value", never "replace".

function uniq(arr) {
  return Array.from(new Set(arr || []));
}

// Merge two per-course progress objects.
function mergeCourse(a = {}, b = {}) {
  const out = { ...a, ...b };
  out.completed_topics = uniq([...(a.completed_topics || []), ...(b.completed_topics || [])]);
  out.passed_first_time = uniq([...(a.passed_first_time || []), ...(b.passed_first_time || [])]);

  // quiz_scores: keep the highest percent per topic/quiz.
  const scores = {};
  for (const key of uniq([...Object.keys(a.quiz_scores || {}), ...Object.keys(b.quiz_scores || {})])) {
    const sa = a.quiz_scores?.[key];
    const sb = b.quiz_scores?.[key];
    scores[key] = !sa ? sb : !sb ? sa : (sb.percent > sa.percent ? sb : sa);
  }
  out.quiz_scores = scores;

  out.certified = !!(a.certified || b.certified);
  out.unlock_all = !!(a.unlock_all || b.unlock_all);
  out.final_assessment_score = Math.max(a.final_assessment_score || 0, b.final_assessment_score || 0);
  // knowledge_level / level_set: prefer whichever has been explicitly set.
  out.level_set = !!(a.level_set || b.level_set);
  out.knowledge_level = b.level_set ? b.knowledge_level : (a.level_set ? a.knowledge_level : (b.knowledge_level || a.knowledge_level || "beginner"));
  return out;
}

// Merge two top-level progress blobs. Neither side is trusted as "newer" —
// we take the union / max of everything.
export function mergeProgress(a, b) {
  if (!a) return b || null;
  if (!b) return a;

  const courses = {};
  for (const id of uniq([...Object.keys(a.courses || {}), ...Object.keys(b.courses || {})])) {
    courses[id] = mergeCourse(a.courses?.[id], b.courses?.[id]);
  }

  return {
    ...a,
    ...b,
    // identity: prefer a non-empty name; onboarding sticks once true.
    user_name: (b.user_name || a.user_name || ""),
    knowledge_level: b.knowledge_level || a.knowledge_level || "beginner",
    onboarded: !!(a.onboarded || b.onboarded),
    // counters: take the max so nothing regresses.
    total_xp: Math.max(a.total_xp || 0, b.total_xp || 0),
    streak_count: Math.max(a.streak_count || 0, b.streak_count || 0),
    best_streak: Math.max(a.best_streak || 0, b.best_streak || 0),
    // history: union of active/daily days; keep the latest markers.
    daily_history: uniq([...(a.daily_history || []), ...(b.daily_history || [])]).sort(),
    last_daily_date: [a.last_daily_date, b.last_daily_date].filter(Boolean).sort().pop() || null,
    last_active_date: [a.last_active_date, b.last_active_date].filter(Boolean).sort().pop() || null,
    shield_used_week: [a.shield_used_week, b.shield_used_week].filter(Boolean).sort().pop() || undefined,
    srs_data: { ...(a.srs_data || {}), ...(b.srs_data || {}) },
    courses,
  };
}

// Merge two SRS card stores. Each card is keyed by a stable question hash;
// keep whichever card was reviewed most recently (that's the authoritative
// scheduling state), and union the successDays.
export function mergeSrsCards(a, b) {
  if (!a) return b || {};
  if (!b) return a;
  const out = { ...a };
  for (const [id, cardB] of Object.entries(b)) {
    const cardA = a[id];
    if (!cardA) { out[id] = cardB; continue; }
    const tA = cardA.last_review ? new Date(cardA.last_review).getTime() : 0;
    const tB = cardB.last_review ? new Date(cardB.last_review).getTime() : 0;
    const base = tB >= tA ? cardB : cardA;
    out[id] = {
      ...base,
      successDays: uniq([...(cardA.successDays || []), ...(cardB.successDays || [])]).sort().slice(-10),
    };
  }
  return out;
}

// Merge custom (admin-published) courses by id; prefer the incoming version.
export function mergeCustomCourses(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  const byId = {};
  for (const c of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (c && c.id) byId[c.id] = c;
  }
  return Object.values(byId);
}

// Merge notes objects (keyed by topic/lesson id); prefer the longer/newer note.
export function mergeNotes(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (!out[k] || String(v).length >= String(out[k]).length) out[k] = v;
  }
  return out;
}
