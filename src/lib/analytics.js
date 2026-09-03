import { supabase } from '@/lib/supabaseClient';

// Anonymous page-view tracking, recorded to this project's own database.
//
// Deliberately minimal about what it collects:
//   · no IP address, no user agent string, no user id
//   · no cookies, and nothing in localStorage
//   · the session id lives in sessionStorage, so it dies with the tab and the
//     same person tomorrow is not linkable to today
//   · the referrer is reduced to its host, since a full referrer URL can carry
//     search terms and private path segments
//
// It also gives up quietly. Do Not Track and Global Privacy Control are
// honoured, and every failure — offline, the migration not run, the policy
// revoked — is swallowed. Analytics must never be the reason a page breaks.

const SESSION_KEY = 'tradeiq_analytics_session';

// Paths whose last segment is a real identifier we want to keep whole, versus
// noise. Course ids are meaningful; topic ids inside a lesson are not, and
// keeping them would fragment the report into hundreds of one-view rows.
const COURSE_RE = /^\/course\/([^/]+)/;

function optedOut() {
  if (typeof navigator === 'undefined') return true;
  // navigator.doNotTrack is "1" in most browsers, "yes" in a few older ones.
  const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') return true;
  if (navigator.globalPrivacyControl === true) return true;
  return false;
}

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private mode with storage disabled. A missing session id costs a
    // slightly inflated session count, which is better than not recording.
    return null;
  }
}

function device() {
  const w = window.innerWidth || 0;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function referrerHost() {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname;
    // Internal navigation is not a referral.
    if (host === window.location.hostname) return null;
    return host.replace(/^www\./, '').slice(0, 253);
  } catch {
    return null;
  }
}

// Collapse routes that carry an id in the path, so the report groups by screen
// rather than listing every lesson separately. Course pages keep their id
// because which course was viewed is the main question being asked.
function normalisePath(pathname) {
  const p = (pathname || '/').split('?')[0].split('#')[0];
  const course = p.match(COURSE_RE);
  if (course) {
    const rest = p.slice(course[0].length);
    if (rest.startsWith('/learn/')) return `/course/${course[1]}/learn`;
    if (rest.startsWith('/quiz/')) return `/course/${course[1]}/quiz`;
    if (rest.startsWith('/module/')) return `/course/${course[1]}/module`;
    return p;
  }
  if (p.startsWith('/verify/')) return '/verify';
  if (p.startsWith('/admin/course/')) return '/admin/course';
  return p.slice(0, 512);
}

// Screens already recorded this session, so React re-renders and StrictMode's
// double-invoked effects cannot count the same screen twice.
//
// Keyed by path alone. Including the signed-in flag meant the first screen was
// recorded twice for every logged-in visitor: once before the session resolved
// and again when it flipped false to true.
const seen = new Set();

// Stop trying after the server tells us this will never work — the migration
// has not been run, or the insert policy was revoked. Without it every
// navigation fires another doomed request and logs another console error.
let disabled = false;

// A network failure is different: offline, a dropped connection, a blocked
// request. Those come back, so they are counted rather than fatal, and tracking
// resumes on the next navigation. Giving up permanently on the first blip would
// silently lose the rest of the visit.
let networkFailures = 0;
const MAX_NETWORK_FAILURES = 3;

export function trackPageView(pathname, { isAuthenticated = false, force = false } = {}) {
  if (disabled || optedOut()) return;

  const path = normalisePath(pathname);
  if (!force && seen.has(path)) return;
  seen.add(path);

  const courseMatch = path.match(COURSE_RE);

  // Fire and forget. Not awaited anywhere, and every error is swallowed.
  supabase
    .from('page_views')
    .insert({
      path,
      course_id: courseMatch ? courseMatch[1].slice(0, 128) : null,
      referrer_host: referrerHost(),
      device: device(),
      is_authenticated: !!isAuthenticated,
      session_id: sessionId(),
    })
    .then(
      ({ error }) => {
        // An error object here came from the API: the table or policy is
        // missing, and retrying cannot help.
        if (error) disabled = true;
        else networkFailures = 0;
      },
      () => {
        // A rejected promise is a transport failure. Retry next navigation, but
        // do not keep firing forever if the connection is simply gone.
        networkFailures += 1;
        if (networkFailures >= MAX_NETWORK_FAILURES) disabled = true;
      },
    );
}

// Exported for the admin dashboard's "what is collected" note and for tests.
export const ANALYTICS_FIELDS = ['path', 'course_id', 'referrer_host', 'device', 'is_authenticated', 'session_id'];

export { normalisePath, optedOut };
