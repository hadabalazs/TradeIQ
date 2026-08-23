# TradeIQ Academy

A spaced-repetition learning platform for professional subjects. Learners work
through courses, get quizzed rather than asked to re-read, and are brought back
to each question just before they would forget it — so the material is still
there months after the course ends.

Live at [tradeiqcourse.com](https://tradeiqcourse.com).

## How the learning model works

The whole product is built around four findings about memory, and it is worth
knowing them before changing anything, because most of the code exists to serve
them:

- **Retrieval over review.** Every topic ends in questions. Recalling something
  is what consolidates it; re-reading mostly produces a feeling of familiarity.
- **Spaced scheduling.** Every question is scheduled individually by
  [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) (`src/lib/srs.js`).
  Answer confidently and the interval lengthens; hesitate and it shortens.
- **Interleaving.** Sessions mix topics and question formats rather than
  blocking them (`interleaveByTopic`, `diversifyQuizArray`). It feels harder and
  retains better.
- **Measurement.** A predicted recall score per module, from the same FSRS
  model, so a learner can drill weak spots instead of re-reading everything.

## Stack

| | |
|---|---|
| Frontend | React 18, Vite 6, Tailwind 3, shadcn/ui |
| Routing | React Router 6 |
| Backend | Supabase — auth, progress sync, course catalog, admin overrides |
| Scheduling | ts-fsrs |
| Offline | vite-plugin-pwa (service worker, installable) |
| Hosting | Netlify |

The app is **fully usable signed out**. Progress lives in `localStorage`; an
account adds cross-device sync and a verifiable certificate.

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev
```

Vite prints a local URL. No backend to run — the app talks to the hosted
Supabase project, whose URL and publishable key are committed in
`src/lib/supabaseClient.js`. That key is meant to be public; row-level security
is what protects user data.

Other scripts:

```bash
npm run build      # production build
npm run preview    # serve the production build
npm run lint       # eslint, quiet
npm run typecheck  # tsc against jsconfig
```

## Database migrations

SQL lives in `migrations/`, applied by hand in the Supabase SQL editor. Each is
idempotent and safe to re-run.

| File | Adds |
|---|---|
| `001_question_flags_and_overrides.sql` | Learners report bad questions; admins suppress or replace them |
| `002_course_overrides.sql` | Editable course names and certificate text |
| `003_certificates.sql` | Issued certificates and public verification |
| `004_content_overrides.sql` | Editable lesson and module content |

Every feature degrades gracefully when its migration has not been run — the UI
says so and the app behaves exactly as shipped. Nothing breaks; the feature just
stays dormant.

## How course content is assembled

`src/lib/courses.js` is the single place courses are built, and everything
downstream reads the resulting `COURSES` array. Built-in curricula are compiled
into the bundle; custom courses come from Supabase; three override layers are
applied on top:

```
built-in curricula + custom courses
  → dedupe by id
  → content overrides   (lesson text, module overviews)
  → question overrides  (a question replaced or withdrawn)
  → course overrides    (names, certificate text)
  → COURSES
```

Applying overrides here rather than at each screen is deliberate: module
quizzes, topic quizzes, practice, daily recap, the review pool, expert questions
and the final exam all read the same array, so a correction lands everywhere at
once and no new surface can forget to apply it.

## Adding a course

Two routes:

- **Upload** — Admin → Add New Course → Structured Upload, with a JSON file.
  `docs/COURSE_GENERATION_PROMPT.md` is a prompt that produces a conforming file;
  it encodes every rule the validator enforces.
- **In code** — add a curriculum file and one entry in `COURSE_DEFS`
  (`src/lib/courses.js`). `src/lib/courseTemplate.js` is a documented starting
  point.

Topic ids must be unique across **all** courses, not just within one — a
collision corrupts progress tracking for both.

## Admin

`/admin`, gated on a Supabase `app_metadata.role` of `admin`, which only the
project owner can set. The client-side check is UI convenience; row-level
security is the real boundary.

- **Course Editor** — read and edit every module overview, lesson body, and
  question, including changing question type
- **Flagged questions** — review learner reports; edit, withdraw or reinstate
- **Course names & certificate text**
- **Add / manage courses**

## Layout

```
src/
  pages/        one file per route
  components/
    tradeiq/    app components (quizzes, certificate, lessons)
    admin/      admin panels
    ui/         shadcn primitives
  lib/          courses, srs, sync, overrides, contexts
migrations/     SQL, run by hand in Supabase
docs/           course generation prompt
```

Progress sync (`src/lib/sync.js`) **merges** rather than overwrites: local and
cloud state are unioned, so progress can only grow and a stale device can never
wipe good data.
