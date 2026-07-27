import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import ConfidenceGrade from "@/components/tradeiq/ConfidenceGrade";
import { Grades } from "@/lib/srs";

// Recall prompt, shown as its own popup once a question is answered correctly.
// The tap that records how well you recalled it is the same tap that advances,
// so there is no Next button on a correct answer. Sits above the review overlay
// (z-60 vs z-50). Wrong answers never see this — they keep their own flow.
export default function RecallPopup({ onSelect }) {
  // 1/2/3 pick Guessed/Knew it/Instant without reaching for the mouse.
  useEffect(() => {
    const onKey = (e) => {
      const grade = { 1: Grades.HARD, 2: Grades.GOOD, 3: Grades.EASY }[e.key];
      if (grade) { e.preventDefault(); onSelect(grade); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onSelect]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="How well did you recall this?"
    >
      <div className="w-full sm:max-w-md bg-tiq-navy rounded-2xl border border-tiq-border shadow-xl p-5 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <div className="text-center mb-4">
          <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-slab text-lg text-tiq-ink font-bold">Correct</h3>
          <p className="text-xs text-slate-500 mt-1">
            How well did you recall it? This sets when it comes back.
          </p>
        </div>
        <ConfidenceGrade value={null} onSelect={onSelect} bare />
      </div>
    </div>
  );
}
