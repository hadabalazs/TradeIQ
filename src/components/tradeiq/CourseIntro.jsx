import React from "react";
import { Compass, Layers, BookOpen, Clock, Award } from "lucide-react";

// The "what is this course" block on a course page.
//
// Course pages get shared as links, so this page is often the first thing
// somebody sees — before the catalog, before signing up. A one-line description
// answers "what is this called", not "should I spend six hours on this". The
// intro answers the second question, and the module list underneath shows the
// shape of the course without making anyone scroll through five cards to infer
// it.
//
// The module list is derived from course data rather than authored, so every
// course gets one — including uploads that never set `intro`.
export default function CourseIntro({ course, compact = false }) {
  const modules = course.modules || [];
  const totalTopics = modules.reduce((s, m) => s + (m.topics || []).length, 0);
  const totalQuestions = modules
    .flatMap((m) => m.topics || [])
    .reduce((s, t) => s + (t.quiz || []).length, 0);

  // Falls back to the catalog description so an uploaded course that never set
  // an intro still reads as a paragraph rather than showing nothing.
  const intro = course.intro || course.description;

  return (
    <section className="mb-8 rounded-xl bg-white border border-tiq-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-tiq-mint shrink-0" />
          <h2 className="font-slab text-base text-tiq-ink font-bold">About this course</h2>
        </div>

        {intro && (
          <p className="text-[15px] leading-relaxed text-slate-600 max-w-3xl">{intro}</p>
        )}

        <div className="flex items-center gap-5 mt-5 text-sm text-slate-600 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-tiq-mint" />
            {modules.length} modules
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-tiq-mint" />
            {totalTopics} lessons
          </span>
          {totalQuestions > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-tiq-mint" />
              {totalQuestions} practice questions
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-tiq-mint" />
            Work at your own pace
          </span>
        </div>
      </div>

      {!compact && modules.length > 0 && (
        <div className="border-t border-tiq-border bg-tiq-mintLight/30 px-6 py-5">
          <h3 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-3">
            What you'll cover
          </h3>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {modules.map((m, i) => (
              <li key={m.id} className="flex gap-2.5 text-sm">
                <span className="font-mono-tiq text-xs text-tiq-mint bg-white border border-tiq-border rounded px-1.5 py-0.5 h-fit shrink-0">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-tiq-ink font-medium leading-snug">{m.title}</span>
                  {m.subtitle && (
                    <span className="block text-xs text-slate-500 leading-snug">{m.subtitle}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
