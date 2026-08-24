// ============================================================================
// COURSE REGISTRY — Adding a new course
// ============================================================================
// To add a new course, follow these 3 steps:
//
//   1. Create a curriculum file at src/lib/<yourCourse>Curriculum.js that exports:
//        MODULES           — array of { id, title, subtitle, topics[] }
//        FINAL_ASSESSMENT  — array of MCQ questions for the certification exam
//        GLOSSARY          — array of { term, def }
//        EXPERT_QUESTIONS   — array of MCQ questions for expert practice mode
//        DIFFICULTY_LEVELS  — array of { id, label, moduleRange: [start, end] }
//
//   2. Add sorting questions (keyed by topic ID) to src/lib/sortingQuestions.js
//      and term-match questions (keyed by topic ID) to src/lib/termMatchQuestions.js.
//      These are optional — pass {} if your course has none.
//
//   3. Import the curriculum + question files below, then add ONE entry to the
//      COURSE_DEFS array. The registration engine handles all merging and wiring
//      automatically — no other files need to be changed.
//
// Tip: Use src/lib/courseTemplate.js as a starting point for a new curriculum.
// ============================================================================

import { MODULES as IFRS_MODULES, FINAL_ASSESSMENT as IFRS_FINAL, GLOSSARY as IFRS_GLOSSARY, EXPERT_QUESTIONS as IFRS_EXPERT, DIFFICULTY_LEVELS as IFRS_DIFF } from "@/lib/curriculum";
import { MODULES as OF_MODULES, FINAL_ASSESSMENT as OF_FINAL, GLOSSARY as OF_GLOSSARY } from "@/lib/openfinanceCurriculum";
import { IFRS_SORTING_QUESTIONS, OPENFINANCE_SORTING_QUESTIONS } from "@/lib/sortingQuestions";
import { IFRS_TERM_MATCH_QUESTIONS, OPENFINANCE_TERM_MATCH_QUESTIONS } from "@/lib/termMatchQuestions";
import { applyOverridesToCourses, indexOverrides, setOverrideIndex } from "@/lib/questionOverrides";
import { applyCourseOverrides, indexCourseOverrides, setCourseOverrideIndex } from "@/lib/courseOverrides";
import { applyContentOverrides, indexContentOverrides, setContentOverrideIndex } from "@/lib/contentOverrides";

// Merge sorting + term-match questions into each topic's quiz array at runtime
function mergeExtraQuestions(modules, sortingMap = {}, termMatchMap = {}) {
  return modules.map((m) => ({
    ...m,
    topics: m.topics.map((t) => ({
      ...t,
      quiz: [...(sortingMap[t.id] || []), ...(termMatchMap[t.id] || []), ...t.quiz],
    })),
  }));
}

export const PASS_THRESHOLD = 70;
export const FINAL_PASS_THRESHOLD = 75;
export const XP_PER_CORRECT = 10;
export const XP_FIRST_PASS_BONUS = 25;
export const DAILY_XP_BONUS = 15;

// ---------------------------------------------------------------------------
// COURSE_DEFS — one entry per course. Each entry declares its raw curriculum
// pieces + sorting/term-match question maps. The engine below auto-merges them
// into the final COURSES array that the rest of the app consumes.
// ---------------------------------------------------------------------------
const COURSE_DEFS = [
  {
    id: "ifrs-commodities",
    title: "IFRS & Commodity Trading",
    subtitle: "IFRS · Commodities",
    description: "Master IFRS accounting standards (IFRS 15, IFRS 9, IAS 2, IFRS 16, IAS 37) and physical commodity trading — with a focus on African coal and sulphur markets.",
    category: "Finance & Accounting",
    level: "Intermediate",
    certificateText: "IFRS Accounting Standards & Physical Commodity Trading — with specialization in African coal and sulphur markets",
    icon: "TrendingUp",
    gradient: "from-emerald-500/10 to-teal-500/5",
    modules: IFRS_MODULES,
    finalAssessment: IFRS_FINAL,
    glossary: IFRS_GLOSSARY,
    expertQuestions: IFRS_EXPERT,
    difficultyLevels: IFRS_DIFF,
    sortingQuestions: IFRS_SORTING_QUESTIONS,
    termMatchQuestions: IFRS_TERM_MATCH_QUESTIONS,
  },
  {
    id: "openfinance",
    title: "Open Finance & Open Banking",
    subtitle: "Open Finance · UAE",
    description: "Master Open Finance and Open Banking essentials — covering the UAE CBUAE framework, Nebras API Hub, FDX standards, OAuth 2.0/FAPI security, and real-world use cases.",
    category: "Fintech & Regulation",
    level: "Intermediate",
    certificateText: "Open Finance & Open Banking — with specialization in the UAE CBUAE Open Finance framework",
    icon: "Building2",
    gradient: "from-blue-500/10 to-indigo-500/5",
    modules: OF_MODULES,
    finalAssessment: OF_FINAL,
    glossary: OF_GLOSSARY,
    expertQuestions: OF_MODULES.flatMap((m) => m.topics).flatMap((t) => t.quiz).slice(0, 20),
    difficultyLevels: IFRS_DIFF,
    sortingQuestions: OPENFINANCE_SORTING_QUESTIONS,
    termMatchQuestions: OPENFINANCE_TERM_MATCH_QUESTIONS,
  },
];

// Engine: transform each COURSE_DEF into the final course object by merging
// sorting/term-match questions into the module topics. Everything downstream
// (catalog, dashboard, quizzes, admin export) consumes this single array.
const _builtinCourses = COURSE_DEFS.map(({ sortingQuestions, termMatchQuestions, modules, ...course }) => ({
  ...course,
  modules: mergeExtraQuestions(modules, sortingQuestions, termMatchQuestions),
}));

// COURSES is a mutable array — starts with built-in courses; custom courses from
// the database are merged in at runtime by syncCustomCourses (called from
// CoursesContext). This lets getCourse() and getGlobalDailyTopic() see custom
// courses without any other file changing.
export const COURSES = [..._builtinCourses];

let _customCourses = [];

// The single place courses are assembled. Admin question overrides are applied
// HERE rather than at each surface, so module quizzes, topic quizzes, practice,
// the daily/mixed review SRS pool, expert questions and the final assessment all
// inherit suppressions and replacements automatically — there is no per-surface
// filter to forget when a new surface is added.
// A course id must appear exactly once. Duplicates have shown up in practice
// from stale localStorage written before downloadCourse deduped its records —
// the same course then rendered twice in the catalog. Deduping here fixes
// existing bad data and any future path that adds a course twice, rather than
// relying on every writer to behave.
function dedupeById(courses) {
  const byId = new Map();
  for (const c of courses) {
    if (!c?.id) continue;
    // First wins: built-in courses are pushed before customs, so a custom copy
    // can never shadow a built-in of the same id.
    if (!byId.has(c.id)) byId.set(c.id, c);
  }
  return [...byId.values()];
}

function rebuildCourses() {
  COURSES.length = 0;
  // Order matters: content edits (lesson text, module overviews) are applied
  // before question overrides, so a replaced question is matched against the
  // question set as it actually stands.
  COURSES.push(
    ...applyCourseOverrides(
      applyOverridesToCourses(
        applyContentOverrides(dedupeById([..._builtinCourses, ..._customCourses]))
      )
    )
  );
}

// Sync downloaded custom courses (loaded from local storage by CoursesContext)
// into the COURSES array. Rebuilds the array from built-in + custom each time.
export function syncCustomCourses(customCourses) {
  _customCourses = customCourses;
  rebuildCourses();
}

// Called once overrides have been read from Supabase, and again whenever an
// admin suppresses, reinstates or replaces a question.
export function applyQuestionOverrides(rows) {
  setOverrideIndex(indexOverrides(rows || []));
  rebuildCourses();
}

// Admin-edited course body text (module overviews, topic titles, lesson markdown).
export function applyContentTextOverrides(rows) {
  setContentOverrideIndex(indexContentOverrides(rows || []));
  rebuildCourses();
}

// Admin-edited course display text (title, subtitle, certificate name/blurb).
export function applyCourseTextOverrides(rows) {
  setCourseOverrideIndex(indexCourseOverrides(rows || []));
  rebuildCourses();
}

// --- Catalog ID hygiene ---
//
// Topic and module ids are only required to be unique WITHIN a course, and
// everything that stores per-learner state keys by course id as well, so a
// collision across courses is not itself corrupting. It is still worth
// surfacing: a course whose ids are unprefixed ("m1", "m1t1") will collide with
// every other unprefixed course, and each collision is a place where any future
// feature that keys by bare topic id becomes a data bug. Prefixing ids per
// course (e.g. "uaeb_m1t1") keeps the catalog expandable without that risk.
//
// Returns [{ id, kind, courses: [courseId, ...] }] for ids used by more than one
// course. Used by the admin catalog audit.
export function findIdCollisions(courses = COURSES) {
  const topics = new Map();
  const modules = new Map();

  for (const course of courses) {
    for (const m of course.modules || []) {
      if (m.id) {
        if (!modules.has(m.id)) modules.set(m.id, new Set());
        modules.get(m.id).add(course.id);
      }
      for (const t of m.topics || []) {
        if (!t.id) continue;
        if (!topics.has(t.id)) topics.set(t.id, new Set());
        topics.get(t.id).add(course.id);
      }
    }
  }

  const out = [];
  for (const [kind, map] of [["module", modules], ["topic", topics]]) {
    for (const [id, courseIds] of map) {
      if (courseIds.size > 1) out.push({ id, kind, courses: [...courseIds] });
    }
  }
  return out.sort((a, b) => b.courses.length - a.courses.length || a.id.localeCompare(b.id));
}

// Every topic and module id a course uses, for checking an upload against the
// catalog before it is published.
export function collectCourseIds(course) {
  const ids = new Set();
  for (const m of course?.modules || []) {
    if (m.id) ids.add(m.id);
    for (const t of m.topics || []) if (t.id) ids.add(t.id);
  }
  return ids;
}

export function getCourse(courseId) {
  return COURSES.find((c) => c.id === courseId) || null;
}

// --- Course-aware curriculum helpers ---

export function getTopic(course, topicId) {
  if (!course) return null;
  for (const m of course.modules) {
    const t = m.topics.find((x) => x.id === topicId);
    if (t) return { module: m, topic: t };
  }
  return null;
}

export function moduleProgress(course, module, completedTopics) {
  const total = module.topics.length;
  const done = module.topics.filter((t) => completedTopics.includes(t.id)).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function isModuleUnlocked(course, moduleIndex, completedTopics, unlockAll = false) {
  if (unlockAll) return true;
  if (moduleIndex === 0) return true;
  // A module you have already finished stays open, however you finished it —
  // working through the lessons or testing out via its quiz. Without this, a
  // module tested out of ahead of its predecessor rendered locked and greyed
  // while showing full progress, and its lessons could not be reopened.
  const mod = course.modules[moduleIndex];
  if (mod.topics.length > 0 && mod.topics.every((t) => completedTopics.includes(t.id))) return true;
  const prev = course.modules[moduleIndex - 1];
  return prev.topics.every((t) => completedTopics.includes(t.id));
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleQuestionOptions(question) {
  if (question.questionType && question.questionType !== "multiple-choice") return question;
  const indices = question.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...question,
    options: indices.map((i) => question.options[i]),
    answer: indices.indexOf(question.answer),
  };
}

// Randomly convert ~60% of plain multiple-choice questions to varied types
// (flashcard or fill-in-the-blank), mixing question types within each quiz
// for varied active recall. Fill-in-the-blank is only used when the correct
// answer is short enough to type.
export function diversifyQuestionTypes(question) {
  if (question.questionType && question.questionType !== "multiple-choice") return question;
  if (!question.options || question.answer == null) return question;
  if (Math.random() < 0.60) {
    const correctText = question.options[question.answer];
    const types = ["flashcard"];
    // Only use fill-in-the-blank for short answers that are practical to type
    if (correctText.length <= 45) {
      types.push("fill-in-the-blank");
    }
    const chosenType = types[Math.floor(Math.random() * types.length)];

    if (chosenType === "flashcard") {
      return {
        ...question,
        questionType: "flashcard",
        answerText: correctText + (question.explain ? ". " + question.explain : ""),
      };
    }
    if (chosenType === "fill-in-the-blank") {
      return {
        ...question,
        questionType: "fill-in-the-blank",
        q: question.q + " _______",
        answerText: correctText,
      };
    }
  }
  return question;
}

// Diversify a quiz array: interleave MCQ at every even position with a cycling
// non-MCQ type (flashcard → fill-in-the-blank → sorting) at every odd position.
// Pre-typed sorting questions fill the sorting slot; MCQs are converted for
// flashcard and fill-in-the-blank slots. Falls back gracefully when pools run out.
// `allowSelfGraded: false` excludes flashcards. A flashcard is marked by the
// learner tapping "I Remembered This", which is fine for practice but cannot be
// used in a graded certification exam — it would let anyone mark themselves
// correct. Fill-in-the-blank, sorting and term-match are all checked against a
// definitive answer, so they stay.
export function diversifyQuizArray(questions, { allowSelfGraded = true } = {}) {
  if (!questions || questions.length === 0) return [];

  // Partition: plain MCQ vs pre-typed sorting/term-match
  const mcqPool = [];
  const sortingPool = [];
  const termMatchPool = [];
  for (const q of questions) {
    if (q.questionType === "sorting") sortingPool.push(q);
    else if (q.questionType === "term-match") termMatchPool.push(q);
    else mcqPool.push(q);
  }

  function toFlashcard(q) {
    const correctText = q.options?.[q.answer] || "";
    return { ...q, questionType: "flashcard", answerText: correctText + (q.explain ? ". " + q.explain : "") };
  }
  function toFillBlank(q) {
    const correctText = q.options?.[q.answer] || "";
    return { ...q, questionType: "fill-in-the-blank", q: q.q + " _______", answerText: correctText };
  }
  function canFillBlank(q) {
    const t = q.options?.[q.answer] || "";
    return t.length > 0 && t.length <= 45;
  }
  function isPlainMcq(q) {
    return !q.questionType || q.questionType === "multiple-choice";
  }

  const nonMcqTypes = allowSelfGraded
    ? ["flashcard", "fill-in-the-blank", "sorting", "term-match"]
    : ["fill-in-the-blank", "sorting", "term-match"];
  let cycleIdx = 0;

  function takePlainMcq() {
    const idx = mcqPool.findIndex(isPlainMcq);
    if (idx >= 0) return mcqPool.splice(idx, 1)[0];
    if (mcqPool.length > 0) return mcqPool.shift();
    return null;
  }

  function takeNonMcq() {
    for (let attempt = 0; attempt < nonMcqTypes.length; attempt++) {
      const type = nonMcqTypes[(cycleIdx + attempt) % nonMcqTypes.length];

      if (type === "sorting" && sortingPool.length > 0) {
        cycleIdx = (cycleIdx + attempt + 1) % nonMcqTypes.length;
        return sortingPool.shift();
      }
      if (type === "term-match" && termMatchPool.length > 0) {
        cycleIdx = (cycleIdx + attempt + 1) % nonMcqTypes.length;
        return termMatchPool.shift();
      }
      if (type === "flashcard") {
        const idx = mcqPool.findIndex(isPlainMcq);
        if (idx >= 0) {
          cycleIdx = (cycleIdx + attempt + 1) % nonMcqTypes.length;
          return toFlashcard(mcqPool.splice(idx, 1)[0]);
        }
      }
      if (type === "fill-in-the-blank") {
        const idx = mcqPool.findIndex((q) => isPlainMcq(q) && canFillBlank(q));
        if (idx >= 0) {
          cycleIdx = (cycleIdx + attempt + 1) % nonMcqTypes.length;
          return toFillBlank(mcqPool.splice(idx, 1)[0]);
        }
      }
    }
    if (sortingPool.length > 0) return sortingPool.shift();
    if (termMatchPool.length > 0) return termMatchPool.shift();
    if (mcqPool.length > 0) return mcqPool.shift();
    return null;
  }

  const result = [];
  for (let i = 0; i < questions.length; i++) {
    let q;
    if (i % 2 === 0) {
      q = takePlainMcq();
      if (!q) q = takeNonMcq();
    } else {
      q = takeNonMcq();
      if (!q) q = takePlainMcq();
    }
    if (q) result.push(q);
  }

  return result;
}

export function getQuizQuestions(course, difficulty, count) {
  let pool;
  if (difficulty === "expert") {
    pool = course.expertQuestions;
  } else {
    const level = course.difficultyLevels.find((l) => l.id === difficulty);
    if (!level || !level.moduleRange) {
      pool = course.modules.flatMap((m) => m.topics.flatMap((t) => t.quiz.map((q) => ({ ...q, _topicId: t.id }))));
    } else {
      const [start, end] = level.moduleRange;
      const topics = course.modules.slice(start, end).flatMap((m) => m.topics);
      pool = topics.flatMap((t) => t.quiz.map((q) => ({ ...q, _topicId: t.id })));
    }
  }
  return diversifyQuizArray(shuffle(pool).slice(0, Math.min(count, pool.length)).map(shuffleQuestionOptions));
}

// Total number of items in a module quiz, dilemmas included. Callers subtract
// the dilemma count so the learner always sees exactly MODULE_QUIZ_LENGTH.
export const MODULE_QUIZ_LENGTH = 20;


// Build the final exam question pool.
//
// The authored FINAL_ASSESSMENT arrays are entirely multiple-choice, so on their
// own the exam could never contain a sorting or term-match question no matter
// how it was rendered. The pre-typed types live in the module topic pools, so
// the pool is widened to include them.
//
// Flashcards are the one exclusion: they are graded by the learner tapping "I
// Remembered This", which cannot decide a certification. Every other type is
// checked against a definitive answer.
//
// Exam LENGTH is unchanged — typed questions take slots rather than being added
// on top, so the exam doesn't silently get longer. They are capped at roughly a
// third so the exam stays anchored in its authored content.
export function buildFinalExamPool(course) {
  const authored = (course?.finalAssessment || []).filter((q) => q.questionType !== "flashcard");
  if (authored.length === 0) return [];

  const typed = (course?.modules || [])
    .flatMap((m) => (m.topics || []).map((t) => ({ t, m })))
    .flatMap(({ t }) => (t.quiz || []).map((q) => ({ ...q, _topicId: t.id })))
    .filter((q) => q.questionType && q.questionType !== "flashcard" && q.questionType !== "multiple-choice");

  const total = authored.length;
  const typedSlots = Math.min(typed.length, Math.floor(total / 3));
  const picked = [
    ...shuffle(typed).slice(0, typedSlots),
    ...shuffle(authored).slice(0, total - typedSlots),
  ];
  return shuffle(picked);
}

export function getModuleQuiz(course, moduleIndex, limit = MODULE_QUIZ_LENGTH) {
  const module = course.modules[moduleIndex];
  if (!module) return [];
  return shuffle(module.topics.flatMap((t) => t.quiz.map((q) => ({ ...q, _topicId: t.id })))).slice(0, Math.max(0, limit));
}

// Find the next unfinished step in a course: first incomplete topic, or a module quiz not yet passed.
export function getNextStep(course, completedTopics, quizScores) {
  for (const module of course.modules) {
    for (const topic of module.topics) {
      if (!completedTopics.includes(topic.id)) {
        return { type: "lesson", topic, module };
      }
    }
    // All topics in this module done — check module quiz
    const quizId = `module_${module.id}`;
    const quizScore = quizScores?.[quizId]?.percent;
    if (quizScore == null || quizScore < PASS_THRESHOLD) {
      return { type: "quiz", module };
    }
  }
  return null;
}

export function getDailyTopic(course, date = new Date()) {
  const allTopics = course.modules.flatMap((m) => m.topics);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return allTopics[dayOfYear % allTopics.length];
}

// Get a daily topic across ALL courses (for the global daily lesson feature)
export function getGlobalDailyTopic(date = new Date()) {
  const allTopics = COURSES.flatMap((c) => c.modules.flatMap((m) => m.topics));
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000);
  const topic = allTopics[dayOfYear % allTopics.length];
  // Find which course this topic belongs to
  for (const c of COURSES) {
    for (const m of c.modules) {
      if (m.topics.some((t) => t.id === topic.id)) {
        return { course: c, topic };
      }
    }
  }
  return { course: COURSES[0], topic };
}