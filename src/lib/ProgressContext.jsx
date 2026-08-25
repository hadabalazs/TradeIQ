import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { notifyDataChanged } from "@/lib/sync";
import {
  COURSES,
  PASS_THRESHOLD,
  XP_PER_CORRECT,
  XP_FIRST_PASS_BONUS,
} from "@/lib/courses";

const STORAGE_KEY = "tradeiq_progress";

function defaultCourseProgress() {
  return {
    completed_topics: [],
    quiz_scores: {},
    passed_first_time: [],
    certified: false,
    final_assessment_score: 0,
    unlock_all: false,
    // Explicit opt-in to a course. Replaces the old knowledge-level prompt,
    // which recorded an answer nothing ever read. Drives the "My Courses"
    // section on the catalog.
    enrolled: false,
    enrolled_at: null,
    knowledge_level: "beginner",
    level_set: false,
  };
}

const DEFAULT_PROGRESS = {
  user_name: "",
  knowledge_level: "beginner",
  onboarded: false,
  total_xp: 0,
  streak_count: 0,
  best_streak: 0,
  daily_history: [],
  // Every day with any study activity. daily_history is the narrower "completed
  // the Daily Recap" set; the calendar shows both.
  active_history: [],
  last_daily_date: null,
  last_active_date: null,
  // Most recent Knowledge Check result, and a trimmed history of scores so
  // progress over time is visible without storing every question ever answered.
  last_assessment: null,
  assessment_history: [],
  srs_data: {},
  courses: {},
};

// Ensure every course has a progress object
function ensureCourses(progress) {
  const courses = { ...(progress.courses || {}) };
  for (const c of COURSES) {
    if (!courses[c.id]) {
      courses[c.id] = defaultCourseProgress();
    }
  }
  return { ...progress, courses };
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProgress(ensureCourses({ ...DEFAULT_PROGRESS, ...parsed }));
      } else {
        setProgress(ensureCourses({ ...DEFAULT_PROGRESS }));
      }
    } catch {
      setProgress(ensureCourses({ ...DEFAULT_PROGRESS }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    (updates) => {
      if (!progress) return null;
      const updated = ensureCourses({ ...progress, ...updates });
      setProgress(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      notifyDataChanged();
      return updated;
    },
    [progress]
  );

  // Get the progress object for a specific course
  const getCourseProgress = useCallback(
    (courseId) => {
      if (!progress) return defaultCourseProgress();
      return progress.courses?.[courseId] || defaultCourseProgress();
    },
    [progress]
  );

  // Update a specific course's progress
  const saveCourseProgress = useCallback(
    (courseId, courseUpdates) => {
      if (!progress) return null;
      const current = progress.courses?.[courseId] || defaultCourseProgress();
      const updatedCourse = { ...current, ...courseUpdates };
      return save({
        courses: { ...(progress.courses || {}), [courseId]: updatedCourse },
      });
    },
    [progress, save]
  );

  // Record a quiz result for a topic in a specific course
  const recordQuiz = useCallback(
    (courseId, topicId, correct, total) => {
      if (!progress) return null;
      const courseProg = getCourseProgress(courseId);
      const percent = total ? Math.round((correct / total) * 100) : 0;
      const passed = percent >= PASS_THRESHOLD;

      const prevScore = courseProg.quiz_scores?.[topicId]?.percent ?? -1;
      const isFirstPass =
        passed && !(courseProg.passed_first_time || []).includes(topicId);

      let xpGain = correct * XP_PER_CORRECT;
      if (isFirstPass) xpGain += XP_FIRST_PASS_BONUS;

      const newScores = { ...(courseProg.quiz_scores || {}) };
      if (percent >= prevScore) {
        newScores[topicId] = { correct, total, percent };
      }

      const completed = new Set(courseProg.completed_topics || []);
      if (passed) completed.add(topicId);

      // Working through the topic itself supersedes having been credited for it
      // by a module quiz, so it graduates to a fully-completed topic.
      const viaQuiz = new Set(courseProg.quiz_completed_topics || []);
      if (passed) viaQuiz.delete(topicId);

      const firstPass = new Set(courseProg.passed_first_time || []);
      if (isFirstPass) firstPass.add(topicId);

      const activityUpdate = computeActivityStreakUpdate(progress);
      // Single atomic save — course progress + global XP + streak together
      save({
        courses: {
          ...(progress.courses || {}),
          [courseId]: {
            ...courseProg,
            quiz_scores: newScores,
            completed_topics: Array.from(completed),
            quiz_completed_topics: Array.from(viaQuiz),
            passed_first_time: Array.from(firstPass),
          },
        },
        total_xp: (progress.total_xp || 0) + xpGain,
        ...(activityUpdate || {}),
      });

      return { percent, passed, xpGain, isFirstPass };
    },
    [progress, getCourseProgress, saveCourseProgress, save]
  );

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setProgress(ensureCourses({ ...DEFAULT_PROGRESS }));
  }, []);

  const resetCourseProgress = useCallback((courseId) => {
    if (!progress) return;
    saveCourseProgress(courseId, defaultCourseProgress());
  }, [progress, saveCourseProgress]);

  const recordDailyComplete = useCallback(() => {
    if (!progress) return null;
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const history = progress.daily_history || [];
    if (history.includes(today)) return { alreadyDone: true };

    const activityUpdate = computeActivityStreakUpdate(progress);

    save({
      ...(activityUpdate || {}),
      last_daily_date: today,
      daily_history: [...history, today],
      total_xp: (progress.total_xp || 0) + 15,
    });

    return { alreadyDone: false, ...(activityUpdate || {}) };
  }, [progress, save]);

  // Store a scored Knowledge Check. The full result is kept so the improvement
  // session knows which topics were weak; the history keeps only headline scores.
  const recordAssessment = useCallback(
    (result) => {
      if (!progress || !result) return null;
      const history = [...(progress.assessment_history || []), {
        date: result.date,
        pct: result.pct,
        correct: result.correct,
        total: result.total,
      }].slice(-20);

      const activityUpdate = computeActivityStreakUpdate(progress);
      save({
        ...(activityUpdate || {}),
        last_assessment: result,
        assessment_history: history,
      });
      return result;
    },
    [progress, save]
  );

  const recordActivity = useCallback(() => {
    if (!progress) return null;
    const updates = computeActivityStreakUpdate(progress);
    if (updates) save(updates);
    return updates;
  }, [progress, save]);

  const value = {
    progress,
    loading,
    save,
    getCourseProgress,
    saveCourseProgress,
    recordQuiz,
    recordDailyComplete,
    recordAssessment,
    recordActivity,
    resetProgress,
    resetCourseProgress,
    reload: load,
  };
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

// Whether a course belongs on the learner's own list.
//
// "Mine" means explicitly enrolled OR already under way. Activity has to count,
// because learners who started before there was an Enroll button never clicked
// one — without this their in-progress courses would drop off their own list.
//
// Nothing enrols anyone automatically: `enrolled` defaults to false and is only
// set by the Enroll button. The catalog, the sidebar and My Achievements all
// call this so the three cannot disagree about what someone is taking.
export function isEnrolledIn(progress, courseId) {
  const cp = progress?.courses?.[courseId];
  if (!cp) return false;
  return (
    !!cp.enrolled ||
    !!cp.certified ||
    (cp.completed_topics || []).length > 0 ||
    Object.keys(cp.quiz_scores || {}).length > 0
  );
}

// Completed topics that the course still actually contains.
//
// Stored progress is a list of topic ids, and an id can stop matching: a course
// is edited, or its ids are renamed to remove a collision. Counting the raw list
// then overstates progress — and because "all topics done" unlocks the final
// assessment, a stale id could hand someone a certificate they had not earned.
// Counting against the course itself makes stale entries inert instead.
export function completedInCourse(course, completedTopics) {
  if (!course) return [];
  const real = new Set();
  for (const m of course.modules || []) for (const t of m.topics || []) real.add(t.id);
  return [...new Set(completedTopics || [])].filter((id) => real.has(id));
}

export function overallPercent(course, completedTopics) {
  const total = course.modules.reduce((s, m) => s + m.topics.length, 0);
  const done = completedInCourse(course, completedTopics).length;
  return total ? Math.round((done / total) * 100) : 0;
}

export function levelFromXp(xp) {
  const level = Math.floor((xp || 0) / 100) + 1;
  const intoLevel = (xp || 0) % 100;
  return { level, intoLevel, pct: intoLevel };
}

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Compute activity streak update based on lastActiveDate
export function computeActivityStreakUpdate(progress) {
  if (!progress) return null;
  const now = new Date();
  const today = dateStr(now);
  const lastActive = progress.last_active_date;

  if (lastActive === today) return null;

  const yd = new Date();
  yd.setDate(yd.getDate() - 1);
  const yesterday = dateStr(yd);

  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);
  const twoDaysAgo = dateStr(dayBefore);

  // ISO week key for the streak shield (one free missed day per week)
  const isoWeek = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return `${t.getUTCFullYear()}-W${Math.ceil(((t - yearStart) / 86400000 + 1) / 7)}`;
  };
  const thisWeek = isoWeek(now);

  let newStreak;
  let shieldUpdate = {};
  if (lastActive === yesterday) {
    newStreak = (progress.streak_count || 0) + 1;
  } else if (lastActive === twoDaysAgo && progress.shield_used_week !== thisWeek && (progress.streak_count || 0) > 0) {
    // Missed exactly one day — streak shield absorbs it (once per week)
    newStreak = (progress.streak_count || 0) + 1;
    shieldUpdate = { shield_used_week: thisWeek };
  } else {
    newStreak = 1;
  }
  const bestStreak = Math.max(newStreak, progress.best_streak || 0);

  // Record the day itself, not just the counter. The streak calendar used to
  // read daily_history, which is only written when a Daily Recap is completed —
  // so a learner with a live streak built from lessons and quizzes saw an empty
  // calendar. Seeded from daily_history so days earned before this existed still
  // show up.
  const priorDays = progress.active_history?.length
    ? progress.active_history
    : (progress.daily_history || []);
  const activeHistory = Array.from(new Set([...priorDays, today])).sort();

  return {
    streak_count: newStreak,
    best_streak: bestStreak,
    last_active_date: today,
    active_history: activeHistory,
    ...shieldUpdate,
  };
}

// Compute SRS update for a specific topic based on correctness
export function computeSRSUpdate(progress, topicId, isCorrect) {
  if (!progress || !topicId) return null;
  const srsData = { ...(progress.srs_data || {}) };
  const current = srsData[topicId] || { reviewInterval: 1 };

  const now = new Date();
  let newInterval, newDate;

  if (isCorrect) {
    newInterval = (current.reviewInterval || 1) * 2;
    newDate = new Date(now.getTime() + newInterval * 86400000);
  } else {
    newInterval = 1;
    newDate = new Date(now.getTime() + 86400000);
  }

  srsData[topicId] = {
    nextReviewDate: dateStr(newDate),
    reviewInterval: newInterval,
  };

  return { srs_data: srsData };
}