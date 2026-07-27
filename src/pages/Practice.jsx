import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCourse, getQuizQuestions } from "@/lib/courses";
import QuizSetup from "@/components/tradeiq/QuizSetup";
import PracticeQuiz from "@/components/tradeiq/PracticeQuiz";

export default function Practice() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const [questions, setQuestions] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Course not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to courses</Link>
      </div>
    );
  }

  const handleStart = (diff, count) => {
    const qs = getQuizQuestions(course, diff, count);
    setQuestions(qs);
    setDifficulty(diff);
  };

  const handleExit = () => {
    setQuestions(null);
    setDifficulty(null);
  };

  if (questions) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink"
          >
            <ArrowLeft className="w-4 h-4" /> Back to setup
          </button>
        </div>
        <PracticeQuiz
          questions={questions}
          onComplete={async () => ({})}
          onExit={handleExit}
          title={`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Practice Quiz`}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>
      <QuizSetup course={course} onStart={handleStart} />
    </div>
  );
}