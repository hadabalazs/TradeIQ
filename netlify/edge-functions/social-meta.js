// Injects per-course Open Graph / Twitter meta into the HTML shell.
//
// Why this has to run at the edge: the app is a client-rendered SPA behind a
// catch-all `/* /index.html 200` rewrite, so every URL serves the same static
// HTML. Social crawlers (LinkedIn, WhatsApp, Slack, Facebook, X) do not execute
// JavaScript, so meta tags set from React are never seen — the preview card for
// every course showed the site-wide title instead. Rewriting the HTML on the way
// out is the only way to give each course its own preview card while keeping the
// SPA.
//
// Built-in course metadata comes from public/course-meta.json, generated at
// build time from the real course registry. Uploaded courses live only in
// Supabase, so those are read at request time.
//
// The page is unchanged for browsers apart from the meta tags and <title>, which
// React overwrites on hydration anyway.

const SUPABASE_URL = 'https://wpxfqwmdvszugcykvkoe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_qU0p-_i5CuK4yWwp99Jihg_TyWLfHxT';

const SITE_NAME = 'TradeIQ Academy';
const DEFAULT_TITLE = 'TradeIQ Academy';
const DEFAULT_DESCRIPTION =
  'Master professional skills with neuroscience backed memory boosting practices. Learn at your own pace, track your progress, and earn certificates.';

// Escapes text for use inside a double-quoted HTML attribute. Course titles and
// intros are admin-editable, so they are untrusted input as far as this file is
// concerned — without escaping, a quote in an intro would break out of the
// content attribute and let arbitrary markup into every crawler's view.
function attr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Preview cards truncate anyway, and an over-long description is worse than a
// clipped one because the clip lands mid-sentence.
function clamp(text, max = 200) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop > max * 0.5) return cut.slice(0, lastStop + 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

async function builtInCourse(origin, courseId) {
  try {
    const res = await fetch(`${origin}/course-meta.json`);
    if (!res.ok) return null;
    const all = await res.json();
    return all[courseId] || null;
  } catch {
    return null;
  }
}

async function uploadedCourse(courseId) {
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/courses` +
      `?course_id=eq.${encodeURIComponent(courseId)}` +
      `&is_published=eq.true&select=title,description,course_data&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return null;
    return {
      title: row.title,
      description: row.course_data?.intro || row.description || '',
    };
  } catch {
    return null;
  }
}

export default async function handler(request, context) {
  const response = await context.next();

  // Only rewrite HTML documents. Assets pass straight through.
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/course\/([^/]+)/);

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;

  if (match) {
    const courseId = decodeURIComponent(match[1]);
    const course =
      (await builtInCourse(url.origin, courseId)) || (await uploadedCourse(courseId));
    if (course) {
      title = `${course.title} — ${SITE_NAME}`;
      description = course.description || DEFAULT_DESCRIPTION;
    }
  }

  const canonical = `${url.origin}${url.pathname}`;
  // JPEG rather than PNG: the gradient compresses to 92KB instead of 694KB,
  // and preview cards are re-encoded by every platform anyway.
  const image = `${url.origin}/og-default.jpg`;
  const desc = clamp(description);

  const tags = [
    `<title>${attr(title)}</title>`,
    `<meta name="description" content="${attr(desc)}" />`,
    `<link rel="canonical" href="${attr(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${attr(SITE_NAME)}" />`,
    `<meta property="og:title" content="${attr(title)}" />`,
    `<meta property="og:description" content="${attr(desc)}" />`,
    `<meta property="og:url" content="${attr(canonical)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(title)}" />`,
    `<meta name="twitter:description" content="${attr(desc)}" />`,
    `<meta name="twitter:image" content="${attr(image)}" />`,
  ].join('\n    ');

  let html = await response.text();

  // Drop the shell's own title and description so there is exactly one of each —
  // duplicates make crawlers pick unpredictably.
  html = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '');

  html = html.replace('</head>', `  ${tags}\n  </head>`);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
}

export const config = { path: '/*' };
