import React, { useState, useEffect, useCallback, useRef } from "react";
import { Flag, Download, Upload, EyeOff, Eye, Check, RefreshCw, AlertCircle, Pencil, X, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { useCourses } from "@/lib/CoursesContext";
import { listFlags, setStatusForQuestion } from "@/lib/questionFlags";
import {
  fetchOverrides,
  suppressQuestion,
  clearOverride,
  replaceQuestion,
} from "@/lib/questionOverrides";
import { getCourse } from "@/lib/courses";
import { questionId } from "@/lib/questionId";

// Admin review queue for flagged questions.
//
// The round trip is deliberately file-based: download the flagged questions as
// JSON, edit them in whatever you like, upload the same file back. Each entry
// carries `question_id` — the ORIGINAL content hash — and that is what the
// re-upload matches on. Never the edited text, which by definition hashes
// differently. That is what makes the loop safe to repeat.

const STATUS_TABS = [
  { id: "open", label: "Open" },
  { id: "suppressed", label: "Suppressed" },
  { id: "resolved", label: "Resolved" },
  { id: "all", label: "All" },
];

// Find where a question lives now, so a flag can be shown with real context
// rather than raw ids.
function locate(courseId, qid) {
  const course = getCourse(courseId);
  if (!course) return null;
  for (const [mi, mod] of (course.modules || []).entries()) {
    for (const topic of mod.topics || []) {
      for (const q of topic.quiz || []) {
        if (questionId(q) === qid) {
          return { course, module: mod, moduleIndex: mi, topic, question: q };
        }
      }
    }
  }
  return { course, module: null, moduleIndex: -1, topic: null, question: null };
}


// Inline editor for a flagged question. The file round trip is still there for
// bulk work, but fixing one bad option shouldn't require exporting, editing JSON
// and re-uploading. Saving writes a `replace` override, so the correction lands
// for every learner immediately and the original question is never mutated —
// reverting restores exactly what shipped.
function QuestionEditor({ initial, onCancel, onSave, saving }) {
  const [draft, setDraft] = useState(() => ({
    q: initial?.q || "",
    options: Array.isArray(initial?.options) ? [...initial.options] : null,
    answer: typeof initial?.answer === "number" ? initial.answer : 0,
    answerText: initial?.answerText || "",
    explain: initial?.explain || "",
    questionType: initial?.questionType || "multiple-choice",
  }));

  const isMcq = draft.questionType === "multiple-choice" && Array.isArray(draft.options);
  const needsAnswerText = ["flashcard", "fill-in-the-blank"].includes(draft.questionType);

  const problems = [];
  if (!draft.q.trim()) problems.push("Question text is required");
  if (isMcq) {
    if (draft.options.length !== 4) problems.push("Multiple choice needs exactly 4 options");
    if (draft.options.some((o) => !String(o).trim())) problems.push("Options can't be blank");
    if (!draft.explain.trim()) problems.push("Explanation is required");
  }
  if (needsAnswerText && !draft.answerText.trim()) problems.push("Answer text is required");

  const setOption = (i, v) =>
    setDraft((d) => ({ ...d, options: d.options.map((o, idx) => (idx === i ? v : o)) }));

  const commit = () => {
    const out = { ...initial, q: draft.q.trim(), explain: draft.explain.trim() };
    if (isMcq) { out.options = draft.options.map((o) => String(o).trim()); out.answer = draft.answer; }
    if (needsAnswerText) out.answerText = draft.answerText.trim();
    onSave(out);
  };

  return (
    <div className="rounded-lg border border-tiq-mint/40 bg-tiq-mintLight/30 p-3.5 mb-3 space-y-3">
      <div>
        <label className="block text-[11px] font-medium text-tiq-ink mb-1">Question</label>
        <textarea
          value={draft.q}
          onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
          rows={2}
          className="w-full px-2.5 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint resize-none"
        />
      </div>

      {isMcq && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">
            Options — select the correct one
          </label>
          <div className="space-y-1.5">
            {draft.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={draft.answer === i}
                  onChange={() => setDraft((d) => ({ ...d, answer: i }))}
                  className="accent-tiq-mint shrink-0"
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} correct`}
                />
                <span className="text-[11px] font-mono-tiq text-slate-400 w-4 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  className={`flex-1 px-2.5 py-1.5 text-sm rounded-lg border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint ${
                    draft.answer === i ? "border-emerald-500/50" : "border-tiq-border"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {needsAnswerText && (
        <div>
          <label className="block text-[11px] font-medium text-tiq-ink mb-1">Answer</label>
          <input
            value={draft.answerText}
            onChange={(e) => setDraft((d) => ({ ...d, answerText: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint"
          />
        </div>
      )}

      <div>
        <label className="block text-[11px] font-medium text-tiq-ink mb-1">Explanation</label>
        <textarea
          value={draft.explain}
          onChange={(e) => setDraft((d) => ({ ...d, explain: e.target.value }))}
          rows={2}
          className="w-full px-2.5 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint resize-none"
        />
      </div>

      {problems.length > 0 && (
        <p className="text-[11px] text-amber-600">{problems.join(" · ")}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={commit}
          disabled={saving || problems.length > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-xs disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save & reinstate"}
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

export default function FlaggedQuestions() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshOverrides } = useCourses();
  const fileRef = useRef(null);

  const [status, setStatus] = useState("open");
  const [flags, setFlags] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [installed, setInstalled] = useState(true);
  const [busy, setBusy] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rows, ovr] = await Promise.all([listFlags({ status }), fetchOverrides()]);
      setFlags(rows);
      setOverrides(ovr || []);
      setInstalled(true);
    } catch {
      setInstalled(false);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const overrideFor = (courseId, qid) =>
    overrides.find((o) => o.course_id === courseId && o.question_id === qid) || null;

  // Group flags by question — several learners may report the same one, and the
  // admin acts on the question, not on each individual report.
  const grouped = [];
  const seen = new Map();
  for (const f of flags) {
    const key = `${f.course_id}::${f.question_id}`;
    if (seen.has(key)) { seen.get(key).reports.push(f); continue; }
    const entry = { key, courseId: f.course_id, questionId: f.question_id, reports: [f] };
    seen.set(key, entry);
    grouped.push(entry);
  }

  const act = async (entry, fn, successMsg) => {
    setBusy(entry.key);
    try {
      await fn();
      await refreshOverrides?.();
      await load();
      toast({ title: successMsg });
    } catch (err) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const suppress = (entry) => {
    const found = locate(entry.courseId, entry.questionId);
    return act(
      entry,
      async () => {
        await suppressQuestion({
          courseId: entry.courseId,
          questionId: entry.questionId,
          moduleId: found?.module?.id,
          topicId: found?.topic?.id,
          userId: user?.id,
        });
        await setStatusForQuestion(entry.courseId, entry.questionId, "suppressed");
      },
      "Question removed from the pool"
    );
  };

  const reinstate = (entry) =>
    act(
      entry,
      async () => {
        await clearOverride({ courseId: entry.courseId, questionId: entry.questionId });
        await setStatusForQuestion(entry.courseId, entry.questionId, "open");
      },
      "Question reinstated"
    );

  // Editing writes a `replace` override — the shipped question is never mutated,
  // so "Reinstate original" still restores exactly what came with the course.
  const saveEdit = (entry, replacement) => {
    const found = locate(entry.courseId, entry.questionId);
    return act(
      entry,
      async () => {
        await replaceQuestion({
          courseId: entry.courseId,
          questionId: entry.questionId,
          replacement,
          moduleId: found?.module?.id,
          topicId: found?.topic?.id,
          userId: user?.id,
        });
        await setStatusForQuestion(entry.courseId, entry.questionId, "resolved");
        setEditing(null);
      },
      "Question updated and back in circulation"
    );
  };

  const dismiss = (entry) =>
    act(entry, () => setStatusForQuestion(entry.courseId, entry.questionId, "dismissed"), "Flag dismissed");

  // ---------- Download ----------
  const download = () => {
    const items = grouped.map((entry) => {
      const found = locate(entry.courseId, entry.questionId);
      const snapshot = entry.reports[0]?.question || found?.question || null;
      return {
        // Match key on re-upload. Do not edit.
        question_id: entry.questionId,
        course_id: entry.courseId,
        course_title: found?.course?.title || null,
        module_id: found?.module?.id || null,
        module_title: found?.module?.title || null,
        topic_id: found?.topic?.id || null,
        topic_title: found?.topic?.title || null,
        status: overrideFor(entry.courseId, entry.questionId)?.action || "active",
        reports: entry.reports.map((r) => ({
          reason: r.reason,
          note: r.note,
          reported_at: r.created_at,
        })),
        // Edit this object, keep question_id above unchanged, re-upload.
        question: snapshot,
      };
    });

    const payload = {
      schema: 1,
      kind: "tradeiq-flagged-questions",
      exported_at: new Date().toISOString(),
      instructions:
        "Edit the `question` object of any entry you want to fix, then upload this same file back. " +
        "`question_id` is how each replacement is matched — leave it exactly as is. " +
        "Delete entries you don't want to change. Setting `question` to null removes (suppresses) the question.",
      items,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradeiq-flagged-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${items.length} question${items.length === 1 ? "" : "s"}` });
  };

  // ---------- Upload ----------
  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    let payload;
    try {
      payload = JSON.parse(await file.text());
    } catch {
      toast({ title: "Not valid JSON", variant: "destructive" });
      return;
    }
    if (payload?.kind !== "tradeiq-flagged-questions" || !Array.isArray(payload.items)) {
      toast({
        title: "Wrong file",
        description: "Expected a file exported from this panel.",
        variant: "destructive",
      });
      return;
    }

    // Validate everything BEFORE writing anything, so a bad file can't leave the
    // course half-corrected.
    const problems = [];
    payload.items.forEach((item, i) => {
      const at = `Entry ${i + 1}`;
      if (!item.question_id) problems.push(`${at}: missing question_id`);
      if (!item.course_id) problems.push(`${at}: missing course_id`);
      if (item.question === null) return; // explicit suppression
      const q = item.question;
      if (!q || typeof q !== "object") { problems.push(`${at}: missing question object`); return; }
      if (!q.q) problems.push(`${at}: question has no text ('q')`);
      const type = q.questionType || "multiple-choice";
      if (type === "multiple-choice") {
        if (!Array.isArray(q.options) || q.options.length !== 4) problems.push(`${at}: needs exactly 4 options`);
        if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) problems.push(`${at}: 'answer' must be 0-3`);
        if (!q.explain) problems.push(`${at}: missing 'explain'`);
      } else if (type === "flashcard" || type === "fill-in-the-blank") {
        if (!q.answerText) problems.push(`${at}: missing 'answerText'`);
      } else if (type === "sorting") {
        if (!Array.isArray(q.options) || q.options.length < 2) problems.push(`${at}: sorting needs 2+ options`);
      } else if (type === "term-match") {
        if (!Array.isArray(q.pairs) || q.pairs.length < 2) problems.push(`${at}: term-match needs 2+ pairs`);
      }
    });

    if (problems.length) {
      toast({
        title: `${problems.length} problem${problems.length === 1 ? "" : "s"} — nothing was changed`,
        description: problems.slice(0, 4).join(" · ") + (problems.length > 4 ? " …" : ""),
        variant: "destructive",
      });
      return;
    }

    setBusy("upload");
    let replaced = 0;
    let suppressed = 0;
    try {
      for (const item of payload.items) {
        if (item.question === null) {
          await suppressQuestion({
            courseId: item.course_id,
            questionId: item.question_id,
            moduleId: item.module_id,
            topicId: item.topic_id,
            userId: user?.id,
          });
          suppressed += 1;
        } else {
          await replaceQuestion({
            courseId: item.course_id,
            questionId: item.question_id,
            replacement: item.question,
            moduleId: item.module_id,
            topicId: item.topic_id,
            userId: user?.id,
          });
          replaced += 1;
        }
        await setStatusForQuestion(item.course_id, item.question_id, "resolved");
      }
      await refreshOverrides?.();
      await load();
      toast({
        title: "Applied",
        description: `${replaced} replaced, ${suppressed} suppressed. Live for all users now.`,
      });
    } catch (err) {
      toast({ title: "Upload failed partway", description: err.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  if (!installed) {
    return (
      <section className="rounded-xl border border-tiq-border bg-white p-5">
        <h2 className="font-slab text-base text-tiq-ink font-bold mb-2 flex items-center gap-2">
          <Flag className="w-4 h-4 text-tiq-gold" />
          Flagged questions
        </h2>
        <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-lg bg-tiq-mintLight border border-tiq-border p-3.5">
          <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-tiq-ink mb-1">Not installed yet</p>
            <p>
              Run <code className="font-mono-tiq text-xs">migrations/001_question_flags_and_overrides.sql</code> in
              the Supabase SQL editor. Until then, reporting stays hidden for learners and courses load exactly as shipped.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-tiq-border bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-slab text-base text-tiq-ink font-bold flex items-center gap-2">
            <Flag className="w-4 h-4 text-tiq-gold" />
            Flagged questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Suppressing hides a question everywhere — quizzes, practice and review — until you reinstate it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={download}
            disabled={grouped.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy === "upload"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-xs disabled:opacity-60"
          >
            <Upload className="w-3.5 h-3.5" /> {busy === "upload" ? "Applying…" : "Upload fixes"}
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={upload} className="hidden" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setStatus(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              status === t.id
                ? "bg-tiq-mint text-white"
                : "border border-tiq-border text-slate-600 hover:bg-tiq-mintLight"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 py-6 text-center">Loading…</p>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">
          {status === "open" ? "Nothing flagged. " : "Nothing here. "}
          <span className="text-slate-400">Learners can report a question from any quiz.</span>
        </p>
      ) : (
        <ul className="space-y-3">
          {grouped.map((entry) => {
            const found = locate(entry.courseId, entry.questionId);
            const ovr = overrideFor(entry.courseId, entry.questionId);
            const snapshot = entry.reports[0]?.question || found?.question;
            const isSuppressed = ovr?.action === "suppress";
            const isReplaced = ovr?.action === "replace";
            const working = busy === entry.key;

            return (
              <li key={entry.key} className="rounded-lg border border-tiq-border p-4">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-tiq-ink">{found?.course?.title || entry.courseId}</span>
                    {found?.module && (
                      <>
                        <span>·</span>
                        <span>Module {found.moduleIndex + 1}: {found.module.title}</span>
                      </>
                    )}
                    {found?.topic && (
                      <>
                        <span>·</span>
                        <span>{found.topic.title}</span>
                      </>
                    )}
                    <span>·</span>
                    <code className="font-mono-tiq">{entry.questionId}</code>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSuppressed && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500/10 text-red-600">
                        Removed from pool
                      </span>
                    )}
                    {isReplaced && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        Replaced
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {entry.reports.length} report{entry.reports.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-tiq-ink font-medium mb-2">{snapshot?.q || "(question no longer in course)"}</p>

                {snapshot?.options && (
                  <ul className="text-xs text-slate-500 space-y-0.5 mb-2.5">
                    {snapshot.options.map((o, i) => (
                      <li key={i} className={i === snapshot.answer ? "text-emerald-600 font-medium" : ""}>
                        {String.fromCharCode(65 + i)}. {o}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-1.5 mb-3">
                  {entry.reports.map((r) => (
                    <div key={r.id} className="text-xs rounded bg-tiq-mintLight/60 border border-tiq-border p-2.5">
                      <span className="font-medium text-tiq-ink capitalize">{r.reason}</span>
                      {r.note && <span className="text-slate-600"> — {r.note}</span>}
                      <span className="text-slate-400"> · {new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>

                {editing === entry.key && (
                  <QuestionEditor
                    initial={ovr?.action === "replace" ? ovr.replacement : snapshot}
                    saving={working}
                    onCancel={() => setEditing(null)}
                    onSave={(replacement) => saveEdit(entry, replacement)}
                  />
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {editing !== entry.key && (
                    <button
                      onClick={() => setEditing(entry.key)}
                      disabled={working || !snapshot}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-xs disabled:opacity-50"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit question
                    </button>
                  )}
                  {isSuppressed || isReplaced ? (
                    <button
                      onClick={() => reinstate(entry)}
                      disabled={working}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs disabled:opacity-60"
                    >
                      <Eye className="w-3.5 h-3.5" /> Reinstate original
                    </button>
                  ) : (
                    <button
                      onClick={() => suppress(entry)}
                      disabled={working}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/5 transition text-xs disabled:opacity-60"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Remove from pool
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(entry)}
                    disabled={working}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-500 hover:bg-tiq-mintLight transition text-xs disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" /> Dismiss
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
