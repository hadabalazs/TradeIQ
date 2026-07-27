import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flame, CheckCircle2, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { Shuffle } from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";
import { buildDailyQueue, buildMixedReview, dueCount } from "@/lib/srs";
import PracticeQuiz from "@/components/tradeiq/PracticeQuiz";
import StreakCalendar from "@/components/tradeiq/StreakCalendar";

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
  const [quizStarted, setQuizStarted] = useState(false);
  const [mixedQuestions, setMixedQuestions] = useState(null);

  const alreadyDone = (progress?.daily_history || []).includes(todayStr());

  // FSRS queue: due reviews first (weakest memories first), then new material.
  const recapQuestions = useMemo(() => buildDailyQueue(progress, 12), [progress]);
  const due = useMemo(() => dueCount(progress), [progress]);

  const hasQuestions = recapQuestions.length > 0;

  const handleComplete = async (correct, total) => {
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
                <p className="text-slate-600 text-sm mb-4">
                  Come back tomorrow to keep your streak alive.
                </p>
                {hasQuestions && (
                  <button
                    onClick={() => { setMixedQuestions(buildMixedReview(progress, 15)); setQuizStarted(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm font-medium"
                  >
                    <Shuffle className="w-4 h-4" /> Extra: Mixed Review
                  </button>
                )}
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
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
                  >
                    Start Daily Recap ({recapQuestions.length} questions{due > 0 ? ` · ${due} due` : ""})
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setMixedQuestions(buildMixedReview(progress, 15)); setQuizStarted(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm font-medium"
                    title="Interleaved session across all courses — your weakest items, mixed topics and formats"
                  >
                    <Shuffle className="w-4 h-4" /> Mixed Review
                  </button>
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
            mixedQuestions ? (
              <PracticeQuiz
                questions={mixedQuestions}
                onComplete={async () => ({})}
                onExit={() => { setMixedQuestions(null); setQuizStarted(false); }}
                title="Mixed Review"
                exitLabel="Back to Recap"
                overlay
              />
            ) : (
              <PracticeQuiz
                questions={recapQuestions}
                onComplete={handleComplete}
                onExit={() => setQuizStarted(false)}
                title="Daily Recap"
                exitLabel="Back to Recap"
                overlay
              />
            )
          )}
        </div>

        {/* Calendar */}
        <div>
          <StreakCalendar
            history={progress?.daily_history || []}
            streak={progress?.streak_count || 0}
            bestStreak={progress?.best_streak || 0}
          />
        </div>
      </div>
    </div>
  );
}