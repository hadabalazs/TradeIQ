// FSRS-based spaced repetition engine — per-question scheduling.
// Cards are stored in localStorage keyed by a content hash of each question,
// so the same question maps to the same card in every mode (daily, practice, quiz).

import { fsrs, createEmptyCard, Rating, generatorParameters } from "ts-fsrs";
import { COURSES, getTopic, shuffleQuestionOptions } from "@/lib/courses";
import { notifyDataChanged } from "@/lib/sync";

const CARDS_KEY = "tradeiq_srs_cards";
const SNAPSHOT_KEY = "tradeiq_retention_history";

const scheduler = fsrs(generatorParameters({ request_retention: 0.9, maximum_interval: 365 }));

// ---------- Card store ----------

function readCards() {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCards(cards) {
  try { localStorage.setItem(CARDS_KEY, JSON.stringify(cards)); } catch { /* ignore */ }
  notifyDataChanged();
}

// ---------- Question identity ----------

// Re-exported from its own module so the import graph stays acyclic; see
// questionId.js for why the hash being content-derived matters. Imported as
// well as re-exported, since `export ... from` creates no local binding.
import { questionId } from '@/lib/questionId';
import { remapQuestionId } from '@/lib/questionOverrides';

export { questionId };

// Identity used for card storage. A question that has been corrected by an admin
// override resolves to its replacement's id, so review history written before
// the correction still applies afterwards — fixing a typo must not reset
// everyone's spacing on that question.
function cardKey(q) {
  return remapQuestionId(questionId(q));
}

// ---------- Reviewing ----------

export const Grades = {
  AGAIN: Rating.Again, // wrong
  HARD: Rating.Hard,   // correct but guessed / hesitant
  GOOD: Rating.Good,   // correct, knew it
  EASY: Rating.Easy,   // correct, instant
};

function reviveCard(stored) {
  return {
    ...stored,
    due: new Date(stored.due),
    last_review: stored.last_review ? new Date(stored.last_review) : undefined,
  };
}

export function recordReview(question, grade) {
  const id = cardKey(question);
  const cards = readCards();
  const now = new Date();
  const card = cards[id] ? reviveCard(cards[id]) : createEmptyCard(now);
  const result = scheduler.repeat(card, now)[grade];
  const next = result.card;
  const prevDays = cards[id]?.successDays || [];
  const today = now.toISOString().slice(0, 10);
  const successDays = grade === Rating.Again
    ? prevDays
    : Array.from(new Set([...prevDays, today])).slice(-10);
  cards[id] = { ...next, successDays };
  writeCards(cards);
  return cards[id];
}

// ---------- Retrievability & mastery ----------

// FSRS power-law forgetting curve approximation.
export function retrievability(card, now = new Date()) {
  if (!card || !card.stability) return 0;
  const last = card.last_review ? new Date(card.last_review) : null;
  if (!last) return 0;
  const days = Math.max(0, (now - last) / 86400000);
  return Math.pow(1 + days / (9 * card.stability), -1);
}

// Mastery ladder: new -> learning -> reviewing -> mastered
// Mastered = 3+ successful recalls on distinct days AND retrievability still >= 0.9
export function masteryState(card) {
  if (!card) return "new";
  const successes = (card.successDays || []).length;
  if (successes === 0) return "learning";
  if (successes >= 3 && retrievability(card) >= 0.9) return "mastered";
  if (successes >= 3) return "fading";
  return "reviewing";
}

export function isDue(card, now = new Date()) {
  if (!card) return false; // new, not "due"
  return new Date(card.due) <= now;
}

// ---------- Pools & queues ----------

// All questions from completed topics across all courses, annotated with card state.
export function collectPool(progress) {
  const cards = readCards();
  const pool = [];
  for (const course of COURSES) {
    const completed = progress?.courses?.[course.id]?.completed_topics || [];
    for (const topicId of completed) {
      const found = getTopic(course, topicId);
      if (!found || !found.topic.quiz) continue;
      for (const q of found.topic.quiz) {
        const id = cardKey(q);
        const card = cards[id] ? reviveCard(cards[id]) : null;
        pool.push({
          ...q,
          _topicId: topicId,
          _courseId: course.id,
          _card: card,
          _due: isDue(card),
          _isNew: !card,
          _retrievability: card ? retrievability(card) : 1,
        });
      }
    }
  }
  return pool;
}

function interleaveByTopic(items, maxRun = 2) {
  // Greedy re-order so no more than maxRun consecutive items share a topic.
  const remaining = [...items];
  const out = [];
  while (remaining.length) {
    let idx = remaining.findIndex((q) => {
      const runStart = out.length - maxRun;
      if (runStart < 0) return true;
      return !out.slice(runStart).every((o) => o._topicId === q._topicId);
    });
    if (idx === -1) idx = 0;
    out.push(remaining.splice(idx, 1)[0]);
  }
  return out;
}

// Daily queue: due cards first (weakest memory first), then new, then fill.
export function buildDailyQueue(progress, cap = 12) {
  const pool = collectPool(progress);
  const shuffle = (a) => a.sort(() => Math.random() - 0.5);
  const due = pool.filter((q) => q._due).sort((a, b) => a._retrievability - b._retrievability);
  const fresh = shuffle(pool.filter((q) => q._isNew));
  const rest = shuffle(pool.filter((q) => !q._due && !q._isNew));
  const selected = [...due, ...fresh, ...rest].slice(0, Math.min(cap, pool.length));
  return interleaveByTopic(selected.map(shuffleQuestionOptions));
}

export function dueCount(progress) {
  return collectPool(progress).filter((q) => q._due).length;
}

// Same selection rule as the global recap, restricted to one course — for
// learners who want to revise a single subject rather than everything at once.
export function buildCourseQueue(progress, courseId, cap = 12) {
  const pool = collectPool(progress).filter((q) => q._courseId === courseId);
  const shuffle = (a) => a.sort(() => Math.random() - 0.5);
  const due = pool.filter((q) => q._due).sort((a, b) => a._retrievability - b._retrievability);
  const fresh = shuffle(pool.filter((q) => q._isNew));
  const rest = shuffle(pool.filter((q) => !q._due && !q._isNew));
  const selected = [...due, ...fresh, ...rest].slice(0, Math.min(cap, pool.length));
  return interleaveByTopic(selected.map(shuffleQuestionOptions));
}

// Per-course totals for the recap list: how much is available and how much is
// actually due right now.
export function courseQueueStats(progress) {
  const stats = new Map();
  for (const q of collectPool(progress)) {
    const s = stats.get(q._courseId) || { total: 0, due: 0 };
    s.total += 1;
    if (q._due) s.due += 1;
    stats.set(q._courseId, s);
  }
  return stats;
}

// ---------- Course / dashboard stats ----------

export function courseMastery(course, progress) {
  const cards = readCards();
  const completed = progress?.courses?.[course.id]?.completed_topics || [];
  let total = 0;
  let mastered = 0;
  let fading = 0;
  for (const topicId of completed) {
    const found = getTopic(course, topicId);
    if (!found || !found.topic.quiz) continue;
    for (const q of found.topic.quiz) {
      total += 1;
      const card = cards[cardKey(q)];
      const state = masteryState(card ? reviveCard(card) : null);
      if (state === "mastered") mastered += 1;
      if (state === "fading") fading += 1;
    }
  }
  return { total, mastered, fading, pct: total ? Math.round((mastered / total) * 100) : 0 };
}

// Mean predicted retrievability across all learned cards, snapshotted daily.
export function retentionScore() {
  const cards = Object.values(readCards()).map(reviveCard);
  const learned = cards.filter((c) => c.stability > 0);
  if (learned.length === 0) return null;
  const now = new Date();
  const mean = learned.reduce((s, c) => s + retrievability(c, now), 0) / learned.length;
  const pct = Math.round(mean * 100);
  try {
    const hist = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "{}");
    hist[now.toISOString().slice(0, 10)] = pct;
    const keys = Object.keys(hist).sort().slice(-30);
    const trimmed = {};
    for (const k of keys) trimmed[k] = hist[k];
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(trimmed));
  } catch { /* ignore */ }
  return pct;
}
