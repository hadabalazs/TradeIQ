# AGENTS.md

## Project context

TradeIQ Academy — a spaced-repetition learning platform. React 18 + Vite 6 +
Tailwind + shadcn/ui on the front, Supabase for auth, progress sync and the
course catalog. Deployed on Netlify. See `README.md` for setup and architecture.

There is no separate backend to run. `npm run dev` is the whole local
environment; the app talks to the hosted Supabase project.

## Key files

- `src/lib/courses.js` — the single place courses are assembled. Built-in
  curricula, custom courses from Supabase, and three override layers are merged
  here into the `COURSES` array everything else reads.
- `src/lib/srs.js` — FSRS scheduling. Cards are keyed by a content hash of the
  question (`src/lib/questionId.js`).
- `src/lib/sync.js` + `src/lib/mergeProgress.js` — cross-device progress. This
  MERGES, it does not overwrite.
- `src/lib/supabaseClient.js` — URL and publishable key, intentionally committed.
- `migrations/` — SQL applied by hand in the Supabase SQL editor.

## Things that will bite you

- **Apply course changes in `courses.js`, not per screen.** Module quizzes,
  topic quizzes, practice, daily recap, the review pool, expert questions and
  the final exam all read the same `COURSES` array. A filter added to one screen
  is a filter the other six are missing.
- **`questionId()` is a content hash.** Editing a question changes its id, which
  orphans every learner's review card for it. Anything that edits a question must
  record the old and new ids so history can be remapped — see
  `questionOverrides.js`.
- **Progress sync must never overwrite.** `mergeProgress.js` unions local and
  cloud so progress can only grow. The one exception is documented in that file;
  match the existing reasoning before adding a field.
- **Built-in courses are compiled into the bundle.** They cannot be edited at
  runtime. That is why the override tables exist. Anything newly editable needs
  an override path, not a source edit.
- **Every migration-backed feature must degrade gracefully.** If the table is
  absent the UI says so and the app behaves exactly as shipped.
- **An entry point must not depend on a feature it doesn't use.** Admin sections
  that hide themselves have twice swallowed the only link to an unrelated tool.

## Before finishing

```bash
npm run lint
npm run build
```

Verify behaviour in the browser where the change is observable — the dev server
is the whole environment, so there is little excuse not to. Admin pages need a
Supabase account with `app_metadata.role = "admin"`; the client-side check is UI
convenience, row-level security is the real boundary.
