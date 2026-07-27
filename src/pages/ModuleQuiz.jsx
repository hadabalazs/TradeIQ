import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, getModuleQuiz, MODULE_QUIZ_LENGTH, PASS_THRESHOLD, XP_PER_CORRECT, XP_FIRST_PASS_BONUS } from "@/lib/courses";
import { getDilemmasForModule } from "@/lib/dilemmas";
import { useProgress, computeActivityStreakUpdate } from "@/lib/ProgressContext";
import QuizView from "@/components/tradeiq/QuizView";

export default function ModuleQuiz() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { progress, save } = useProgress();

  const course = getCourse(courseId);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === moduleId) : -1;
  const module = course ? course.modules[moduleIndex] : null;
  const moduleDilemmas = useMemo(
    () => (course ? getDilemmasForModule(course.id, moduleIndex + 1) : []),
    [course, moduleIndex]
  );
  // The quiz is MODULE_QUIZ_LENGTH items in total — dilemmas take slots rather
  // than being added on top, so the count in the header is the count you answer.
  const quiz = useMemo(
    () => (course ? getModuleQuiz(course, moduleIndex, MODULE_QUIZ_LENGTH - moduleDilemmas.length) : []),
    [course, moduleIndex, moduleDilemmas.length]
  );

  if (!course || !module) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Module not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const quizId = `module_${module.id}`;
  const virtualTopic = { id: quizId, title: module.title, quiz };
  const courseProg = progress?.courses?.[course.id] || {};
  const nextModule = course.modules[moduleIndex + 1];

  const handleQuizComplete = async (correct, total) => {
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= PASS_THRESHOLD;
    const isFirstPass = passed && !(courseProg.passed_first_time || []).includes(quizId);
    let xpGain = correct * XP_PER_CORRECT;
    if (isFirstPass) xpGain += XP_FIRST_PASS_BONUS;

    const prevScore = courseProg.quiz_scores?.[quizId]?.percent ?? -1;
    const newScores = { ...(courseProg.quiz_scores || {}) };
    if (percent >= prevScore) {
      newScores[quizId] = { correct, total, percent };
    }

    const firstPass = new Set(courseProg.passed_first_time || []);
    if (isFirstPass) firstPass.add(quizId);

    // Passing the module quiz demonstrates mastery of the module — mark all
    // its topics complete so the NEXT module unlocks (isModuleUnlocked checks
    // that every previous-module topic is in completed_topics). This is what
    // lets a passing quiz carry you forward.
    const completed = new Set(courseProg.completed_topics || []);
    // Track WHICH topics were credited by the quiz rather than by working
    // through the lesson, so the sidebar can show them differently. Doing the
    // lesson later upgrades the topic out of this set (see recordQuiz).
    const viaQuiz = new Set(courseProg.quiz_completed_topics || []);
    if (passed) {
      for (const t of module.topics) {
        if (!completed.has(t.id)) viaQuiz.add(t.id);
        completed.add(t.id);
      }
    }

    const activityUpdate = computeActivityStreakUpdate(progress);
    save({
      courses: {
        ...(progress.courses || {}),
        [course.id]: {
          ...courseProg,
          quiz_scores: newScores,
          passed_first_time: Array.from(firstPass),
          completed_topics: Array.from(completed),
          quiz_completed_topics: Array.from(viaQuiz),
        },
      },
      total_xp: (progress?.total_xp || 0) + xpGain,
      ...(activityUpdate || {}),
    });

    return { percent, passed, xpGain, isFirstPass, hasNextModule: !!nextModule };
  };

  const prevScore = courseProg.quiz_scores?.[quizId]?.percent;

  // Where "Continue" goes after the quiz: next module's first lesson if it
  // exists, else the final assessment / dashboard.
  const goForward = (passed) => {
    if (passed && nextModule && nextModule.topics.length > 0) {
      navigate(`/course/${courseId}/learn/${nextModule.topics[0].id}`);
    } else if (passed && !nextModule) {
      navigate(`/course/${courseId}/final`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-tiq-ink">Courses</Link>
        <span>/</span>
        <Link to={`/course/${courseId}`} className="hover:text-tiq-ink">{course.title}</Link>
        <span>/</span>
        <span className="text-slate-600">{module.title}</span>
        <span>/</span>
        <span className="text-slate-600">Module Quiz</span>
      </div>

      <div className="mb-6">
        <h1 className="font-slab text-2xl text-tiq-ink font-bold mb-1">
          Module {moduleIndex + 1} Comprehensive Quiz
        </h1>
        <p className="text-sm text-slate-600">
          {quiz.length + moduleDilemmas.length} questions covering all topics in this module
          {prevScore != null && (
            <span className="ml-2 text-tiq-mint font-mono-tiq">Best: {prevScore}%</span>
          )}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Pass ({PASS_THRESHOLD}%+) to complete this module and unlock
          {nextModule ? ` Module ${moduleIndex + 2}` : " the final assessment"}.
        </p>
      </div>

      <QuizView
        topic={virtualTopic}
        dilemmas={moduleDilemmas}
        course={course}
        onComplete={handleQuizComplete}
        continueLabel={nextModule ? `Next Module →` : `Final Assessment →`}
        onContinue={(res) => goForward(res?.passed)}
        onBackToLesson={() => navigate(`/course/${courseId}`)}
      />
    </div>
  );
}
