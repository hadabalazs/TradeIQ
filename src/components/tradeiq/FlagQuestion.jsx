import React, { useState, useEffect } from "react";
import { Flag, Check, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { submitFlag, flaggingAvailable, FLAG_REASONS } from "@/lib/questionFlags";

// Small "report this question" affordance shown alongside a question.
//
// Deliberately quiet: it sits at the edge of the question, not in the answer
// flow, so it never competes with answering. Hidden entirely for guests (flags
// are tied to a user so they can be followed up) and hidden when the migration
// hasn't been run, rather than offering a button that errors.
export default function FlagQuestion({ question, courseId, moduleId, topicId, className = "" }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("incorrect");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let alive = true;
    if (isAuthenticated) flaggingAvailable().then((ok) => alive && setAvailable(ok));
    return () => { alive = false; };
  }, [isAuthenticated]);

  if (!isAuthenticated || !available || !question) return null;

  const send = async () => {
    setSaving(true);
    try {
      await submitFlag({ question, courseId, moduleId, topicId, reason, note, userId: user.id });
      setSent(true);
      setOpen(false);
      setNote("");
      toast({ title: "Thanks — reported", description: "An admin will review this question." });
    } catch (err) {
      toast({
        title: "Couldn't send the report",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (sent) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-emerald-600 ${className}`}>
        <Check className="w-3.5 h-3.5" />
        Reported
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-tiq-gold transition ${className}`}
        title="Report a problem with this question"
      >
        <Flag className="w-3.5 h-3.5" />
        Report
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Report a problem with this question"
        >
          <div className="w-full sm:max-w-md bg-tiq-navy rounded-2xl border border-tiq-border shadow-xl p-5 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-slab text-lg text-tiq-ink font-bold">Report this question</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cancel"
                className="w-8 h-8 rounded-full border border-tiq-border flex items-center justify-center text-slate-500 hover:bg-tiq-mintLight transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3 line-clamp-3">{question.q}</p>

            <div className="space-y-1.5 mb-4">
              {FLAG_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition text-sm ${
                    reason === r.id
                      ? "border-tiq-mint bg-tiq-mint/10 text-tiq-ink"
                      : "border-tiq-border text-slate-600 hover:border-tiq-mint/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="flag-reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                    className="accent-tiq-mint"
                  />
                  {r.label}
                </label>
              ))}
            </div>

            <label className="block text-xs text-slate-500 mb-1.5" htmlFor="flag-note">
              What's wrong with it? <span className="text-slate-400">(optional, but it helps)</span>
            </label>
            <textarea
              id="flag-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="e.g. Option B is also correct — API2 is delivered ARA, but the question doesn't say which basis."
              className="w-full rounded-lg border border-tiq-border bg-white p-2.5 text-sm text-tiq-ink placeholder:text-slate-400 focus:outline-none focus:border-tiq-mint resize-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={send}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm disabled:opacity-60"
              >
                {saving ? "Sending…" : "Send report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
