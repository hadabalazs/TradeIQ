import React from "react";
import { BookOpen, ArrowRight, Clock, Layers } from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";

// Shown on a course dashboard before the learner has enrolled.
//
// This replaced a "tell us your experience level" prompt that stored an answer
// nothing in the app ever read — it did not change the lessons, the questions,
// or the order of anything. Practice mode has its own per-session difficulty
// picker, which is where difficulty actually comes from. So the prompt was
// friction with no payoff; enrolling is at least a real signal, and it drives
// the "My Courses" section on the catalog.
export default function EnrollCourse({ course }) {
  const { saveCourseProgress } = useProgress();

  const totalTopics = (course.modules || []).reduce((s, m) => s + (m.topics || []).length, 0);

  const enroll = () => {
    saveCourseProgress(course.id, { enrolled: true, enrolled_at: new Date().toISOString() });
  };

  return (
    <div className="mb-8 rounded-xl bg-white border border-tiq-border overflow-hidden">
      <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
        <h2 className="font-slab text-xl text-tiq-ink font-bold mb-1">{course.title}</h2>
        <p className="text-sm text-slate-600">{course.description || course.subtitle}</p>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-5 mb-5 text-sm text-slate-600 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-tiq-mint" />
            {(course.modules || []).length} modules
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-tiq-mint" />
            {totalTopics} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-tiq-mint" />
            Work at your own pace
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Enrol to add this course to <span className="font-medium text-tiq-ink">My Courses</span> and
          start tracking your progress. Everything stays unlocked in order — finish a
          module, or pass its quiz, to move on.
        </p>
        <button
          onClick={enroll}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
        >
          Enroll
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
