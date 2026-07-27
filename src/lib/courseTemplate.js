// ============================================================================
// COURSE TEMPLATE — Copy this file to create a new course curriculum.
// ============================================================================
// HOW TO ADD A NEW COURSE:
//
//   1. Duplicate this file:  cp src/lib/courseTemplate.js src/lib/myCourseCurriculum.js
//   2. Replace all placeholder content below with your course material.
//   3. (Optional) Add sorting questions keyed by topic ID to src/lib/sortingQuestions.js
//      and term-match questions to src/lib/termMatchQuestions.js.
//   4. Open src/lib/courses.js and:
//        a. Add imports for your MODULES, FINAL_ASSESSMENT, GLOSSARY, etc.
//        b. Add one entry to the COURSE_DEFS array.
//   5. Done — the course appears on the catalog, dashboard, daily lessons,
//      practice mode, and admin export automatically.
//
// QUESTION TYPES:
//   • Multiple Choice (default):  { q, options: [...4], answer: 0-3, explain }
//   • Flashcard (pre-typed):      { q, answerText, explain, questionType: "flashcard" }
//   • Fill-in-the-blank:          { q: "..._______", answerText, explain, questionType: "fill-in-the-blank" }
//   • Sorting:                    { q, options: [correct order], explain, questionType: "sorting" }
//   • Term Match:                 { q, pairs: [{term, definition}], questionType: "term-match" }
//
//   Plain MCQs are auto-diversified into flashcards/fill-in-the-blank at runtime.
//   Sorting and term-match questions MUST be pre-typed (they need a definitive
//   order or pairing that can't be auto-generated).
//
//   Every question should have an `explain` field — it powers the feedback loop.
// ============================================================================

// --- DIFFICULTY LEVELS ---
// Maps practice-mode difficulty to a range of module indices [start, end).
// The "expert" level uses EXPERT_QUESTIONS instead.
export const DIFFICULTY_LEVELS = [
  { id: "beginner", label: "Beginner", moduleRange: [0, 2] },
  { id: "intermediate", label: "Intermediate", moduleRange: [0, 4] },
  { id: "expert", label: "Expert", moduleRange: null },
];

// --- MODULES ---
// Each module has an id (unique within this course), title, subtitle, and topics.
// Each topic has an id (unique across ALL courses), title, lesson (markdown), and quiz.
// Topic IDs are used as keys for sorting/term-match questions, so they must be unique.
export const MODULES = [
  {
    id: "tm_m1",
    title: "Module 1: Foundations",
    subtitle: "The building blocks",
    topics: [
      {
        id: "tm_m1t1",
        title: "Topic 1: Introduction",
        lesson: `## Introduction

Write your lesson content here using **markdown**.

### Key Concepts
- Point one
- Point two

Diagrams can be embedded with \`{{diagram:name}}\` placeholders.`,
        quiz: [
          {
            q: "Sample multiple-choice question?",
            options: [
              "Incorrect option A",
              "Correct option B",
              "Incorrect option C",
              "Incorrect option D",
            ],
            answer: 1,
            explain: "Explanation of why option B is correct and the others are not.",
          },
          {
            q: "Sample flashcard question — what is the key term?",
            answerText: "The key term and its definition.",
            explain: "This is a pre-typed flashcard; the user reveals and self-assesses.",
            questionType: "flashcard",
          },
          {
            q: "A sample fill-in-the-blank: the answer is _______.",
            answerText: "keyword",
            explain: "Short answers work best for fill-in-the-blank.",
            questionType: "fill-in-the-blank",
          },
          {
            q: "Arrange these steps in the correct order:",
            options: [
              "First step in the process",
              "Second step that follows",
              "Third and final step",
            ],
            explain: "Sorting questions require a genuine chronological or logical sequence.",
            questionType: "sorting",
          },
          {
            q: "Match each term to its definition:",
            pairs: [
              { term: "Term A", definition: "Definition for A" },
              { term: "Term B", definition: "Definition for B" },
              { term: "Term C", definition: "Definition for C" },
              { term: "Term D", definition: "Definition for D" },
            ],
            questionType: "term-match",
          },
        ],
      },
    ],
  },
];

// --- FINAL ASSESSMENT ---
// The certification exam. Typically 20-30 MCQ questions drawn from all modules.
// Pass threshold is 75% (see FINAL_PASS_THRESHOLD in courses.js).
export const FINAL_ASSESSMENT = [
  {
    q: "Final assessment sample question?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 2,
    explain: "Explanation for the final assessment question.",
  },
];

// --- GLOSSARY ---
// Key terms for the course glossary panel.
export const GLOSSARY = [
  { term: "Term A", def: "Definition of Term A." },
  { term: "Term B", def: "Definition of Term B." },
];

// --- EXPERT QUESTIONS ---
// A curated pool of harder MCQs for expert practice mode. If not provided,
// the system falls back to a slice of all topic quizzes.
export const EXPERT_QUESTIONS = [
  {
    q: "Expert-level sample question?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 3,
    explain: "Detailed explanation for this expert question.",
  },
];

// --- SORTING QUESTIONS (optional) ---
// Keyed by topic ID. Add these to src/lib/sortingQuestions.js instead, OR
// import them here and pass them in the COURSE_DEFS entry in courses.js.
// Only include questions with a genuine sequence — no arbitrary ordering.
export const SORTING_QUESTIONS = {
  // "tm_m1t1": [
  //   { q: "...", options: ["step 1", "step 2", "step 3"], explain: "...", questionType: "sorting" },
  // ],
};

// --- TERM MATCH QUESTIONS (optional) ---
// Keyed by topic ID. Add these to src/lib/termMatchQuestions.js instead, OR
// import them here and pass them in the COURSE_DEFS entry in courses.js.
export const TERM_MATCH_QUESTIONS = {
  // "tm_m1t1": [
  //   { q: "Match each term...", pairs: [{term, definition}, ...], questionType: "term-match" },
  // ],
};