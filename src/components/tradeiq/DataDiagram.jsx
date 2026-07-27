import React from "react";
import { ArrowRight, ArrowDown, RefreshCw } from "lucide-react";

// Data-driven diagram renderer for uploaded courses.
// Course JSON defines diagrams as: { "diagram-id": { layout, title?, caption?, items | columns } }
// Layouts: "flow" | "cycle" | "comparison" | "stack" | "grid"

// Accept both string items and {label, desc} objects — generated JSON uses either.
function asText(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return [v.label, v.desc].filter(Boolean).join(" — ") || JSON.stringify(v);
}

function asItem(v) {
  if (v == null) return { label: "" };
  if (typeof v === "string" || typeof v === "number") return { label: String(v) };
  return { label: asTextLabel(v.label), desc: v.desc != null ? asTextLabel(v.desc) : undefined, accent: !!v.accent };
}

function asTextLabel(v) {
  if (v == null) return "";
  return typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v);
}

function Box({ label, desc, accent = false }) {
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-center min-w-[110px] ${accent ? "border-tiq-gold/50 bg-tiq-gold/10" : "border-tiq-mint/40 bg-tiq-mint/5"}`}>
      <p className="text-sm font-semibold text-tiq-ink leading-snug">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>}
    </div>
  );
}

export default function DataDiagram({ spec }) {
  if (!spec || !spec.layout) return null;
  const { layout, title, caption } = spec;
  const items = (spec.items || []).map(asItem);
  const columns = (spec.columns || []).map((c) => ({
    title: asTextLabel(c?.title),
    items: (c?.items || []).map(asText),
  }));

  return (
    <div className="my-2">
      {title && (
        <p className="font-slab text-sm text-tiq-ink font-bold mb-3 text-center">{title}</p>
      )}

      {layout === "flow" && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <Box label={it.label} desc={it.desc} accent={it.accent} />
              {i < items.length - 1 && <ArrowRight className="w-4 h-4 text-tiq-mint shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {layout === "cycle" && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <Box label={it.label} desc={it.desc} accent={it.accent} />
              {i < items.length - 1 && <ArrowRight className="w-4 h-4 text-tiq-mint shrink-0" />}
            </React.Fragment>
          ))}
          <span className="flex items-center gap-1 text-xs text-tiq-mint ml-1">
            <RefreshCw className="w-4 h-4" /> repeats
          </span>
        </div>
      )}

      {layout === "comparison" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {columns.map((col, ci) => (
            <div key={ci} className="rounded-lg border border-tiq-border bg-white p-4">
              <p className="text-sm font-slab font-bold text-tiq-mint mb-2 text-center">{col.title}</p>
              <ul className="space-y-1.5">
                {(col.items || []).map((item, ii) => (
                  <li key={ii} className="text-xs text-slate-600 flex gap-1.5">
                    <span className="text-tiq-mint shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {layout === "stack" && (
        <div className="flex flex-col items-center gap-1.5">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <div
                className={`rounded-lg border px-4 py-2 text-center ${it.accent ? "border-tiq-gold/50 bg-tiq-gold/10" : "border-tiq-mint/40 bg-tiq-mint/5"}`}
                style={{ width: `${Math.max(40, 100 - i * (50 / Math.max(items.length - 1, 1)))}%` }}
              >
                <p className="text-sm font-semibold text-tiq-ink">{it.label}</p>
                {it.desc && <p className="text-xs text-slate-500 mt-0.5">{it.desc}</p>}
              </div>
              {i < items.length - 1 && <ArrowDown className="w-3.5 h-3.5 text-tiq-mint" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {layout === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {items.map((it, i) => (
            <Box key={i} label={it.label} desc={it.desc} accent={it.accent} />
          ))}
        </div>
      )}

      {caption && (
        <p className="text-xs text-slate-500 text-center mt-3 italic">{caption}</p>
      )}
    </div>
  );
}
