import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, BookOpen, HelpCircle, LayoutGrid } from "lucide-react";
import { getCourse, getTopic, isModuleUnlocked } from "@/lib/courses";
import { useProgress } from "@/lib/ProgressContext";
import LessonView from "@/components/tradeiq/LessonView";
import QuizView from "@/components/tradeiq/QuizView";

export default function Learn() {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const { progress, recordQuiz } = useProgress();
  const [mode, setMode] = useState("lesson");

  const course = getCourse(courseId);

  useEffect(() => {
    setMode("lesson");
  }, [topicId]);

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Course not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to courses</Link>
      </div>
    );
  }

  const found = getTopic(course, topicId);

  if (!found) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Topic not found.</p>
        <Link to={`/course/${courseId}`} className="text-tiq-mint hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const { module, topic } = found;
  const courseProg = progress?.courses?.[course.id] || {};
  const completed = courseProg.completed_topics || [];
  const unlocked = isModuleUnlocked(course, course.modules.indexOf(module), completed, courseProg.unlock_all);

  if (!unlocked) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">This module is locked. Complete the previous module first.</p>
        <Link to={`/course/${courseId}`} className="text-tiq-mint hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  // Determine the next step after this topic
  const allTopics = course.modules.flatMap((m) => m.topics.map((t) => ({ t, m })));
  const idx = allTopics.findIndex((x) => x.t.id === topic.id);
  const next = allTopics[idx + 1];
  const isLastInModule = idx === allTopics.length - 1 || allTopics[idx + 1].m.id !== module.id;

  const handleQuizComplete = async (correct, total) => {
    return recordQuiz(course.id, topic.id, correct, total);
  };

  const quizScore = courseProg.quiz_scores?.[topic.id]?.percent;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-tiq-ink">Courses</Link>
        <span>/</span>
        <Link to={`/course/${courseId}`} className="hover:text-tiq-ink">{course.title}</Link>
        <span>/</span>
        <span className="text-slate-600">{module.title}</span>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <div className="inline-flex rounded-lg bg-white border border-tiq-border p-0.5">
          <button
            onClick={() => setMode("lesson")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition ${
              mode === "lesson" ? "bg-tiq-mint text-white font-medium" : "text-slate-600 hover:text-tiq-ink"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Lesson
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition ${
              mode === "quiz" ? "bg-tiq-mint text-white font-medium" : "text-slate-600 hover:text-tiq-ink"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Quiz
          </button>
        </div>
        <Link
          to={`/course/${courseId}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-tiq-border text-slate-600 hover:text-tiq-ink hover:bg-tiq-mintLight transition"
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Course
        </Link>
      </div>

      {mode === "lesson" ? (
        <LessonView topic={topic} course={course} quizScore={quizScore} onStartQuiz={() => setMode("quiz")} />
      ) : (
        <QuizView
          topic={topic}
          course={course}
          module={module}
          onComplete={handleQuizComplete}
          onBackToLesson={() => {
            if (isLastInModule) navigate(`/course/${courseId}/quiz/${module.id}`);
            else if (next) navigate(`/course/${courseId}/learn/${next.t.id}`);
            else navigate(`/course/${courseId}`);
          }}
        />
      )}

      {/* Next step link at bottom of lesson */}
      {mode === "lesson" && (
        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mt-8 pt-6 border-t border-tiq-border">
          {isLastInModule ? (
            <Link
              to={`/course/${courseId}/quiz/${module.id}`}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-tiq-mint transition"
            >
              Next: {module.title} — Module Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : next ? (
            <Link
              to={`/course/${courseId}/learn/${next.t.id}`}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-tiq-mint transition"
            >
              Next: {next.t.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}