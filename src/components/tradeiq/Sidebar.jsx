import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Lock, CheckCircle2, Circle, Flame, Zap, LayoutDashboard, ClipboardList, LayoutGrid, Trophy, Award, Brain } from "lucide-react";
import { isModuleUnlocked, COURSES, PASS_THRESHOLD } from "@/lib/courses";
import { useProgress } from "@/lib/ProgressContext";
import SettingsPanel from "@/components/tradeiq/SettingsPanel";

export default function Sidebar({ course }) {
  const { topicId: currentId } = useParams();
  const location = useLocation();
  const { progress } = useProgress();
  const courseId = course?.id;
  const courseProg = courseId ? progress?.courses?.[courseId] : null;
  const completed = courseProg?.completed_topics || [];
  const viaQuiz = courseProg?.quiz_completed_topics || [];
  const scores = courseProg?.quiz_scores || {};
  const totalTopics = course ? course.modules.reduce((s, m) => s + m.topics.length, 0) : 0;
  const allDone = completed.length >= totalTopics || courseProg?.unlock_all;
  const certified = courseProg?.certified;

  return (
    <nav className="h-full overflow-y-auto tiq-scroll py-4 px-3">
      <div className="px-1 pb-3 mb-3 border-b border-tiq-border">
        <div className="space-y-0.5">
        <Link
          to="/"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
            location.pathname === "/"
              ? "bg-tiq-mint/10 text-tiq-mint font-medium"
              : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> All Courses
        </Link>
        <Link
          to="/daily"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
            location.pathname === "/daily"
              ? "bg-tiq-mint/10 text-tiq-mint font-medium"
              : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
          }`}
        >
          <Flame className="w-4 h-4" /> Daily Recap
        </Link>
        <Link
          to="/knowledge-check"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
            location.pathname === "/knowledge-check"
              ? "bg-tiq-mint/10 text-tiq-mint font-medium"
              : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
          }`}
        >
          <Brain className="w-4 h-4" /> Knowledge Check
        </Link>
        <Link
          to="/achievements"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
            location.pathname === "/achievements"
              ? "bg-tiq-mint/10 text-tiq-mint font-medium"
              : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
          }`}
        >
          <Award className="w-4 h-4" /> My Achievements
        </Link>
        {course && (
          <Link
            to={`/course/${courseId}/practice`}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
              location.pathname === `/course/${courseId}/practice`
                ? "bg-tiq-mint/10 text-tiq-mint font-medium"
                : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
            }`}
          >
            <Zap className="w-4 h-4" /> Practice Quiz
          </Link>
        )}
        </div>
        <SettingsPanel course={course} />
      </div>

      {course ? (
        <>
          {/* Course title */}
          <div className="px-2 mb-3">
            <p className="text-xs font-slab font-bold text-tiq-ink uppercase tracking-wide">{course.title}</p>
          </div>

          {course.modules.map((module, mi) => {
            const unlocked = isModuleUnlocked(course, mi, completed, courseProg?.unlock_all);
            const quizScore = scores[`module_${module.id}`]?.percent;
            const quizPassed = quizScore != null && quizScore >= PASS_THRESHOLD;
            return (
              <div key={module.id} className="mb-5">
                <Link
                  to={`/course/${courseId}/module/${module.id}`}
                  className="flex items-center gap-2 px-2 mb-2 rounded-md py-1 -mx-0.5 hover:bg-tiq-mintLight transition group/mod"
                  title="Module overview"
                >
                  <span className={`text-xs font-mono-tiq ${unlocked ? "text-tiq-mint" : "text-slate-400"}`}>
                    M{mi + 1}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${unlocked ? "text-slate-700 group-hover/mod:text-tiq-ink" : "text-slate-400"}`}>
                    {module.title}
                  </span>
                  {!unlocked && <Lock className="w-3 h-3 text-slate-400 ml-auto shrink-0" />}
                </Link>
                <ul className="space-y-0.5">
                  {module.topics.map((topic, ti) => {
                    const done = completed.includes(topic.id);
                    const creditedByQuiz = viaQuiz.includes(topic.id);
                    const active = currentId === topic.id;
                    const score = scores[topic.id]?.percent;
                    return (
                      <li key={topic.id}>
                        <Link
                          to={unlocked ? `/course/${courseId}/learn/${topic.id}` : "#"}
                          onClick={(e) => !unlocked && e.preventDefault()}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition group ${
                            active
                              ? "bg-tiq-mint/10 text-tiq-mint border-l-2 border-tiq-mint"
                              : unlocked
                              ? "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
                              : "text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {done && creditedByQuiz ? (
                            // Covered by passing the module quiz, not by working
                            // through the lesson — a plain green dot, no tick.
                            <Circle
                              className="w-4 h-4 shrink-0 text-emerald-500 fill-emerald-500/30"
                              aria-label="Covered by module quiz"
                            />
                          ) : done ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                          ) : unlocked ? (
                            <Circle className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-500" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate text-[13px]">{topic.title}</span>
                          {score != null && (
                            <span className="ml-auto text-[10px] font-mono-tiq text-slate-500">{score}%</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {unlocked && (
                  <div className="mt-1">
                    <Link
                      to={`/course/${courseId}/quiz/${module.id}`}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-slate-500 hover:bg-tiq-mintLight hover:text-tiq-ink transition group"
                    >
                      {quizPassed ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      ) : (
                        <ClipboardList className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-tiq-mint" />
                      )}
                      <span className="truncate text-[13px] italic">Module Quiz</span>
                      {quizScore != null && (
                        <span
                          className={`ml-auto text-[10px] font-mono-tiq px-1.5 py-0.5 rounded shrink-0 ${
                            quizPassed ? "bg-emerald-500/10 text-emerald-600 font-semibold" : "text-slate-500"
                          }`}
                          title={quizPassed ? `Passed with ${quizScore}%` : `Best score ${quizScore}% — ${PASS_THRESHOLD}% to pass`}
                        >
                          {quizPassed ? `Passed · ${quizScore}%` : `${quizScore}%`}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Assessment & Certificate links */}
          <div className="mt-4 pt-3 border-t border-tiq-border space-y-0.5">
            <Link
              to={allDone ? `/course/${courseId}/final` : "#"}
              onClick={(e) => !allDone && e.preventDefault()}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition group ${
                location.pathname === `/course/${courseId}/final`
                  ? "bg-tiq-mint/10 text-tiq-mint font-medium"
                  : allDone
                  ? "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
                  : "text-slate-400 cursor-not-allowed"
              }`}
            >
              {certified ? (
                <Award className="w-4 h-4 shrink-0 text-tiq-gold" />
              ) : allDone ? (
                <Trophy className="w-4 h-4 shrink-0 text-tiq-mint" />
              ) : (
                <Lock className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate text-[13px]">Final Assessment</span>
              {certified && (
                <span className="ml-auto text-[10px] font-mono-tiq text-tiq-gold">Earned</span>
              )}
            </Link>
            <Link
              to={`/course/${courseId}`}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition ${
                location.pathname === `/course/${courseId}` && !currentId
                  ? "bg-tiq-mint/10 text-tiq-mint font-medium"
                  : "text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink"
              }`}
            >
              <Award className="w-4 h-4 shrink-0 text-tiq-gold" />
              <span className="truncate text-[13px]">Certificate</span>
              {certified && (
                <span className="ml-auto text-[10px] font-mono-tiq text-tiq-gold">✓</span>
              )}
            </Link>
          </div>
          </>
          ) : (
        // When not in a course, show a list of all courses
        <div>
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Your Courses</p>
          <ul className="space-y-0.5">
            {COURSES.map((c) => {
              const cProg = progress?.courses?.[c.id];
              const done = cProg?.completed_topics?.length || 0;
              const total = c.modules.reduce((s, m) => s + m.topics.length, 0);
              return (
                <li key={c.id}>
                  <Link
                    to={`/course/${c.id}`}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink transition"
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span className="truncate text-[13px]">{c.title}</span>
                    <span className="ml-auto text-[10px] font-mono-tiq text-slate-500">{done}/{total}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}