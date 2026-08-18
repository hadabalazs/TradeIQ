import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { useCourses } from "@/lib/CoursesContext";

// Entry point to the full course editor.
//
// This is a top-level admin section on purpose. It previously lived as a small
// link inside the course-name editor, which renders a "not installed" notice
// when the course_overrides migration is missing — so the link to the CONTENT
// editor disappeared whenever an unrelated migration hadn't been run. An entry
// point must not depend on a feature it doesn't use.
export default function CourseContentManager() {
  const { courses } = useCourses();

  return (
    <section className="rounded-xl border border-tiq-border bg-white p-5">
      <h2 className="font-slab text-base text-tiq-ink font-bold mb-1 flex items-center gap-2">
        <FileText className="w-4 h-4 text-tiq-mint" />
        Edit course content
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Review and edit everything in a course — module overviews and objectives, lesson
        text, and every question with its answers. Changes apply to all learners immediately.
      </p>

      {(courses || []).length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">No courses loaded.</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => {
            const modules = (course.modules || []).length;
            const topics = (course.modules || []).reduce((s, m) => s + (m.topics || []).length, 0);
            const questions = (course.modules || [])
              .flatMap((m) => m.topics || [])
              .reduce((s, t) => s + (t.quiz || []).length, 0);
            return (
              <li key={course.id}>
                <Link
                  to={`/admin/course/${course.id}`}
                  className="flex items-center gap-3 rounded-lg border border-tiq-border p-3.5 hover:border-tiq-mint/40 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                    <p className="text-xs text-slate-500">
                      {modules} modules · {topics} lessons · {questions} questions
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white text-xs font-medium shrink-0">
                    Open editor <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
