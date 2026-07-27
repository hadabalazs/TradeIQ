import React, { useState } from "react";
import { GraduationCap, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "New to this subject", icon: GraduationCap },
  { id: "some_finance", label: "Some Experience", desc: "I know some basics", icon: Briefcase },
  { id: "experienced", label: "Experienced", desc: "I work in this field", icon: TrendingUp },
];

export default function CourseLevelSelector({ course }) {
  const { saveCourseProgress } = useProgress();
  const [level, setLevel] = useState("beginner");

  const submit = () => {
    saveCourseProgress(course.id, { knowledge_level: level, level_set: true });
  };

  return (
    <div className="mb-8 rounded-xl bg-white border border-tiq-border overflow-hidden">
      <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
        <h2 className="font-slab text-xl text-tiq-ink font-bold mb-1">{course.title}</h2>
        <p className="text-sm text-slate-600">Before you begin, tell us your experience level for this course.</p>
      </div>
      <div className="p-6">
        <div className="space-y-2 mb-5">
          {LEVELS.map((l) => {
            const Icon = l.icon;
            const active = level === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition text-left ${
                  active
                    ? "border-tiq-mint bg-tiq-mint/10"
                    : "border-tiq-border bg-tiq-mintLight hover:border-tiq-mint/30"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-tiq-mint" : "text-slate-400"}`} />
                <div>
                  <p className={`text-sm font-medium ${active ? "text-tiq-mint" : "text-tiq-ink"}`}>{l.label}</p>
                  <p className="text-xs text-slate-500">{l.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={submit}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}