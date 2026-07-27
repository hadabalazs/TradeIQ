import React from "react";
import { HelpCircle, ThumbsUp, Zap } from "lucide-react";
import { Grades } from "@/lib/srs";

// Confidence self-grading after a correct answer.
// Feeds the FSRS scheduler: hesitant answers come back sooner than confident ones.
// `bare` drops the card chrome and prompt so a caller (e.g. the review popup)
// can supply its own heading around just the button row.
export default function ConfidenceGrade({ value, onSelect, bare = false }) {
  const options = [
    { grade: Grades.HARD, label: "Guessed", icon: HelpCircle, hint: "review soon" },
    { grade: Grades.GOOD, label: "Knew it", icon: ThumbsUp, hint: "normal spacing" },
    { grade: Grades.EASY, label: "Instant", icon: Zap, hint: "longer spacing" },
  ];
  const buttons = (
    <div className="flex gap-2">
      {options.map(({ grade, label, icon: Icon, hint }) => (
        <button
          key={grade}
          onClick={() => onSelect(grade)}
          className={`flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border text-xs font-medium transition ${
            value === grade
              ? "border-tiq-mint bg-tiq-mint/10 text-tiq-mint"
              : "border-tiq-border text-slate-600 hover:border-tiq-mint/40 hover:text-tiq-ink"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
          <span className="text-[10px] text-slate-400 font-normal">{hint}</span>
        </button>
      ))}
    </div>
  );

  if (bare) return buttons;

  return (
    <div className="mb-5 p-3.5 rounded-lg bg-white border border-tiq-border">
      <p className="text-xs text-slate-500 mb-2.5">
        How sure were you? <span className="text-slate-400">(sets when you'll see this again)</span>
      </p>
      {buttons}
    </div>
  );
}
