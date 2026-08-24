import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Trophy, Lock, ArrowRight, Sparkles, Award, TrendingUp, Flame, Zap, Theater, ChevronDown, Brain } from "lucide-react";
import { courseMastery, retentionScore } from "@/lib/srs";
import { getCourse } from "@/lib/courses";
import { useProgress, overallPercent, levelFromXp } from "@/lib/ProgressContext";
import ModuleCard from "@/components/tradeiq/ModuleCard";
import EnrollCourse from "@/components/tradeiq/EnrollCourse";
import CourseIntro from "@/components/tradeiq/CourseIntro";
import DilemmaCard from "@/components/tradeiq/DilemmaCard";
import DilemmaModal from "@/components/tradeiq/DilemmaModal";
import Certificate from "@/components/tradeiq/Certificate";
import { getDilemmasForCourse } from "@/lib/dilemmas";
import { useDilemmaCompletions } from "@/lib/dilemmaProgress";

export default function Dashboard() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { progress } = useProgress();
  const { isCompleted } = useDilemmaCompletions();
  const [selectedDilemma, setSelectedDilemma] = useState(null);
  const [showDilemmas, setShowDilemmas] = useState(false);

  const courseDilemmas = course ? getDilemmasForCourse(course.id) : [];
  const completedDilemmaCount = courseDilemmas.filter((d) => isCompleted(course?.id, d.id)).length;

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Course not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to courses</Link>
      </div>
    );
  }

  const courseProg = progress?.courses?.[course.id] || {};
  const completed = courseProg.completed_topics || [];
  const totalTopics = course.modules.reduce((s, m) => s + m.topics.length, 0);
  const pct = overallPercent(course, completed);
  const { level } = levelFromXp(progress?.total_xp || 0);
  const mastery = courseMastery(course, progress);
  const retention = retentionScore();
  const allDone = completed.length >= totalTopics || courseProg.unlock_all;
  // Treat any prior activity as enrolled, so existing learners are not asked
  // to enrol in a course they are part-way through.
  const hasActivity = completed.length > 0 || Object.keys(courseProg.quiz_scores || {}).length > 0;
  const needsEnroll = !courseProg.enrolled && !hasActivity;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <Link to="/" className="text-xs text-slate-500 hover:text-tiq-ink mb-2 inline-block">← All Courses</Link>
        <h1 className="font-slab text-3xl sm:text-4xl text-tiq-ink font-bold mb-1">
          {course.title}
        </h1>
        <p className="text-slate-600">
          {allDone
            ? "You've completed all modules — take the final assessment to get certified."
            : course.description}
        </p>
      </div>

      {/* What the course is. Shown to everyone: a visitor arriving from a shared
          link needs it to decide, and a returning learner uses it to remember
          where a module sits in the whole. Collapsed to the summary line for
          learners already under way, who do not need the module list repeated
          directly above the module cards. */}
      <CourseIntro course={course} compact={hasActivity} />

      {needsEnroll && <EnrollCourse course={course} />}

      {/* Stats row — every figure here is about the learner's own progress, so
          six zeroes is the whole story for someone who just arrived from a
          shared link. Held back until there is progress to describe. */}
      {!needsEnroll && (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard icon={TrendingUp} label="Course Progress" value={`${pct}%`} />
        <StatCard icon={Brain} label="Mastered" value={`${mastery.pct}%`} sub={mastery.fading > 0 ? `${mastery.fading} fading` : null} />
        <StatCard icon={Zap} label="Retention" value={retention != null ? `${retention}%` : "—"} sub="predicted recall" />
        <StatCard icon={Sparkles} label="Total XP" value={progress?.total_xp || 0} />
        <StatCard icon={Award} label="Level" value={level} />
        <StatCard icon={Trophy} label="Topics Done" value={`${completed.length}/${totalTopics}`} />
      </div>
      )}

      {/* Quick actions — both review what you have already learned, so neither
          does anything until there is something to review. */}
      {!needsEnroll && (
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/daily"
          className="block p-5 rounded-xl bg-white border border-tiq-border hover:border-tiq-mint/40 transition group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-slab text-tiq-ink font-bold">Daily Recap</h3>
              <p className="text-xs text-slate-500">
                {progress?.streak_count || 0} day streak · Best: {progress?.best_streak || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Review random questions from what you've already learned and keep your streak going.
          </p>
        </Link>
        <Link
          to={`/course/${course.id}/practice`}
          className="block p-5 rounded-xl bg-white border border-tiq-border hover:border-tiq-mint/40 transition group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-tiq-mint/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-tiq-mint" />
            </div>
            <div>
              <h3 className="font-slab text-tiq-ink font-bold">Practice Quiz</h3>
              <p className="text-xs text-slate-500">4 difficulty levels · Quiz-only mode</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Test your knowledge with quiz-only mode. Review missed answers at the end.
          </p>
        </Link>
      </div>
      )}

      {/* Final assessment banner */}
      {allDone && (
        <Link
          to={`/course/${course.id}/final`}
          className="block mb-8 p-5 rounded-xl bg-gradient-to-r from-tiq-mint/10 to-tiq-mint/5 border border-tiq-mint/30 hover:border-tiq-mint/50 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-tiq-mint/15 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-tiq-mint" />
            </div>
            <div className="flex-1">
              <h3 className="font-slab text-tiq-ink font-bold">Final Assessment Ready</h3>
              <p className="text-sm text-slate-600">Pass with 75% to earn your TradeIQ Certificate</p>
            </div>
            <ArrowRight className="w-5 h-5 text-tiq-mint group-hover:translate-x-1 transition" />
          </div>
        </Link>
      )}

      {/* Daily Dilemmas — collapsible, hidden by default */}
      {courseDilemmas.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowDilemmas((v) => !v)}
            className="flex items-center gap-2 mb-1 w-full group"
          >
            <Theater className="w-5 h-5 text-tiq-gold shrink-0" />
            <h2 className="font-slab text-xl text-tiq-ink font-bold">Daily Dilemmas</h2>
            <span className="text-xs text-slate-400 ml-1">
              {completedDilemmaCount}/{courseDilemmas.length} completed
            </span>
            <ChevronDown className={`w-5 h-5 text-slate-400 ml-auto transition-transform ${showDilemmas ? "rotate-180" : ""}`} />
          </button>
          {showDilemmas && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {courseDilemmas.map((d) => (
                <DilemmaCard
                  key={d.id}
                  dilemma={d}
                  course={course}
                  isCompleted={isCompleted(course.id, d.id)}
                  onClick={() => setSelectedDilemma(d)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modules */}
      <div className="grid sm:grid-cols-2 gap-4">
        {course.modules.map((m, i) => (
          <ModuleCard key={m.id} course={course} module={m} index={i} />
        ))}
      </div>

      {/* Final assessment card (always visible but locked if not ready) */}
      <div className="mt-4 mb-8">
        <div
          className={`rounded-xl border p-5 ${
            allDone ? "bg-white border-tiq-mint/30" : "bg-tiq-mintLight/50 border-tiq-border/50 opacity-60"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-tiq-mintLight flex items-center justify-center shrink-0">
              {allDone ? <Trophy className="w-6 h-6 text-tiq-mint" /> : <Lock className="w-5 h-5 text-slate-400" />}
            </div>
            <div className="flex-1">
              <h3 className="font-slab text-tiq-ink font-bold">Final Assessment & Certification</h3>
              <p className="text-sm text-slate-600">
                {allDone
                  ? `${course.finalAssessment.length} questions · Score 75% to certify`
                  : `Complete all ${totalTopics} topics to unlock`}
              </p>
            </div>
            {allDone && (
              <Link
                to={`/course/${course.id}/final`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold text-sm hover:bg-tiq-mint/90 transition"
              >
                Start <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Certificate preview */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-tiq-gold shrink-0" />
          <h2 className="font-slab text-xl text-tiq-ink font-bold">
            {courseProg.certified ? "Your Certificate" : "Certificate Preview"}
          </h2>
        </div>
        <Certificate
          course={course}
          name={progress?.user_name || "Your Name"}
          score={courseProg.final_assessment_score || 0}
          date={courseProg.certified ? new Date() : null}
          preview={!courseProg.certified}
        />
        {!courseProg.certified && (
          <p className="text-center text-sm text-slate-500 mt-4">
            {allDone
              ? "Pass the final assessment to earn your certificate."
              : `Complete all ${totalTopics} topics and pass the final assessment to earn your certificate.`}
          </p>
        )}
      </div>

      {/* Dilemma modal */}
      {selectedDilemma && (
        <DilemmaModal
          course={course}
          dilemma={selectedDilemma}
          open={!!selectedDilemma}
          onClose={() => setSelectedDilemma(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl bg-white border border-tiq-border p-4">
      <Icon className="w-4 h-4 text-tiq-mint mb-2" />
      <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-[10px] text-amber-600 mt-0.5">{sub}</p>}
    </div>
  );
}