import React from "react";
import { CheckCircle2 } from "lucide-react";
import { DILEMMA_TYPE_LABELS } from "@/lib/dilemmas";

const TYPE_ICONS = {
  compliance_redflag: "🚩",
  accounting_judgment: "⚖️",
  commercial_tradeoff: "💼",
  documentation_process: "📋",
  stakeholder_pressure: "👥",
};

export default function DilemmaCard({ dilemma, course, isCompleted, onClick }) {
  const icon = TYPE_ICONS[dilemma.dilemmaType] || "🎭";
  const typeLabel = DILEMMA_TYPE_LABELS[dilemma.dilemmaType] || dilemma.dilemmaType;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-white border border-tiq-border hover:border-tiq-mint/40 transition group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-tiq-gold/10 flex items-center justify-center shrink-0 text-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-tiq text-tiq-gold bg-tiq-gold/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
              {typeLabel}
            </span>
            {isCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
          </div>
          <h4 className="font-slab text-sm text-tiq-ink font-semibold leading-tight group-hover:text-tiq-mint transition">
            {dilemma.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {dilemma.characters.join(" · ")}
          </p>
        </div>
      </div>
    </button>
  );
}