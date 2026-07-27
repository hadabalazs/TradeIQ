import React, { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

export default function GlossaryPanel({ open, onClose, course }) {
  const [query, setQuery] = useState("");
  const [openTerms, setOpenTerms] = useState(new Set());

  const glossary = course?.glossary || [];

  const filtered = glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(query.toLowerCase()) ||
      g.def.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (term) => {
    const next = new Set(openTerms);
    if (next.has(term)) next.delete(term);
    else next.add(term);
    setOpenTerms(next);
  };

  return (
    <aside
      className={`h-full bg-white border-l border-tiq-border transition-all duration-300 flex flex-col overflow-hidden ${
        open ? "w-80" : "w-0"
      }`}
    >
      <div className="p-4 border-b border-tiq-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-slab text-tiq-ink font-bold">Glossary</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-tiq-ink">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-tiq-mintLight border border-tiq-border text-tiq-ink placeholder-slate-400 focus:outline-none focus:border-tiq-mint/50"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto tiq-scroll px-2 py-2">
        {filtered.map((g) => {
          const isOpen = openTerms.has(g.term);
          return (
            <div key={g.term} className="border-b border-tiq-border/50">
              <button
                onClick={() => toggle(g.term)}
                className="w-full flex items-center justify-between gap-2 px-2 py-2.5 text-left hover:bg-tiq-mintLight/50 rounded"
              >
                <span className="text-sm font-medium text-slate-700">{g.term}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="px-2 pb-3 text-[13px] text-slate-600 leading-relaxed">{g.def}</p>}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No terms found.</p>
        )}
      </div>
    </aside>
  );
}