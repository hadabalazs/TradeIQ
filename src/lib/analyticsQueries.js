import { supabase } from '@/lib/supabaseClient';

// Reads for the admin traffic dashboard.
//
// Aggregation happens in JS rather than SQL on purpose: it needs no extra
// database functions to install, and at the volumes a course site produces the
// row count is small. `fetchPageViews` caps what it pulls so a busy month
// cannot try to load an unbounded result into the browser.
//
// Returns null — not an empty array — when the table does not exist yet, so the
// page can say "run the migration" instead of "no traffic".

const MAX_ROWS = 20000;

export async function fetchPageViews({ days = 30 } = {}) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('page_views')
    .select('path, course_id, referrer_host, device, is_authenticated, session_id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(MAX_ROWS);
  if (error) return null;
  return data || [];
}

function tally(rows, key) {
  const counts = new Map();
  for (const r of rows) {
    const v = r[key];
    if (v == null || v === '') continue;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function dayKey(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export function summarise(rows, { days = 30 } = {}) {
  const views = rows.length;
  // "Sessions" rather than "visitors": the id is per-tab and expires with it,
  // so a returning person counts again. Naming it honestly matters more than
  // the bigger number.
  const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;

  const byDay = new Map();
  for (let i = days - 1; i >= 0; i--) {
    byDay.set(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const k = dayKey(r.created_at);
    if (byDay.has(k)) byDay.set(k, byDay.get(k) + 1);
  }

  const signedIn = rows.filter((r) => r.is_authenticated).length;

  return {
    views,
    sessions,
    signedInShare: views ? Math.round((signedIn / views) * 100) : 0,
    perDay: [...byDay.entries()].map(([date, count]) => ({ date, count })),
    topPaths: tally(rows, 'path').slice(0, 15),
    topCourses: tally(rows.filter((r) => r.course_id), 'course_id').slice(0, 15),
    referrers: tally(rows, 'referrer_host').slice(0, 15),
    devices: tally(rows, 'device'),
    // Views that arrived with no referrer: typed, bookmarked, or from an app
    // that strips it (most messaging apps do).
    directShare: views ? Math.round((rows.filter((r) => !r.referrer_host).length / views) * 100) : 0,
  };
}
