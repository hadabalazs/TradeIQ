// Local-first cloud sync.
// localStorage remains the source of truth while working; changes are
// debounce-pushed to Supabase when signed in. On login, newest data wins.

import { supabase } from '@/lib/supabaseClient';

const KEYS = {
  progress: 'tradeiq_progress',
  srs_cards: 'tradeiq_srs_cards',
  notes: 'tradeiq_lesson_notes',
  custom_courses: 'tradeiq_custom_courses',
};
const LAST_CHANGE_KEY = 'tradeiq_last_local_change';

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

export function setSyncUser(userId) {
  currentUserId = userId || null;
}

// Call after any local data write. Debounces a cloud push when signed in.
export function notifyDataChanged() {
  try { localStorage.setItem(LAST_CHANGE_KEY, new Date().toISOString()); } catch { /* ignore */ }
  if (!currentUserId || !navigator.onLine) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushToCloud().catch(() => {}); }, 3000);
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

// On login: newest side wins. Returns 'pulled' if cloud data replaced local
// (caller should reload the app), 'pushed' or 'none' otherwise.
export async function syncOnLogin(userId) {
  setSyncUser(userId);
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return 'none';

  const localChange = localStorage.getItem(LAST_CHANGE_KEY);
  const cloudChange = data?.updated_at || null;

  if (data && (!localChange || new Date(cloudChange) > new Date(localChange))) {
    // Cloud is newer (or this device is fresh) — apply cloud locally.
    const map = {
      [KEYS.progress]: data.progress,
      [KEYS.srs_cards]: data.srs_cards,
      [KEYS.notes]: data.notes,
      [KEYS.custom_courses]: data.custom_courses,
    };
    for (const [key, value] of Object.entries(map)) {
      if (value != null) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
      }
    }
    try { localStorage.setItem(LAST_CHANGE_KEY, cloudChange); } catch { /* ignore */ }
    return 'pulled';
  }

  // Local is newer or cloud row doesn't exist yet — seed the cloud from local.
  await pushToCloud().catch(() => {});
  return data ? 'pushed' : 'seeded';
}

// Best-effort flush when the tab hides or connectivity returns.
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentUserId) {
      pushToCloud().catch(() => {});
    }
  });
  window.addEventListener('online', () => {
    if (currentUserId) pushToCloud().catch(() => {});
  });
}
