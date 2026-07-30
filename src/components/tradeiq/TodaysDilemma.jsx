import React, { useState, useMemo } from "react";
import { Theater, ArrowRight, CheckCircle2 } from "lucide-react";
import { COURSES } from "@/lib/courses";
import { getDilemmasForCourse, DILEMMA_TYPE_LABELS } from "@/lib/dilemmas";
import { useDilemmaCompletions } from "@/lib/dilemmaProgress";
import { useProgress } from "@/lib/ProgressContext";
import DilemmaModal from "@/components/tradeiq/DilemmaModal";

export default function TodaysDilemma() {
  const { progress } = useProgress();
  const { isCompleted, loading } = useDilemmaCompletions();
  const [selected, setSelected] = useState(null);

  // Determine the "active" course — the one with the most completed topics
  const activeCourse = useMemo(() => {
    let best = COURSES[0];
    let bestCount = 0;
    for (const course of COURSES) {
      const count =
        progress?.courses?.[course.id]?.completed_topics?.length || 0;
      if (count > bestCount) {
        best = course;
        bestCount = count;
      }
    }
    return best;
  }, [progress]);

  // Pick today's dilemma — stable per day, prefers uncompleted
  const todaysDilemma = useMemo(() => {
    const courseDilemmas = getDilemmasForCourse(activeCourse.id);
    if (courseDilemmas.length === 0) return null;

    const uncompleted = courseDilemmas.filter(
      (d) => !isCompleted(activeCourse.id, d.id)
    );
    const pool = uncompleted.length > 0 ? uncompleted : courseDilemmas;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    return pool[dayOfYear % pool.length];
  }, [activeCourse, isCompleted, loading]);

  // Render a same-height placeholder while loading instead of nothing. Returning
  // null here collapsed the card and then re-expanded it once the dilemma
  // resolved, shoving everything below it down the page — which read as the
  // Daily Recap card disappearing and reappearing.
  if (loading) {
    return (
      <div
        className="mb-8 p-5 rounded-xl border border-tiq-border bg-tiq-mintLight/40 animate-pulse"
        aria-hidden="true"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-tiq-mint/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-tiq-mint/10" />
            <div className="h-4 w-2/3 rounded bg-tiq-mint/10" />
            <div className="h-3 w-1/3 rounded bg-tiq-mint/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!todaysDilemma) return null;

  const completed = isCompleted(activeCourse.id, todaysDilemma.id);

  return (
    <>
      <button
        onClick={() => setSelected(todaysDilemma)}
        className="block w-full text-left mb-8 p-5 rounded-xl bg-gradient-to-r from-tiq-gold/10 to-tiq-mint/5 border border-tiq-gold/20 hover:border-tiq-gold/40 transition group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-tiq-gold/15 flex items-center justify-center shrink-0">
            <Theater className="w-6 h-6 text-tiq-gold" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-slab text-tiq-ink font-bold">Today's Dilemma</h3>
              {completed && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-sm text-slate-600">{todaysDilemma.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeCourse.subtitle} ·{" "}
              {DILEMMA_TYPE_LABELS[todaysDilemma.dilemmaType] ||
                todaysDilemma.dilemmaType}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-tiq-gold group-hover:translate-x-1 transition shrink-0" />
        </div>
      </button>

      {selected && (
        <DilemmaModal
          course={activeCourse}
          dilemma={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}