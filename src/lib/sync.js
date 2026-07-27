// Local-first cloud sync with CONFLICT-FREE MERGE.
//
// Old behaviour was last-write-wins on a single timestamp, which could let a
// stale/empty device overwrite good progress — and a deploy (which forces a
// reload) kept re-triggering that. Now every sync MERGES cloud + local so the
// result is the union: progress can only ever grow, never be lost, regardless
// of deploys, device order, or clock skew.

import { supabase } from '@/lib/supabaseClient';
import { mergeProgress, mergeSrsCards, mergeCustomCourses, mergeNotes } from '@/lib/mergeProgress';

const KEYS = {
  progress: 'tradeiq_progress',
  srs_cards: 'tradeiq_srs_cards',
  notes: 'tradeiq_lesson_notes',
  custom_courses: 'tradeiq_custom_courses',
};

let pushTimer = null;
let currentUserId = null;

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  if (value == null) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function setSyncUser(userId) {
  currentUserId = userId || null;
}

// Call after any local data write. Debounces a cloud push when signed in.
export function notifyDataChanged() {
  if (!currentUserId || !navigator.onLine) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushToCloud().catch(() => {}); }, 1200);
}

export async function pushToCloud() {
  if (!currentUserId) return;
  const payload = {
    user_id: currentUserId,
    progress: readJSON(KEYS.progress),
    srs_cards: readJSON(KEYS.srs_cards),
    notes: readJSON(KEYS.notes),
    custom_courses: readJSON(KEYS.custom_courses),
    updated_at: new Date().toISOString(),
  };
  await supabase.from('user_progress').upsert(payload, { onConflict: 'user_id' });
}

// Merge cloud into local (and push the union back). Returns:
//   'merged-changed' if local data changed as a result (caller should reload),
//   'merged-same'    if local was already a superset (no reload needed),
//   'seeded'         if there was no cloud row yet (local pushed up),
//   'none'           on error.
export async function syncOnLogin(userId) {
  setSyncUser(userId);
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return 'none';

  const localProgress = readJSON(KEYS.progress);
  const localSrs = readJSON(KEYS.srs_cards);
  const localNotes = readJSON(KEYS.notes);
  const localCustom = readJSON(KEYS.custom_courses);

  if (!data) {
    // No cloud row yet — seed it from local.
    await pushToCloud().catch(() => {});
    return 'seeded';
  }

  const beforeProgress = JSON.stringify(localProgress);
  const beforeSrs = JSON.stringify(localSrs);

  const mergedProgress = mergeProgress(data.progress || null, localProgress || null);
  const mergedSrs = mergeSrsCards(data.srs_cards || {}, localSrs || {});
  const mergedNotes = mergeNotes(data.notes || null, localNotes || null);
  const mergedCustom = mergeCustomCourses(data.custom_courses || null, localCustom || null);

  // Write the merged union locally.
  writeJSON(KEYS.progress, mergedProgress);
  writeJSON(KEYS.srs_cards, mergedSrs);
  writeJSON(KEYS.notes, mergedNotes);
  writeJSON(KEYS.custom_courses, mergedCustom);

  // Push the union back so the cloud also holds the complete picture.
  await pushToCloud().catch(() => {});

  const localChanged =
    beforeProgress !== JSON.stringify(mergedProgress) ||
    beforeSrs !== JSON.stringify(mergedSrs);
  return localChanged ? 'merged-changed' : 'merged-same';
}

// Best-effort flush when the tab hides or connectivity returns.
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentUserId) {
      clearTimeout(pushTimer);
      pushToCloud().catch(() => {});
    }
  });
  window.addEventListener('online', () => {
    if (currentUserId) pushToCloud().catch(() => {});
  });
  window.addEventListener('pagehide', () => {
    if (currentUserId) { clearTimeout(pushTimer); pushToCloud().catch(() => {}); }
  });
}
