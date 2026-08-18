import React, { useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";

// Full question editor for the admin course editor. Unlike the compact editor in
// the flagged-questions queue, this one can CHANGE THE QUESTION TYPE, so a badly
// framed multiple-choice can become a sorting question rather than being deleted
// and re-authored.
//
// Switching type keeps whatever carries over — the question text always, and the
// options list between multiple-choice and sorting, since both are ordered lists
// of strings. Nothing is silently dropped: fields the new type doesn't use stay
// in the draft and come back if you switch back before saving.

export const QUESTION_TYPES = [
  { id: "multiple-choice", label: "Multiple choice", hint: "Exactly 4 options, one correct" },
  { id: "flashcard", label: "Flashcard", hint: "Self-graded — excluded from the final exam" },
  { id: "fill-in-the-blank", label: "Fill in the blank", hint: "Short typed answer" },
  { id: "sorting", label: "Sorting", hint: "Options stored in the CORRECT order" },
  { id: "term-match", label: "Term match", hint: "Pairs of term and definition" },
];

// Mirrors the validator in courseUtils.js, so anything saved here would also
// pass a course import.
export function validateQuestion(q) {
  const problems = [];
  const type = q.questionType || "multiple-choice";
  if (!String(q.q || "").trim()) problems.push("Question text is required");

  if (type === "multiple-choice") {
    if (!Array.isArray(q.options) || q.options.length !== 4) problems.push("Needs exactly 4 options");
    else if (q.options.some((o) => !String(o).trim())) problems.push("Options can't be blank");
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) problems.push("Pick the correct option");
    if (!String(q.explain || "").trim()) problems.push("Explanation is required");
  } else if (type === "flashcard" || type === "fill-in-the-blank") {
    if (!String(q.answerText || "").trim()) problems.push("Answer text is required");
    if (!String(q.explain || "").trim()) problems.push("Explanation is required");
  } else if (type === "sorting") {
    if (!Array.isArray(q.options) || q.options.length < 2) problems.push("Sorting needs 2+ items");
    else if (q.options.some((o) => !String(o).trim())) problems.push("Items can't be blank");
    if (!String(q.explain || "").trim()) problems.push("Explanation is required");
  } else if (type === "term-match") {
    if (!Array.isArray(q.pairs) || q.pairs.length < 2) problems.push("Term match needs 2+ pairs");
    else if (q.pairs.some((p) => !String(p?.term || "").trim() || !String(p?.definition || "").trim()))
      problems.push("Every pair needs a term and a definition");
  }
  return problems;
}

const field =
  "w-full px-2.5 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint";

export default function QuestionFullEditor({ initial, onCancel, onSave, saving }) {
  const [draft, setDraft] = useState(() => ({
    q: initial?.q || "",
    questionType: initial?.questionType || "multiple-choice",
    options: Array.isArray(initial?.options) ? [...initial.options] : ["", "", "", ""],
    answer: typeof initial?.answer === "number" ? initial.answer : 0,
    answerText: initial?.answerText || "",
    explain: initial?.explain || "",
    pairs: Array.isArray(initial?.pairs) ? initial.pairs.map((p) => ({ ...p })) : [
      { term: "", definition: "" },
      { term: "", definition: "" },
    ],
  }));

  const type = draft.questionType;
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  // Build the object in the shape the app expects for the chosen type, dropping
  // fields that type does not use so a saved question never carries misleading
  // leftovers (e.g. an `answer` index on a sorting question).
  const build = () => {
    const base = { q: draft.q.trim(), explain: draft.explain.trim() };
    if (type === "multiple-choice") {
      return { ...base, options: draft.options.map((o) => String(o).trim()), answer: draft.answer };
    }
    if (type === "flashcard" || type === "fill-in-the-blank") {
      return { ...base, answerText: draft.answerText.trim(), questionType: type };
    }
    if (type === "sorting") {
      return { ...base, options: draft.options.map((o) => String(o).trim()), questionType: type };
    }
    return {
      q: base.q,
      pairs: draft.pairs.map((p) => ({ term: p.term.trim(), definition: p.definition.trim() })),
      questionType: type,
    };
  };

  const problems = validateQuestion(build());

  const setOption = (i, v) => set({ options: draft.options.map((o, idx) => (idx === i ? v : o)) });
  const setPair = (i, key, v) =>
    set({ pairs: draft.pairs.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)) });

  return (
    <div className="rounded-lg border border-tiq-mint/40 bg-tiq-mintLight/30 p-4 space-y-3">
      {/* Type */}
      <div>
        <label className="block text-[11px] font-medium text-tiq-ink mb-1">Question type</label>
        <select value={type} onChange={(e) => set({ questionType: e.target.value })} className={field}>
          {QUESTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label} — {t.hint}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-tiq-ink mb-1">Question</label>
        <textarea value={draft.q} onChange={(e) => set({ q: e.target.value })} rows={2} className={`${field} resize-none`} />
        {type === "fill-in-the-blank" && (
          <p className="text-[11px] text-slate-500 mt-1">Use <code>_______</code> to mark the blank.</p>
        )}
      </div>

      {type === "multiple-choice" && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">Options — select the correct one</label>
          <div className="space-y-1.5">
            {draft.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={draft.answer === i}
                  onChange={() => set({ answer: i })}
                  className="accent-tiq-mint shrink-0"
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} correct`}
                />
                <span className="text-[11px] font-mono-tiq text-slate-400 w-4 shrink-0">{String.fromCharCode(65 + i)}</span>
                <input value={opt} onChange={(e) => setOption(i, e.target.value)} className={field} />
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "sorting" && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">
            Items in the CORRECT order — the app shuffles them for the learner
          </label>
          <div className="space-y-1.5">
            {draft.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[11px] font-mono-tiq text-slate-400 w-4 shrink-0">{i + 1}</span>
                <input value={opt} onChange={(e) => setOption(i, e.target.value)} className={field} />
                <button
                  onClick={() => set({ options: draft.options.filter((_, idx) => idx !== i) })}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => set({ options: [...draft.options, ""] })}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-tiq-mint hover:text-tiq-ink"
          >
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>
      )}

      {type === "term-match" && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">Pairs</label>
          <div className="space-y-1.5">
            {draft.pairs.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={p.term} onChange={(e) => setPair(i, "term", e.target.value)} placeholder="Term" className={`${field} max-w-[36%]`} />
                <input value={p.definition} onChange={(e) => setPair(i, "definition", e.target.value)} placeholder="Definition" className={field} />
                <button
                  onClick={() => set({ pairs: draft.pairs.filter((_, idx) => idx !== i) })}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 shrink-0"
                  aria-label="Remove pair"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => set({ pairs: [...draft.pairs, { term: "", definition: "" }] })}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-tiq-mint hover:text-tiq-ink"
          >
            <Plus className="w-3.5 h-3.5" /> Add pair
          </button>
        </div>
      )}

      {(type === "flashcard" || type === "fill-in-the-blank") && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">Answer</label>
          <input value={draft.answerText} onChange={(e) => set({ answerText: e.target.value })} className={field} />
          {type === "fill-in-the-blank" && (
            <p className="text-[11px] text-slate-500 mt-1">Keep it short — the learner types this.</p>
          )}
        </div>
      )}

      {type !== "term-match" && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">Explanation</label>
          <textarea value={draft.explain} onChange={(e) => set({ explain: e.target.value })} rows={2} className={`${field} resize-none`} />
        </div>
      )}

      {problems.length > 0 && <p className="text-[11px] text-amber-600">{problems.join(" · ")}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave(build())}
          disabled={saving || problems.length > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-xs disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save question"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}
