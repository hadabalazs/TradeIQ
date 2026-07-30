import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  Trophy,
  Flame,
  Sparkles,
  Brain,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";
import { useCourses } from "@/lib/CoursesContext";
import { useAuth } from "@/lib/AuthContext";
import { courseMastery, retentionScore } from "@/lib/srs";
import { PASS_THRESHOLD } from "@/lib/courses";
import Certificate from "@/components/tradeiq/Certificate";

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-tiq-border bg-white p-4">
      <Icon className="w-5 h-5 text-tiq-mint mb-2" />
      <p className="font-slab text-2xl text-tiq-ink font-bold leading-none mb-1">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// Achievements: certificates earned, plus what the learner has actually done
// across every course. Separate from a course dashboard, which only ever shows
// one course at a time.
export default function Achievements() {
  const { progress } = useProgress();
  const { courses } = useCourses();
  const { user } = useAuth();
  const [openCert, setOpenCert] = useState(null);

  const stats = useMemo(() => {
    let topicsDone = 0;
    let totalTopics = 0;
    let quizzesPassed = 0;
    let quizScoreSum = 0;
    let quizScoreCount = 0;
    let masteredSum = 0;
    let masteryTotal = 0;
    const started = [];
    const certified = [];

    for (const course of courses || []) {
      const cp = progress?.courses?.[course.id];
      const courseTopics = (course.modules || []).reduce((s, m) => s + (m.topics || []).length, 0);
      totalTopics += courseTopics;
      if (!cp) continue;

      const done = (cp.completed_topics || []).length;
      topicsDone += done;

      const scores = Object.values(cp.quiz_scores || {});
      for (const s of scores) {
        if (typeof s?.percent !== "number") continue;
        quizScoreCount += 1;
        quizScoreSum += s.percent;
        if (s.percent >= PASS_THRESHOLD) quizzesPassed += 1;
      }

      const m = courseMastery(course, progress);
      masteredSum += m.mastered;
      masteryTotal += m.total;

      const hasActivity = done > 0 || scores.length > 0 || cp.enrolled || cp.certified;
      if (hasActivity) {
        started.push({
          course,
          done,
          courseTopics,
          pct: courseTopics ? Math.round((done / courseTopics) * 100) : 0,
          mastery: m,
          finalScore: cp.final_assessment_score || 0,
          certified: !!cp.certified,
        });
      }
      if (cp.certified) certified.push({ course, score: cp.final_assessment_score || 0 });
    }

    return {
      topicsDone,
      totalTopics,
      quizzesPassed,
      avgQuiz: quizScoreCount ? Math.round(quizScoreSum / quizScoreCount) : null,
      masteredPct: masteryTotal ? Math.round((masteredSum / masteryTotal) * 100) : null,
      masteredCount: masteredSum,
      started: started.sort((a, b) => b.pct - a.pct),
      certified,
    };
  }, [courses, progress]);

  const retention = retentionScore();
  const learnerName = progress?.user_name || user?.email?.split("@")[0] || "Your Name";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
          <ArrowLeft className="w-4 h-4" /> All Courses
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Award className="w-6 h-6 text-tiq-gold" />
        <h1 className="font-slab text-2xl sm:text-3xl text-tiq-ink font-bold">My Achievements</h1>
      </div>
      <p className="text-slate-600 mb-6">
        Certificates you've earned, and what you've covered across every course.
      </p>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Sparkles}
          label="Total XP"
          value={progress?.total_xp || 0}
          hint={`Level ${Math.floor((progress?.total_xp || 0) / 100) + 1}`}
        />
        <StatCard
          icon={Flame}
          label="Day streak"
          value={progress?.streak_count || 0}
          hint={`Best: ${progress?.best_streak || 0}`}
        />
        <StatCard
          icon={BookOpen}
          label="Lessons completed"
          value={`${stats.topicsDone}/${stats.totalTopics}`}
        />
        <StatCard icon={Trophy} label="Certificates" value={stats.certified.length} />
      </div>

      {/* Learning quality */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={Target}
          label="Quizzes passed"
          value={stats.quizzesPassed}
          hint={stats.avgQuiz != null ? `Average score ${stats.avgQuiz}%` : "No quizzes yet"}
        />
        <StatCard
          icon={Brain}
          label="Questions mastered"
          value={stats.masteredCount}
          hint={stats.masteredPct != null ? `${stats.masteredPct}% of what you've learned` : undefined}
        />
        <StatCard
          icon={CheckCircle2}
          label="Predicted retention"
          value={retention != null ? `${retention}%` : "—"}
          hint={retention != null ? "Chance you'd recall a random item now" : "Review something to measure this"}
        />
      </div>

      {/* Certificates */}
      <h2 className="font-slab text-lg text-tiq-ink font-bold mb-3">Certificates</h2>
      {stats.certified.length === 0 ? (
        <div className="rounded-xl border border-tiq-border bg-tiq-mintLight/40 p-6 text-center mb-10">
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-1">No certificates yet.</p>
          <p className="text-xs text-slate-500">
            Complete every lesson in a course and pass its final assessment to earn one.
          </p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4 mb-10">
          {stats.certified.map(({ course, score }) => (
            <li key={course.id}>
              <button
                onClick={() => setOpenCert({ course, score })}
                className="w-full text-left rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 hover:border-emerald-500/50 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-tiq-ink truncate">{course.title}</p>
                  <p className="text-xs text-slate-500">Final score {score}% · Certified</p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Per-course breakdown */}
      <h2 className="font-slab text-lg text-tiq-ink font-bold mb-3">Course progress</h2>
      {stats.started.length === 0 ? (
        <div className="rounded-xl border border-tiq-border bg-tiq-mintLight/40 p-6 text-center">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-3">You haven't started a course yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition"
          >
            Browse courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {stats.started.map(({ course, done, courseTopics, pct, mastery, certified: isCert, finalScore }) => (
            <li key={course.id} className="rounded-xl border border-tiq-border bg-white p-4">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <Link
                  to={`/course/${course.id}`}
                  className="text-sm font-semibold text-tiq-ink hover:text-tiq-mint transition"
                >
                  {course.title}
                </Link>
                {isCert ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                    <Award className="w-3.5 h-3.5" /> Certified · {finalScore}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 shrink-0">{pct}% complete</span>
                )}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-1.5 bg-tiq-mintLight rounded-full overflow-hidden">
                  <div className="h-full bg-tiq-mint rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-mono-tiq text-slate-500 shrink-0">{done}/{courseTopics}</span>
              </div>
              <p className="text-xs text-slate-500">
                {mastery.total > 0
                  ? `${mastery.mastered} of ${mastery.total} questions mastered${
                      mastery.fading > 0 ? ` · ${mastery.fading} fading` : ""
                    }`
                  : "No review history yet"}
              </p>
            </li>
          ))}
        </ul>
      )}

      {openCert && (
        <div
          className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenCert(null)}
        >
          <div className="w-full max-w-3xl my-6" onClick={(e) => e.stopPropagation()}>
            <Certificate
              course={openCert.course}
              name={learnerName}
              score={openCert.score}
              date={new Date()}
            />
            <div className="text-center mt-3">
              <button
                onClick={() => setOpenCert(null)}
                className="px-4 py-2 rounded-lg bg-white border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
