import React from "react";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, ArrowRight, BookOpen, ClipboardList, Zap } from "lucide-react";
import { isModuleUnlocked, moduleProgress } from "@/lib/courses";
import { useProgress } from "@/lib/ProgressContext";

export default function ModuleCard({ course, module: mod, index }) {
  const { progress } = useProgress();
  const courseProg = progress?.courses?.[course.id] || {};
  const completed = courseProg.completed_topics || [];
  const unlocked = isModuleUnlocked(course, index, completed, courseProg.unlock_all);
  const { done, total, percent } = moduleProgress(course, mod, completed);
  const firstTopic = mod.topics[0];

  return (
    <div
      className={`relative rounded-xl border p-5 transition group ${
        unlocked
          ? "bg-white border-tiq-border hover:border-tiq-mint/40 cursor-pointer"
          : "bg-tiq-mintLight/50 border-tiq-border/50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded">
            MODULE {index + 1}
          </span>
          {done === total && total > 0 && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        {!unlocked && <Lock className="w-4 h-4 text-slate-400" />}
      </div>

      <h3 className="font-slab text-tiq-ink font-bold text-lg mb-1 leading-tight">{mod.title}</h3>
      <p className="text-sm text-slate-600 mb-4">{mod.subtitle}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-tiq-mintLight rounded-full overflow-hidden">
          <div className="h-full bg-tiq-mint rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-mono-tiq text-slate-500">{done}/{total}</span>
      </div>

      {unlocked ? (
        <div className="flex items-center gap-4">
          <Link
            to={`/course/${course.id}/learn/${firstTopic.id}`}
            className="flex items-center gap-1.5 text-sm text-tiq-mint hover:gap-2.5 transition-all font-medium"
          >
            <BookOpen className="w-4 h-4" />
            {done > 0 ? "Continue" : "Start learning"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/course/${course.id}/quiz/${mod.id}`}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-mint transition-all font-medium"
          >
            <ClipboardList className="w-4 h-4" />
            Module Quiz
          </Link>
        </div>
      ) : (
        // Locked, but advanced learners can fast-track: pass the module quiz to
        // test out of the module. Passing marks its topics complete and unlocks
        // the next module — same as working through the lessons.
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Complete previous module to unlock
          </p>
          <Link
            to={`/course/${course.id}/quiz/${mod.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-tiq-gold hover:text-tiq-mint transition shrink-0"
            title="Already know this? Pass the module quiz to skip ahead."
          >
            <Zap className="w-3.5 h-3.5" />
            Test out
          </Link>
        </div>
      )}
    </div>
  );
}
