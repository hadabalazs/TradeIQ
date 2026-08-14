import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flame, CheckCircle2, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";
import { useCourses } from "@/lib/CoursesContext";
import { buildDailyQueue, buildCourseQueue, courseQueueStats, dueCount } from "@/lib/srs";
import PracticeQuiz from "@/components/tradeiq/PracticeQuiz";
import StreakCalendar from "@/components/tradeiq/StreakCalendar";
import { getQuizSessionInfo, clearQuizSession } from "@/lib/quizSession";

function isoWeekStr(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${Math.ceil(((t - yearStart) / 86400000 + 1) / 7)}`;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DailyLesson() {
  const { progress, recordDailyComplete } = useProgress();
  const { courses } = useCourses();
  const [quizStarted, setQuizStarted] = useState(false);
  // A per-course recap in progress: { courseId, title, questions }. The global
  // recap is the one that counts for the streak; course recaps are extra revision.
  const [courseSession, setCourseSession] = useState(null);

  const alreadyDone = (progress?.daily_history || []).includes(todayStr());

  // FSRS queue: due reviews first (weakest memories first), then new material.
  const recapQuestions = useMemo(() => buildDailyQueue(progress, 12), [progress]);
  const due = useMemo(() => dueCount(progress), [progress]);
  const perCourse = useMemo(() => courseQueueStats(progress), [progress]);

  // Only courses with something to review — a course you haven't started yet has
  // no questions in the pool and would just be a dead row.
  const courseRecaps = useMemo(
    () =>
      (courses || [])
        .map((c) => ({ course: c, stats: perCourse.get(c.id) }))
        .filter((x) => x.stats?.total > 0)
        .sort((a, b) => b.stats.due - a.stats.due),
    [courses, perCourse]
  );

  const hasQuestions = recapQuestions.length > 0;

  // Entry-point labels have to reflect what the button will actually do. A
  // pending session means pressing it resumes rather than starts, so it says so
  // — and offers an explicit way to abandon the old attempt instead.
  const [sessionTick, setSessionTick] = useState(0);
  const dailyPending = useMemo(
    () => getQuizSessionInfo("daily-recap"),
    // Recheck after a session ends or is discarded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionTick, quizStarted]
  );
  const coursePending = useMemo(
    () => new Map((courses || []).map((c) => [c.id, getQuizSessionInfo(`course-recap::${c.id}`)])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courses, sessionTick, quizStarted]
  );

  const startFreshDaily = () => {
    clearQuizSession("daily-recap");
    setSessionTick((t) => t + 1);
    setQuizStarted(true);
  };

  const startFreshCourseRecap = (course) => {
    clearQuizSession(`course-recap::${course.id}`);
    setSessionTick((t) => t + 1);
    startCourseRecap(course);
  };

  const startCourseRecap = (course) => {
    setCourseSession({
      courseId: course.id,
      title: course.title,
      questions: buildCourseQueue(progress, course.id, 12),
    });
    setQuizStarted(true);
  };

  const exitCourseRecap = () => {
    setCourseSession(null);
    setQuizStarted(false);
  };

  const handleComplete = async () => {
    const res = await recordDailyComplete();
    const xpGain = res?.alreadyDone ? 0 : 15;
    return { xpGain, ...res };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink"
        >
          <ArrowLeft className="w-4 h-4" /> All Courses
        </Link>
      </div>

      {/* Streak banner */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-tiq-mint/5 border border-orange-500/20">
        <Flame className="w-8 h-8 text-orange-500 shrink-0" />
        <div>
          <p className="font-slab text-tiq-ink font-bold">
            {progress?.streak_count || 0} day streak
          </p>
          <p className="text-xs text-slate-500">
            Best: {progress?.best_streak || 0} days ·{" "}
            {alreadyDone
              ? "Today's recap complete — come back tomorrow!"
              : "Complete today's recap to keep it going!"}{" "}
            <span title="One missed day per week is forgiven automatically">
              {progress?.shield_used_week === isoWeekStr() ? "· 🛡️ shield used this week" : "· 🛡️ shield ready"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recap + Quiz */}
        <div className="lg:col-span-2">
          {alreadyDone && !quizStarted ? (
            <div>
              <div className="text-center py-6 mb-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h2 className="font-slab text-xl text-tiq-ink font-bold mb-1">
                  Today's Recap Complete!
                </h2>
                <p className="text-slate-600 text-sm">
                  Come back tomorrow to keep your streak alive — or revise a single
                  course below.
                </p>
              </div>
            </div>
          ) : !quizStarted ? (
            <div>
              <h1 className="font-slab text-2xl text-tiq-ink font-bold mb-2">Daily Recap</h1>
              <p className="text-slate-600 mb-4">
                A quick quiz of random questions pulled from across everything you've learned so far.
                Review past lessons, keep your knowledge fresh, and maintain your streak — one recap a day.
              </p>

              {hasQuestions ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
                  >
                    {dailyPending
                      ? `Resume Daily Recap (question ${dailyPending.current + 1} of ${dailyPending.total})`
                      : `Start Daily Recap (${recapQuestions.length} questions${due > 0 ? ` · ${due} due` : ""})`}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {dailyPending && (
                    <button
                      onClick={startFreshDaily}
                      className="px-4 py-2.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm font-medium"
                    >
                      Start new
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-tiq-mintLight border border-tiq-border text-center">
                  <BookOpen className="w-10 h-10 text-tiq-mint mx-auto mb-3" />
                  <p className="text-slate-600 text-sm mb-2">
                    You haven't completed any lessons yet.
                  </p>
                  <p className="text-slate-500 text-xs mb-4">
                    Complete a few lessons from any course and your daily recap will pull random questions from them.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition"
                  >
                    Browse Courses
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            courseSession ? (
              <PracticeQuiz
                questions={courseSession.questions}
                onComplete={async () => ({})}
                onExit={exitCourseRecap}
                title={`${courseSession.title} — Recap`}
                exitLabel="Back to Recap"
                sessionKey={`course-recap::${courseSession.courseId}`}
                overlay
              />
            ) : (
              <PracticeQuiz
                questions={recapQuestions}
                onComplete={handleComplete}
                onExit={() => setQuizStarted(false)}
                title="Daily Recap"
                exitLabel="Back to Recap"
                sessionKey="daily-recap"
                overlay
              />
            )
          )}

          {/* Per-course recaps. The recap above spans everything learned; these
              narrow it to one subject, and don't affect the streak. */}
          {!quizStarted && courseRecaps.length > 0 && (
            <div className="mt-8">
              <h2 className="font-slab text-base text-tiq-ink font-bold mb-1">
                Recap by course
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                Revise one subject on its own. Doesn't count towards your streak — the
                Daily Recap above does that.
              </p>
              <ul className="space-y-2">
                {courseRecaps.map(({ course, stats }) => {
                  const pending = coursePending.get(course.id);
                  return (
                    <li key={course.id} className="flex items-center gap-2">
                      <button
                        onClick={() => startCourseRecap(course)}
                        className="flex-1 min-w-0 flex items-center gap-3 rounded-lg border border-tiq-border bg-white p-3.5 hover:border-tiq-mint/40 transition text-left"
                      >
                        <BookOpen className="w-4 h-4 text-tiq-mint shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                          <p className="text-xs text-slate-500">
                            {pending ? (
                              <span className="text-tiq-mint font-medium">
                                Resume · question {pending.current + 1} of {pending.total}
                              </span>
                            ) : (
                              <>
                                {stats.total} question{stats.total === 1 ? "" : "s"} learned
                                {stats.due > 0 && (
                                  <span className="text-tiq-mint font-medium"> · {stats.due} due</span>
                                )}
                              </>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                      {pending && (
                        <button
                          onClick={() => startFreshCourseRecap(course)}
                          className="px-3 py-2 rounded-lg border border-tiq-border text-xs text-slate-600 hover:bg-tiq-mintLight transition shrink-0"
                        >
                          Start new
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div>
          <StreakCalendar
            history={progress?.daily_history || []}
            activeDays={progress?.active_history || []}
            streak={progress?.streak_count || 0}
            bestStreak={progress?.best_streak || 0}
          />
        </div>
      </div>
    </div>
  );
}