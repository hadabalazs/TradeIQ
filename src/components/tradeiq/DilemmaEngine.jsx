import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, RotateCcw, Lightbulb, ArrowRight, X } from "lucide-react";

const TONE_STYLES = {
  positive: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Good call",
  },
  negative: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Watch out",
  },
  neutral: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Trade-off",
  },
};

export default function DilemmaEngine({
  dilemma,
  course,
  previousPath,
  onComplete,
  onClose,
  onAdvance,
  relatedTopicLinks,
}) {
  const [currentNodeId, setCurrentNodeId] = useState(dilemma.startNode);
  const [visitedConsequences, setVisitedConsequences] = useState([]);
  const completedRef = useRef(false);

  const node = dilemma.nodes[currentNodeId];
  if (!node) return null;

  const handleChoice = (choice) => {
    const nextNode = dilemma.nodes[choice.next];
    const newConsequences = [...visitedConsequences];
    if (nextNode?.type === "consequence") {
      newConsequences.push(choice.next);
    }
    setVisitedConsequences(newConsequences);
    setCurrentNodeId(choice.next);

    if (nextNode?.type === "ending" && !completedRef.current) {
      completedRef.current = true;
      const pathChanged =
        !!previousPath &&
        JSON.stringify([...previousPath].sort()) !==
          JSON.stringify([...newConsequences].sort());
      onComplete?.(newConsequences, pathChanged);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId(dilemma.startNode);
    setVisitedConsequences([]);
    completedRef.current = false;
  };

  // ── Decision node ──────────────────────────────────
  if (node.type === "decision") {
    return (
      <div>
        {node.speaker && (
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-tiq-mint/10 flex items-center justify-center text-tiq-mint font-semibold text-sm">
              {node.speaker.charAt(0)}
            </div>
            <span className="text-sm font-medium text-tiq-ink">{node.speaker}</span>
          </div>
        )}
        <p className="text-tiq-ink leading-relaxed mb-5">{node.text}</p>
        <div className="space-y-2.5">
          {node.choices.map((choice, i) => {
            const wasPrevious =
              previousPath && previousPath.includes(choice.next);
            return (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="w-full text-left px-4 py-3 rounded-lg border border-tiq-border bg-white hover:border-tiq-mint/40 hover:bg-tiq-mintLight/30 transition group flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-tiq-mintLight flex items-center justify-center text-xs font-mono-tiq text-tiq-mint shrink-0 mt-0.5 group-hover:bg-tiq-mint group-hover:text-white transition">
                  {String.fromCharCode(65 + i)}
                </span>
                <div className="flex-1">
                  <span className="text-sm text-tiq-ink">{choice.text}</span>
                  {wasPrevious && (
                    <span className="block text-xs text-slate-400 mt-1">
                      ← Your previous choice
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Consequence node ───────────────────────────────
  if (node.type === "consequence") {
    const tone = TONE_STYLES[node.tone] || TONE_STYLES.neutral;
    return (
      <div>
        <div className={`border-l-4 ${tone.border} ${tone.bg} rounded-r-lg p-4 mb-4`}>
          <span className={`text-xs font-semibold uppercase tracking-wide ${tone.text}`}>
            {tone.label}
          </span>
          <p className="text-sm text-tiq-ink leading-relaxed mt-1.5">{node.text}</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-tiq-mintLight to-white border border-tiq-mint/20 p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-tiq-mint/10 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-tiq-mint" />
            </div>
            <span className="font-slab text-xs font-semibold text-tiq-mint uppercase tracking-wide">
              Learning Point
            </span>
          </div>
          <p className="text-sm text-tiq-ink leading-relaxed">{node.learningPoint}</p>
        </div>
        <div className="space-y-2.5">
          {node.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="w-full text-left px-4 py-3 rounded-lg bg-tiq-mint text-white font-medium text-sm hover:bg-tiq-mint/90 transition flex items-center justify-between gap-3"
            >
              {/* min-w-0 lets long choice text wrap instead of forcing the row
                  wider than the screen; the arrow must not be squeezed. */}
              <span className="min-w-0">{choice.text}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Ending node ────────────────────────────────────
  if (node.type === "ending") {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-slab text-lg text-tiq-ink font-bold mb-2">
          Dilemma Complete
        </h3>
        <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">{node.text}</p>
        {node.relatedTopics && node.relatedTopics.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Related Topics
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {node.relatedTopics.map((topic, i) => {
                const link = relatedTopicLinks?.[topic];
                if (link) {
                  return (
                    <Link
                      key={i}
                      to={link}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-tiq-mintLight border border-tiq-border text-xs text-tiq-mint hover:bg-tiq-mint/10 transition"
                    >
                      {topic}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  );
                }
                return (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-lg bg-tiq-mintLight border border-tiq-border text-xs text-slate-500"
                  >
                    {topic}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink transition text-sm font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </button>
          )}
          {onAdvance && (
            <button
              onClick={onAdvance}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}