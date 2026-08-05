// Knowledge Check — assess recall across everything learned, then drill the gaps.
//
// TWO DELIBERATELY DIFFERENT SAMPLING RULES
//
// An assessment must be REPRESENTATIVE. The daily recap front-loads weak and due
// items on purpose, which is right for revision but useless for measurement: if
// you only ever get asked your worst material you always score badly, and the
// number tells you nothing about where you actually stand. So the assessment
// samples evenly — round-robin, one question per topic, shuffled — giving every
// topic the same chance of being examined regardless of how well you know it.
//
// The improvement session is the opposite, and unapologetically biased: it
// weights toward the topics the last assessment found weakest, because there the
// goal is repair rather than measurement.

import { COURSES, getTopic, getCourse, PASS_THRESHOLD, shuffleQuestionOptions } from '@/lib/courses';
import { collectPool } from '@/lib/srs';

export const ASSESSMENT_SIZE = 20;
export const IMPROVE_SIZE = 12;

// A topic scoring below this in an assessment is flagged for review.
export const WEAK_THRESHOLD = PASS_THRESHOLD;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function groupByTopic(pool) {
  const byTopic = new Map();
  for (const q of pool) {
    const key = `${q._courseId}::${q._topicId}`;
    if (!byTopic.has(key)) byTopic.set(key, []);
    byTopic.get(key).push(q);
  }
  return byTopic;
}

// Even coverage: walk the topics in random order taking one question each, and
// keep looping until the cap is reached. With more topics than slots every topic
// gets at most one question; with fewer, coverage deepens evenly rather than
// piling onto whichever topic happened to sort first.
export function buildAssessment(progress, cap = ASSESSMENT_SIZE) {
  const pool = collectPool(progress);
  if (pool.length === 0) return [];

  const byTopic = groupByTopic(pool);
  const topics = shuffle([...byTopic.keys()]);
  const queues = new Map(topics.map((t) => [t, shuffle(byTopic.get(t))]));

  const picked = [];
  let exhausted = false;
  while (picked.length < cap && !exhausted) {
    exhausted = true;
    for (const t of topics) {
      if (picked.length >= cap) break;
      const q = queues.get(t).pop();
      if (q) {
        picked.push(q);
        exhausted = false;
      }
    }
  }
  return picked.map(shuffleQuestionOptions);
}

// Improvement session: weighted toward the weakest topics from the last
// assessment, falling back to SRS retrievability when there is no assessment yet
// (or when a topic wasn't covered by it).
export function buildImprovementSession(progress, assessment, cap = IMPROVE_SIZE) {
  const pool = collectPool(progress);
  if (pool.length === 0) return [];

  const topicScore = new Map();
  for (const t of assessment?.topics || []) {
    topicScore.set(`${t.courseId}::${t.topicId}`, t.pct);
  }

  // Lower is worse, so sort ascending and take from the bottom. Questions in
  // topics the assessment never reached fall back to their retrievability, which
  // is the same 0-100 scale once scaled.
  const ranked = pool
    .map((q) => {
      const key = `${q._courseId}::${q._topicId}`;
      const assessed = topicScore.get(key);
      const weakness = assessed != null ? assessed : Math.round((q._retrievability ?? 1) * 100);
      return { q, weakness };
    })
    .sort((a, b) => a.weakness - b.weakness);

  // Fill the session from genuinely weak material first, and only pad with the
  // next-weakest when there isn't enough of it.
  //
  // Selecting from a fixed-size shortlist instead — the weakest half, or even
  // twice the session length — does NOT do this. Within any such shortlist every
  // question is equally likely, so a topic with many questions crowds out one
  // with few, and a topic scored 0% can end up drawn LESS often than one scored
  // 100%. Splitting on the threshold is what makes weakness actually decide.
  const weak = ranked.filter((r) => r.weakness < WEAK_THRESHOLD);
  const rest = ranked.filter((r) => r.weakness >= WEAK_THRESHOLD);

  const chosen =
    weak.length >= cap
      ? shuffle(weak).slice(0, cap)
      : [...shuffle(weak), ...rest.slice(0, cap - weak.length)];

  return shuffle(chosen).map((x) => shuffleQuestionOptions(x.q));
}

// Turn raw per-topic tallies into a scored assessment: topic percentages rolled
// up into module percentages, plus the topics worth revisiting.
export function scoreAssessment(tallies) {
  const topics = [];
  for (const [key, tally] of Object.entries(tallies || {})) {
    const [courseId, topicId] = key.split('::');
    const course = getCourse(courseId);
    const found = course ? getTopic(course, topicId) : null;
    if (!found) continue;
    const pct = tally.total ? Math.round((tally.correct / tally.total) * 100) : 0;
    topics.push({
      courseId,
      topicId,
      topicTitle: found.topic.title,
      moduleId: found.module.id,
      moduleTitle: found.module.title,
      courseTitle: course.title,
      correct: tally.correct,
      total: tally.total,
      pct,
    });
  }

  // Roll topics up into modules by summing answers, not by averaging topic
  // percentages — a topic that contributed three questions should count for more
  // than one that contributed one.
  const moduleMap = new Map();
  for (const t of topics) {
    const key = `${t.courseId}::${t.moduleId}`;
    const m = moduleMap.get(key) || {
      courseId: t.courseId,
      moduleId: t.moduleId,
      moduleTitle: t.moduleTitle,
      courseTitle: t.courseTitle,
      correct: 0,
      total: 0,
      topics: [],
    };
    m.correct += t.correct;
    m.total += t.total;
    m.topics.push(t);
    moduleMap.set(key, m);
  }

  const modules = [...moduleMap.values()]
    .map((m) => ({ ...m, pct: m.total ? Math.round((m.correct / m.total) * 100) : 0 }))
    .sort((a, b) => a.pct - b.pct);

  const correct = topics.reduce((s, t) => s + t.correct, 0);
  const total = topics.reduce((s, t) => s + t.total, 0);

  return {
    date: new Date().toISOString(),
    correct,
    total,
    pct: total ? Math.round((correct / total) * 100) : 0,
    modules,
    topics: topics.sort((a, b) => a.pct - b.pct),
    weakTopics: topics.filter((t) => t.pct < WEAK_THRESHOLD).sort((a, b) => a.pct - b.pct),
  };
}

// How many topics across all courses are currently in the pool — used to tell the
// learner how much of their material a run can realistically cover.
export function assessableTopicCount(progress) {
  return groupByTopic(collectPool(progress)).size;
}

export function moduleBand(pct) {
  if (pct >= 85) return { label: 'Strong', tone: 'text-emerald-600', bar: 'bg-emerald-500' };
  if (pct >= WEAK_THRESHOLD) return { label: 'Solid', tone: 'text-tiq-mint', bar: 'bg-tiq-mint' };
  if (pct >= 40) return { label: 'Shaky', tone: 'text-amber-600', bar: 'bg-amber-500' };
  return { label: 'Weak', tone: 'text-red-600', bar: 'bg-red-500' };
}

// Course list for the filter, restricted to courses with learned material.
export function assessableCourses(progress) {
  const ids = new Set(collectPool(progress).map((q) => q._courseId));
  return COURSES.filter((c) => ids.has(c.id));
}
