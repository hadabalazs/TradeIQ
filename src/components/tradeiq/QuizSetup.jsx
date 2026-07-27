import React, { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";

export default function QuizSetup({ course, onStart }) {
  const [difficulty, setDifficulty] = useState("beginner");
  const [count, setCount] = useState(10);

  const levels = course?.difficultyLevels || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-1">Practice Quiz</h2>
        <p className="text-slate-600 text-sm">
          Test your knowledge — quiz only, no lesson. Review missed answers at the end.
        </p>
      </div>

      {/* Difficulty selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-tiq-ink mb-3 block">Difficulty</label>
        <div className="grid grid-cols-2 gap-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setDifficulty(level.id)}
              className={`text-left p-4 rounded-xl border transition ${
                difficulty === level.id
                  ? "bg-tiq-mint/10 border-tiq-mint text-tiq-ink"
                  : "bg-white border-tiq-border hover:border-tiq-mint/30 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{level.label}</span>
                {difficulty === level.id && (
                  <span className="w-2 h-2 rounded-full bg-tiq-mint" />
                )}
              </div>
              <p className="text-xs text-slate-500">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Question count selection */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-tiq-ink mb-3 block">
          Number of Questions
        </label>
        <div className="flex gap-2">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-2.5 rounded-lg border transition text-sm font-medium ${
                count === n
                  ? "bg-tiq-mint text-white border-tiq-mint"
                  : "bg-white border-tiq-border text-slate-600 hover:border-tiq-mint/30"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(difficulty, count)}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
      >
        <Zap className="w-4 h-4" />
        Start Practice Quiz
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}