# TradeIQ — course generation prompt

Paste everything below the line into Claude (or any capable model), replacing the
bracketed placeholders at the top. It returns a single JSON file you upload at
**Admin → Add New Course → Structured Upload** (`.json` only).

The prompt encodes the exact rules TradeIQ's validator enforces, so a course
generated this way should import without errors. If the upload reports problems,
paste the error list back to the model — every rule it can break is stated below.

---

You are building a complete course for **TradeIQ Academy**, a spaced-repetition
learning platform. Output **one JSON file and nothing else** — no commentary, no
markdown fences around it.

## What I want

- **Subject:** [SUBJECT — e.g. "IFRS 16 Leases for corporate accountants"]
- **Audience:** [WHO — e.g. "qualified accountants new to lease accounting"]
- **Level:** [Beginner | Intermediate | Advanced]
- **Modules:** [NUMBER, 4–6 recommended]
- **Topics per module:** [NUMBER, 4–6 recommended]
- **Region / regulatory focus, if any:** [OPTIONAL]
- **Tone:** practical and specific. Real figures, real institutions, real
  scenarios. No filler, no "in today's fast-paced world".

## Output shape

```json
{
  "title": "Course Title",
  "subtitle": "Short one-line subtitle",
  "description": "Two sentences describing what the course covers and who it's for.",
  "category": "Finance & Accounting",
  "level": "Intermediate",
  "certificateText": "What prints on the certificate under the course name",
  "icon": "TrendingUp",
  "gradient": "from-emerald-500/10 to-teal-500/5",
  "modules": [ ... ],
  "finalAssessment": [ ... ],
  "glossary": [ { "term": "...", "def": "..." } ],
  "dilemmas": [ ... ],
  "diagrams": { ... }
}
```

`title` and `modules` are the only strictly required fields, but produce all of
them — a course without `glossary` or `certificateText` looks unfinished.

### `icon` — must be exactly one of

`TrendingUp`, `Building2`, `Briefcase`, `Shield`, `Code`, `FlaskConical`,
`Globe`, `LineChart`, `Scale`, `Banknote`, `Cpu`, `Rocket`

Anything else silently falls back to a generic book icon.

### `gradient`

A Tailwind gradient pair, e.g. `"from-blue-500/10 to-indigo-500/5"`. Pick colours
that suit the subject.

## Modules

```json
{
  "id": "xyz_m1",
  "title": "Foundations of ...",
  "subtitle": "One line under the title",
  "overview": "2–4 short markdown paragraphs: what this module covers, why it matters, and what to watch out for. Rendered on the module overview page.",
  "objectives": [
    "Explain ...",
    "Calculate ...",
    "Identify ..."
  ],
  "topics": [ ... ]
}
```

- `overview` and `objectives` are **required for a good course** — they power the
  module overview page. Write 3–6 objectives, each finishing the sentence *"By
  the end you'll be able to ..."*. Make them concrete and checkable
  ("Calculate the lease liability on commencement"), never vague
  ("Understand leases").

## Topics

```json
{
  "id": "xyz_m1t1",
  "title": "What is a Lease?",
  "lesson": "## What is a Lease?\n\nMarkdown body...",
  "quiz": [ ... ]
}
```

### ID rules — important

**Topic IDs must be unique across every course on the platform, not just this
one.** Prefix everything with a short course slug: `ifrs16_m1t1`, `ifrs16_m1t2`,
`ifrs16_m2t1`. Module IDs follow the same pattern: `ifrs16_m1`. A collision with
an existing course will corrupt progress tracking for both.

### `lesson`

Markdown. 400–800 words per topic. Use `##` and `###` headings, bullet lists,
short paragraphs, bold for key terms. Include worked examples with real numbers
where the subject allows. You may embed a diagram with `{{diagram:some-id}}` on
its own line — see Diagrams below.

## Quiz questions — the part that matters most

Every topic needs a `quiz` array. **Author at least 8 questions per topic.**
Module quizzes draw 20 questions from the whole module, so a module of five
topics with four questions each has barely enough to fill one attempt, and
retakes will repeat.

Five question types. The required fields differ per type and the validator is
strict:

**1. Multiple choice** (the default — omit `questionType`)
```json
{
  "q": "Under IFRS 16, when does a lessee recognise a right-of-use asset?",
  "options": ["At commencement date", "At inception date", "On first payment", "At year end"],
  "answer": 0,
  "explain": "Recognition is at the commencement date — when the asset is made available for use, which may be later than inception."
}
```
- **exactly 4 options**, no more, no fewer
- `answer` is the **0-based index** of the correct option
- `explain` is required and must justify the answer, not restate it
- Make the three wrong options genuinely plausible — a distractor nobody would
  pick teaches nothing. Common misconceptions make the best distractors.

**2. Flashcard**
```json
{
  "q": "What are the two exemptions from IFRS 16 lessee accounting?",
  "answerText": "Short-term leases (12 months or less) and leases of low-value assets.",
  "explain": "Both are elective and applied by class of asset.",
  "questionType": "flashcard"
}
```

**3. Fill in the blank**
```json
{
  "q": "The lease liability is measured at the present value of lease payments discounted at the _______",
  "answerText": "interest rate implicit in the lease",
  "explain": "If that rate can't be readily determined, the lessee's incremental borrowing rate is used.",
  "questionType": "fill-in-the-blank"
}
```
Keep `answerText` short — under about 45 characters — since the learner types it.

**4. Sorting** — put `options` in the CORRECT order; the app shuffles them
```json
{
  "q": "Order these steps in measuring a lease liability, first to last:",
  "options": [
    "Identify the lease payments",
    "Determine the discount rate",
    "Calculate the present value",
    "Recognise the right-of-use asset"
  ],
  "explain": "Payments and rate must both be known before discounting.",
  "questionType": "sorting"
}
```
Needs 2+ options. 4–5 is ideal.

**5. Term match**
```json
{
  "q": "Match each term to its definition.",
  "pairs": [
    { "term": "Commencement date", "definition": "When the underlying asset is made available for use" },
    { "term": "Inception date", "definition": "The earlier of the agreement date and the date of commitment" },
    { "term": "Lease term", "definition": "Non-cancellable period plus reasonably certain options" },
    { "term": "ROU asset", "definition": "The lessee's right to use the underlying asset" }
  ],
  "questionType": "term-match"
}
```
Needs 2+ pairs. 4 is ideal.

### Which types to author

TradeIQ **automatically converts plain multiple-choice questions into flashcards
and fill-in-the-blanks at runtime**, so you do not need many of types 2 and 3 —
they'll be generated from your MCQs.

**Sorting and term-match cannot be auto-generated** — they need a definitive
order or pairing. So author them explicitly. Aim per topic for roughly:

- 6 multiple choice
- 1 sorting
- 1 term match

That mix gives the module quizzes and the final exam real variety.

## Final assessment

```json
"finalAssessment": [ ...20–25 questions... ]
```

Draw across all modules, weighted toward application over recall. If you omit
this, TradeIQ generates one from the topic quizzes.

**Do not use flashcards here.** Flashcards are self-graded — the learner taps "I
remembered this" — which cannot decide a certification. Multiple choice, fill in
the blank, sorting and term match are all objectively marked and are fine.

Pass mark is **75%** for the final assessment and **70%** for module quizzes.

## Glossary

```json
"glossary": [ { "term": "Right-of-use asset", "def": "One-sentence definition." } ]
```
20–40 entries. **Every `term` must be unique** — duplicates get silently
collapsed.

## Diagrams (optional)

Reference in a lesson as `{{diagram:lease-measurement}}` on its own line, then
define it:

```json
"diagrams": {
  "lease-measurement": {
    "layout": "flow",
    "items": [
      { "label": "Identify payments", "desc": "Fixed and in-substance fixed" },
      { "label": "Discount", "desc": "Implicit rate or IBR" },
      { "label": "Recognise", "desc": "Liability and ROU asset" }
    ]
  }
}
```

`layout` must be one of: `flow`, `cycle`, `comparison`, `stack`, `grid`.
All layouts need `items` (2+) **except** `comparison`, which needs `columns` (2+).

## Dilemmas (optional but recommended — 2–3 per course)

Branching scenarios interleaved into module quizzes. Each is a small decision
tree.

```json
"dilemmas": [
  {
    "id": "xyz_d1",
    "title": "The Sale and Leaseback Request",
    "module": 1,
    "dilemmaType": "Judgment Call",
    "startNode": "start",
    "nodes": {
      "start": {
        "type": "decision",
        "speaker": "Amira (CFO)",
        "text": "We want to sell the warehouse and lease it back. Can we take the full gain to P&L?",
        "choices": [
          { "text": "Yes — it's a disposal", "next": "wrong1" },
          { "text": "Only the portion relating to rights transferred", "next": "right1" }
        ]
      },
      "right1": {
        "type": "consequence",
        "tone": "positive",
        "text": "Correct. Gain is restricted to the rights transferred to the buyer-lessor.",
        "learningPoint": "IFRS 16 restricts sale-and-leaseback gains to the proportion of rights actually transferred.",
        "choices": [ { "text": "Continue", "next": "end" } ]
      },
      "wrong1": {
        "type": "consequence",
        "tone": "negative",
        "text": "That overstates the gain — the auditors will push back.",
        "learningPoint": "A seller-lessee retains a right of use, so the full gain cannot be recognised.",
        "choices": [ { "text": "Continue", "next": "end" } ]
      },
      "end": {
        "type": "ending",
        "text": "You applied the partial gain recognition rule correctly.",
        "relatedTopics": ["Sale and Leaseback"]
      }
    }
  }
]
```

Rules the validator enforces:
- `module` is a **number** (1-based module position), not a string
- `startNode` must exist in `nodes`
- node `type` is `decision`, `consequence`, or `ending`
- **decision** nodes need `speaker` and 2+ `choices`, each with `text` and `next`
- **consequence** nodes need `tone` (`positive` | `negative` | `neutral`),
  `learningPoint`, and at least 1 choice
- every node needs `text`
- `relatedTopics` on an ending should match topic **titles** exactly, so they
  link back to the lessons

## Before you output — check every one of these

1. Valid JSON. No trailing commas, no comments, no markdown fences.
2. Every topic ID is globally unique and course-prefixed.
3. Every multiple-choice question has exactly 4 options and an `answer` of 0–3.
4. Every question except term-match has an `explain`.
5. Every flashcard and fill-in-the-blank has `answerText`.
6. Every sorting question's `options` are in the correct order.
7. Every glossary `term` appears once.
8. Every `{{diagram:x}}` used in a lesson has a matching entry in `diagrams`.
9. No flashcards in `finalAssessment`.
10. At least 8 quiz questions per topic.

Output the JSON now.
