import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardList,
  Lock,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getCourse, isModuleUnlocked, moduleProgress, PASS_THRESHOLD, MODULE_QUIZ_LENGTH } from "@/lib/courses";
import { useProgress } from "@/lib/ProgressContext";
import { getQuizSessionInfo } from "@/lib/quizSession";

// Overview of a single module: what it covers, what you'll be able to do, and
// the lessons inside it with your progress — so you can size up a module before
// committing to a lesson, and come back to it after finishing.
export default function ModuleOverview() {
  const { courseId, moduleId } = useParams();
  const { progress } = useProgress();

  const course = getCourse(courseId);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === moduleId) : -1;
  const module = course ? course.modules[moduleIndex] : null;

  if (!course || !module) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Module not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to courses</Link>
      </div>
    );
  }

  const courseProg = progress?.courses?.[course.id] || {};
  const completed = courseProg.completed_topics || [];
  const viaQuiz = courseProg.quiz_completed_topics || [];
  const scores = courseProg.quiz_scores || {};
  const unlocked = isModuleUnlocked(course, moduleIndex, completed, courseProg.unlock_all);
  const { done, total, percent } = moduleProgress(course, module, completed);
  const quizScore = scores[`module_${module.id}`]?.percent;
  const quizPassed = quizScore != null && quizScore >= PASS_THRESHOLD;
  const nextModule = course.modules[moduleIndex + 1];
  const quizPending = getQuizSessionInfo(`${courseId}::module_${module.id}`);
  const firstUnfinished = module.topics.find((t) => !completed.includes(t.id)) || module.topics[0];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 flex-wrap">
        <Link to="/" className="hover:text-tiq-ink">Courses</Link>
        <span>/</span>
        <Link to={`/course/${courseId}`} className="hover:text-tiq-ink">{course.title}</Link>
        <span>/</span>
        <span className="text-slate-600">{module.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <span className="text-xs font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded">
          MODULE {moduleIndex + 1}
        </span>
        <div className="flex items-center gap-2">
          {quizPassed && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              <Trophy className="w-3.5 h-3.5" />
              Quiz passed · {quizScore}%
            </span>
          )}
          {!unlocked && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              Locked
            </span>
          )}
        </div>
      </div>
      <h1 className="font-slab text-2xl sm:text-3xl text-tiq-ink font-bold mb-1.5 leading-tight">{module.title}</h1>
      <p className="text-slate-600 mb-5">{module.subtitle}</p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-tiq-mintLight rounded-full overflow-hidden">
          <div className="h-full bg-tiq-mint rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-mono-tiq text-slate-500 shrink-0">{done}/{total} lessons</span>
      </div>

      {/* What this module covers */}
      {module.overview && (
        <div className="rounded-xl border border-tiq-border bg-white p-5 mb-5">
          <h2 className="font-slab text-base text-tiq-ink font-bold mb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-tiq-mint" />
            What this module covers
          </h2>
          <div className="tiq-prose text-sm">
            <ReactMarkdown>{module.overview}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Objectives */}
      {module.objectives?.length > 0 && (
        <div className="rounded-xl border border-tiq-border bg-tiq-mintLight/40 p-5 mb-5">
          <h2 className="font-slab text-base text-tiq-ink font-bold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-tiq-mint" />
            By the end you'll be able to
          </h2>
          <ul className="space-y-2">
            {module.objectives.map((objective, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-tiq-mint shrink-0 mt-0.5" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lessons in this module */}
      <h2 className="font-slab text-base text-tiq-ink font-bold mb-3">
        Lessons in this module
      </h2>
      <ul className="space-y-2 mb-6">
        {module.topics.map((topic, i) => {
          const topicDone = completed.includes(topic.id);
          const creditedByQuiz = viaQuiz.includes(topic.id);
          const score = scores[topic.id]?.percent;
          return (
            <li key={topic.id}>
              <Link
                to={unlocked ? `/course/${courseId}/learn/${topic.id}` : "#"}
                onClick={(e) => !unlocked && e.preventDefault()}
                className={`flex items-center gap-3 rounded-lg border p-3.5 transition ${
                  unlocked
                    ? "bg-white border-tiq-border hover:border-tiq-mint/40"
                    : "bg-tiq-mintLight/40 border-tiq-border/50 cursor-not-allowed"
                }`}
              >
                {topicDone && creditedByQuiz ? (
                  <Circle
                    className="w-5 h-5 shrink-0 text-emerald-500 fill-emerald-500/30"
                    aria-label="Covered by module quiz"
                  />
                ) : topicDone ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                ) : unlocked ? (
                  <Circle className="w-5 h-5 shrink-0 text-slate-300" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${unlocked ? "text-tiq-ink" : "text-slate-400"}`}>
                    {topic.title}
                  </p>
                  {topicDone && creditedByQuiz && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Covered by the module quiz — open the lesson to study it properly
                    </p>
                  )}
                </div>
                {score != null && (
                  <span className="text-[11px] font-mono-tiq text-slate-500 shrink-0">{score}%</span>
                )}
                <span className="text-[11px] font-mono-tiq text-slate-400 shrink-0">{i + 1}/{total}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Module quiz */}
      <div className="rounded-xl border border-tiq-border bg-white p-5 mb-6">
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <h2 className="font-slab text-base text-tiq-ink font-bold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-tiq-mint" />
            Module Quiz
          </h2>
          {quizScore != null && (
            <span
              className={`text-xs font-mono-tiq px-2 py-0.5 rounded ${
                quizPassed ? "bg-emerald-500/10 text-emerald-600 font-semibold" : "bg-tiq-mintLight text-slate-500"
              }`}
            >
              {quizPassed ? `Passed · ${quizScore}%` : `Best ${quizScore}%`}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 mb-4">
          {MODULE_QUIZ_LENGTH} questions across every topic in this module. Pass with {PASS_THRESHOLD}%
          to complete the module and unlock {nextModule ? `Module ${moduleIndex + 2}` : "the final assessment"}.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={`/course/${courseId}/quiz/${module.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
          >
            {quizPending
              ? `Resume quiz (question ${quizPending.current + 1} of ${quizPending.total})`
              : quizScore != null ? "Retake quiz" : "Take the quiz"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {!unlocked && (
            <span className="inline-flex items-center gap-1.5 text-xs text-tiq-gold">
              <Zap className="w-3.5 h-3.5" />
              Pass it cold to test out of this module
            </span>
          )}
        </div>
      </div>

      {/* Continue */}
      {unlocked && (
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={`/course/${courseId}/learn/${firstUnfinished.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
          >
            <BookOpen className="w-4 h-4" />
            {done > 0 ? "Continue where you left off" : "Start the first lesson"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {nextModule && done === total && (
            <Link
              to={`/course/${courseId}/module/${nextModule.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink transition text-sm font-medium"
            >
              Next module
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
