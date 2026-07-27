import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TermMatchQuestion({ question, answered, onAnswered, showExplanation }) {
  const { pairs, q: instruction } = question;

  const [terms, setTerms] = useState(() => shuffle(pairs.map((p, i) => ({ text: p.term, originalIndex: i }))));
  const [defs, setDefs] = useState(() => shuffle(pairs.map((p, i) => ({ text: p.definition, originalIndex: i }))));
  const [connections, setConnections] = useState({});
  const [checked, setChecked] = useState(false);
  const [dragTerm, setDragTerm] = useState(null);
  const [pointerPos, setPointerPos] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const termRefs = useRef([]);
  const defRefs = useRef([]);
  const dragStartPos = useRef(null);
  const wasDragRef = useRef(false);

  useLayoutEffect(() => {
    setTick((t) => t + 1);
  }, [terms, defs]);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const commitConnection = (termIdx, defIdx) => {
    setConnections((prev) => {
      const next = { ...prev };
      next[termIdx] = defIdx;
      for (const [t, d] of Object.entries(next)) {
        if (parseInt(t) !== termIdx && d === defIdx) {
          delete next[t];
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (dragTerm === null) return;

    const handleMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setPointerPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (dragStartPos.current) {
        const moved = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
        if (moved > 8) wasDragRef.current = true;
      }
    };

    const handleUp = (e) => {
      if (wasDragRef.current) {
        const x = e.clientX, y = e.clientY;
        let targetDef = null;
        for (let i = 0; i < defRefs.current.length; i++) {
          const el = defRefs.current[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            targetDef = i;
            break;
          }
        }
        if (targetDef !== null) {
          commitConnection(dragTerm, targetDef);
        }
      } else {
        setSelectedTerm(dragTerm);
      }
      setDragTerm(null);
      setPointerPos(null);
      dragStartPos.current = null;
      setTimeout(() => { wasDragRef.current = false; }, 0);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragTerm]);

  const handlePointerDown = (e, termIdx) => {
    if (answered) return;
    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    wasDragRef.current = false;
    setDragTerm(termIdx);
    setSelectedTerm(null);
  };

  const handleDefClick = (defIdx) => {
    if (answered || wasDragRef.current) return;
    if (selectedTerm !== null) {
      commitConnection(selectedTerm, defIdx);
      setSelectedTerm(null);
    }
  };

  const handleTermClick = (termIdx) => {
    if (answered || wasDragRef.current) return;
    setSelectedTerm((prev) => (prev === termIdx ? null : termIdx));
  };

  const allConnected = Object.keys(connections).length === pairs.length;
  const isCorrect = (tIdx, dIdx) => terms[tIdx]?.originalIndex === defs[dIdx]?.originalIndex;
  const correctCount = checked
    ? Object.entries(connections).filter(([t, d]) => isCorrect(parseInt(t), d)).length
    : 0;
  const allCorrect = allConnected && Object.entries(connections).every(([t, d]) => isCorrect(parseInt(t), d));

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) onAnswered(true);
  };

  const handleContinue = () => {
    onAnswered(false);
  };

  const handleTryAgain = () => {
    setTerms(shuffle(pairs.map((p, i) => ({ text: p.term, originalIndex: i }))));
    setDefs(shuffle(pairs.map((p, i) => ({ text: p.definition, originalIndex: i }))));
    setConnections({});
    setChecked(false);
    setSelectedTerm(null);
  };

  const getTermPoint = (idx) => {
    const container = containerRef.current;
    const el = termRefs.current[idx];
    if (!container || !el) return null;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return {
      x: eRect.right - cRect.left,
      y: eRect.top + eRect.height / 2 - cRect.top,
    };
  };

  const getDefPoint = (idx) => {
    const container = containerRef.current;
    const el = defRefs.current[idx];
    if (!container || !el) return null;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return {
      x: eRect.left - cRect.left,
      y: eRect.top + eRect.height / 2 - cRect.top,
    };
  };

  const showResults = checked || answered;

  return (
    <div className="space-y-5">
      <h2 className="font-slab text-xl text-tiq-ink font-bold">{instruction}</h2>

      <div ref={containerRef} className="relative select-none" style={{ touchAction: "none" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, overflow: "visible" }}>
          {Object.entries(connections).map(([tStr, dIdx]) => {
            const tIdx = parseInt(tStr);
            const start = getTermPoint(tIdx);
            const end = getDefPoint(dIdx);
            if (!start || !end) return null;
            const correct = showResults && isCorrect(tIdx, dIdx);
            const wrong = showResults && !correct;
            const color = correct ? "#10b981" : wrong ? "#ef4444" : "rgb(var(--tiq-mint))";
            return (
              <line
                key={`conn-${tIdx}`}
                x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                stroke={color} strokeWidth={3} strokeLinecap="round"
              />
            );
          })}
          {dragTerm !== null && pointerPos && (() => {
            const start = getTermPoint(dragTerm);
            if (!start) return null;
            return (
              <line
                x1={start.x} y1={start.y} x2={pointerPos.x} y2={pointerPos.y}
                stroke="rgb(var(--tiq-mint))" strokeWidth={2.5} strokeDasharray="6 4" strokeLinecap="round"
              />
            );
          })()}
        </svg>

        <div className="grid grid-cols-2 gap-6 sm:gap-10 md:gap-14" style={{ position: "relative", zIndex: 2 }}>
          <div className="space-y-2">
            {terms.map((term, idx) => {
              const connected = connections[idx] !== undefined;
              const isSelected = selectedTerm === idx;
              const correct = showResults && connected && isCorrect(idx, connections[idx]);
              const wrong = showResults && connected && !correct;
              return (
                <div
                  key={idx}
                  ref={(el) => { termRefs.current[idx] = el; }}
                  onPointerDown={(e) => handlePointerDown(e, idx)}
                  onClick={() => handleTermClick(idx)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer ${
                    correct
                      ? "border-emerald-500/50 bg-emerald-500/10 text-tiq-ink"
                      : wrong
                      ? "border-red-500/50 bg-red-500/10 text-tiq-ink"
                      : isSelected
                      ? "border-tiq-mint bg-tiq-mintLight text-tiq-ink ring-2 ring-tiq-mint/30"
                      : connected
                      ? "border-tiq-mint bg-tiq-mintLight/50 text-tiq-ink"
                      : "border-tiq-border bg-white text-slate-700 hover:border-tiq-mint/30"
                  }`}
                >
                  {term.text}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {defs.map((def, idx) => {
              const connectedTo = Object.entries(connections).find(([, d]) => d === idx);
              const connected = !!connectedTo;
              const correct = showResults && connected && isCorrect(parseInt(connectedTo[0]), idx);
              const wrong = showResults && connected && !correct;
              return (
                <div
                  key={idx}
                  ref={(el) => { defRefs.current[idx] = el; }}
                  onClick={() => handleDefClick(idx)}
                  className={`px-3 py-2.5 rounded-lg border text-xs transition cursor-pointer ${
                    correct
                      ? "border-emerald-500/50 bg-emerald-500/10 text-tiq-ink"
                      : wrong
                      ? "border-red-500/50 bg-red-500/10 text-tiq-ink"
                      : selectedTerm !== null
                      ? "border-tiq-border bg-white text-slate-700 hover:border-tiq-mint/30 hover:bg-tiq-mintLight/50"
                      : "border-tiq-border bg-white text-slate-700"
                  }`}
                >
                  {def.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!answered && !checked && (
        <Button
          onClick={handleCheck}
          disabled={!allConnected}
          className="bg-tiq-mint text-white hover:bg-tiq-mint/90"
        >
          Check Answers
        </Button>
      )}

      {checked && !answered && !allCorrect && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-tiq-mint">{correctCount}</span> of {pairs.length} correct
          </div>
          <Button
            onClick={handleTryAgain}
            variant="outline"
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-tiq-mint text-white hover:bg-tiq-mint/90"
          >
            Continue
          </Button>
        </div>
      )}

      {answered && showExplanation && (
        <div className="p-3.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
          {allCorrect ? (
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-emerald-600">All correct! </span>
              Every term was matched to its definition.
            </p>
          ) : (
            <div>
              <p className="text-sm text-slate-700 mb-2">
                <span className="font-semibold text-tiq-mint">Correct matches: </span>
                {correctCount} of {pairs.length}
              </p>
              <ul className="space-y-1">
                {pairs.map((p, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    <span className="font-medium text-tiq-ink">{p.term}</span> — {p.definition}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}