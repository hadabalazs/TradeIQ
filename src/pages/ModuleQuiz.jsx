import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, getModuleQuiz, PASS_THRESHOLD, XP_PER_CORRECT, XP_FIRST_PASS_BONUS } from "@/lib/courses";
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
  const quiz = useMemo(() => (course ? getModuleQuiz(course, moduleIndex) : []), [course, moduleIndex]);
  const moduleDilemmas = useMemo(
    () => (course ? getDilemmasForModule(course.id, moduleIndex + 1) : []),
    [course, moduleIndex]
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

    const activityUpdate = computeActivityStreakUpdate(progress);
    // Save course-specific progress + activity streak
    save({
      courses: {
        ...(progress.courses || {}),
        [course.id]: {
          ...courseProg,
          quiz_scores: newScores,
          passed_first_time: Array.from(firstPass),
        },
      },
      total_xp: (progress?.total_xp || 0) + xpGain,
      ...(activityUpdate || {}),
    });

    return { percent, passed, xpGain, isFirstPass };
  };

  const prevScore = courseProg.quiz_scores?.[quizId]?.percent;

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
          {quiz.length} questions covering all topics in this module
          {prevScore != null && (
            <span className="ml-2 text-tiq-mint font-mono-tiq">Best: {prevScore}%</span>
          )}
        </p>
      </div>

      <QuizView
        topic={virtualTopic}
        dilemmas={moduleDilemmas}
        course={course}
        onComplete={handleQuizComplete}
        onBackToLesson={() => {
          const nextModule = course.modules[moduleIndex + 1];
          if (nextModule && nextModule.topics.length > 0) {
            navigate(`/course/${courseId}/learn/${nextModule.topics[0].id}`);
          } else {
            navigate(`/course/${courseId}`);
          }
        }}
      />
    </div>
  );
}