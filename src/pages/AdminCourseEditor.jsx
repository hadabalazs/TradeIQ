import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ChevronDown, Pencil, Save, RotateCcw, AlertCircle,
  BookOpen, ClipboardList, Shield, EyeOff, Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { isAdminUser } from "@/lib/adminRole";
import { useCourses } from "@/lib/CoursesContext";
import { getCourse } from "@/lib/courses";
import { questionId } from "@/lib/questionId";
import {
  fetchContentOverrides, saveContentOverride, clearContentOverride,
} from "@/lib/contentOverrides";
import {
  fetchOverrides, replaceQuestion, suppressQuestion, clearOverride,
} from "@/lib/questionOverrides";
import QuestionFullEditor from "@/components/admin/QuestionFullEditor";

const field =
  "w-full px-3 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint";

// One editable text field backed by a content override. Blank restores the text
// the course shipped with, and "Revert" deletes the override outright so the
// field is byte-identical to the original rather than an empty string.
function TextField({ label, hint, value, shipped, multiline, rows = 3, onSave, onRevert, edited, busy }) {
  const [draft, setDraft] = useState(value ?? "");
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setDraft(value ?? ""); setDirty(false); }, [value]);

  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <label className="text-[11px] font-medium text-tiq-ink">{label}</label>
        {edited && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiq-mint/10 text-tiq-mint">Edited</span>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-500 mb-1">{hint}</p>}
      <Tag
        value={draft}
        rows={multiline ? rows : undefined}
        onChange={(e) => { setDraft(e.target.value); setDirty(true); }}
        placeholder={shipped || ""}
        className={`${field} ${multiline ? "resize-y font-mono text-xs leading-relaxed" : ""}`}
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={() => onSave(draft)}
          disabled={busy || !dirty}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-[11px] disabled:opacity-40"
        >
          <Save className="w-3 h-3" /> Save
        </button>
        {edited && (
          <button
            onClick={onRevert}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Revert
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminCourseEditor() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshContent, refreshOverrides } = useCourses();

  const [installed, setInstalled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});      // path -> value
  const [qOverrides, setQOverrides] = useState({}); // questionId -> row
  const [openModule, setOpenModule] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);
  const [editingQ, setEditingQ] = useState(null);
  const [busy, setBusy] = useState(false);

  const course = getCourse(courseId);

  const load = useCallback(async () => {
    setLoading(true);
    const [rows, qrows] = await Promise.all([fetchContentOverrides(), fetchOverrides()]);
    if (!rows) { setInstalled(false); setLoading(false); return; }
    setContent(Object.fromEntries(rows.filter((r) => r.course_id === courseId).map((r) => [r.path, r.value])));
    setQOverrides(Object.fromEntries((qrows || []).filter((r) => r.course_id === courseId).map((r) => [r.question_id, r])));
    setInstalled(true);
    setLoading(false);
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  if (!isAdminUser(user)) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h1 className="font-slab text-xl text-tiq-ink font-bold mb-2">Admins only</h1>
        <Link to="/" className="text-tiq-mint hover:underline text-sm">Back to courses</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-slate-600 mb-3">Course not found.</p>
        <Link to="/admin" className="text-tiq-mint hover:underline text-sm">Back to admin</Link>
      </div>
    );
  }

  const run = async (fn, msg) => {
    setBusy(true);
    try {
      await fn();
      await refreshContent?.();
      await refreshOverrides?.();
      await load();
      toast({ title: msg });
    } catch (err) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const saveText = (path, value) =>
    run(() => saveContentOverride({ courseId, path, value, userId: user?.id }), "Saved — live for all learners");
  const revertText = (path) =>
    run(() => clearContentOverride({ courseId, path }), "Reverted to the original text");

  const saveQuestion = (qid, replacement, found) =>
    run(async () => {
      await replaceQuestion({
        courseId, questionId: qid, replacement,
        moduleId: found?.moduleId, topicId: found?.topicId, userId: user?.id,
      });
      setEditingQ(null);
    }, "Question updated");

  const toggleSuppress = (qid, found, suppressed) =>
    run(async () => {
      if (suppressed) await clearOverride({ courseId, questionId: qid });
      else await suppressQuestion({
        courseId, questionId: qid,
        moduleId: found?.moduleId, topicId: found?.topicId, userId: user?.id,
      });
    }, suppressed ? "Question reinstated" : "Question removed from the pool");

  if (!installed) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to admin
        </Link>
        <div className="rounded-xl border border-tiq-border bg-white p-5">
          <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-lg bg-tiq-mintLight border border-tiq-border p-3.5">
            <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-tiq-ink mb-1">Not installed yet</p>
              <p>
                Run <code className="font-mono-tiq text-xs">migrations/004_content_overrides.sql</code> in
                the Supabase SQL editor to enable course editing. Until then courses render exactly as shipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>

      <h1 className="font-slab text-2xl text-tiq-ink font-bold mb-1">Edit course</h1>
      <p className="text-sm text-slate-500 mb-6">
        {course.title} — every change applies to all learners immediately. Blank a field and
        save to restore the original text.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500 py-6 text-center">Loading…</p>
      ) : (
        <div className="space-y-3">
          {course.modules.map((mod, mi) => {
            const modOpen = openModule === mod.id;
            return (
              <section key={mod.id} className="rounded-xl border border-tiq-border bg-white">
                <button
                  onClick={() => setOpenModule(modOpen ? null : mod.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className="text-xs font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded shrink-0">
                    M{mi + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-tiq-ink truncate">{mod.title}</span>
                    <span className="block text-xs text-slate-500">{mod.topics.length} lessons</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition ${modOpen ? "rotate-180" : ""}`} />
                </button>

                {modOpen && (
                  <div className="px-4 pb-4 space-y-4 border-t border-tiq-border pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <TextField
                        label="Module title" value={content[`module:${mod.id}:title`] ?? ""} shipped={mod.title}
                        edited={content[`module:${mod.id}:title`] !== undefined} busy={busy}
                        onSave={(v) => saveText(`module:${mod.id}:title`, v)}
                        onRevert={() => revertText(`module:${mod.id}:title`)}
                      />
                      <TextField
                        label="Module subtitle" value={content[`module:${mod.id}:subtitle`] ?? ""} shipped={mod.subtitle}
                        edited={content[`module:${mod.id}:subtitle`] !== undefined} busy={busy}
                        onSave={(v) => saveText(`module:${mod.id}:subtitle`, v)}
                        onRevert={() => revertText(`module:${mod.id}:subtitle`)}
                      />
                    </div>
                    <TextField
                      label="Module overview" hint="Markdown. Shown on the module overview page."
                      multiline rows={5}
                      value={content[`module:${mod.id}:overview`] ?? ""} shipped={mod.overview}
                      edited={content[`module:${mod.id}:overview`] !== undefined} busy={busy}
                      onSave={(v) => saveText(`module:${mod.id}:overview`, v)}
                      onRevert={() => revertText(`module:${mod.id}:overview`)}
                    />
                    <TextField
                      label="Learning objectives" hint="One per line."
                      multiline rows={4}
                      value={(content[`module:${mod.id}:objectives`] ?? []).join("\n")}
                      shipped={(mod.objectives || []).join("\n")}
                      edited={content[`module:${mod.id}:objectives`] !== undefined} busy={busy}
                      onSave={(v) => saveText(`module:${mod.id}:objectives`, v.split("\n").map((x) => x.trim()).filter(Boolean))}
                      onRevert={() => revertText(`module:${mod.id}:objectives`)}
                    />

                    {/* Topics */}
                    <div>
                      <h3 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-2">Lessons</h3>
                      <div className="space-y-2">
                        {mod.topics.map((topic) => {
                          const tOpen = openTopic === topic.id;
                          return (
                            <div key={topic.id} className="rounded-lg border border-tiq-border">
                              <button
                                onClick={() => setOpenTopic(tOpen ? null : topic.id)}
                                className="w-full flex items-center gap-2.5 p-3 text-left"
                              >
                                <BookOpen className="w-4 h-4 text-tiq-mint shrink-0" />
                                <span className="flex-1 min-w-0 text-sm text-tiq-ink truncate">{topic.title}</span>
                                <span className="text-[11px] text-slate-400 shrink-0">
                                  {(topic.quiz || []).length} questions
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition ${tOpen ? "rotate-180" : ""}`} />
                              </button>

                              {tOpen && (
                                <div className="px-3 pb-3 space-y-4 border-t border-tiq-border pt-3">
                                  <TextField
                                    label="Lesson title"
                                    value={content[`topic:${topic.id}:title`] ?? ""} shipped={topic.title}
                                    edited={content[`topic:${topic.id}:title`] !== undefined} busy={busy}
                                    onSave={(v) => saveText(`topic:${topic.id}:title`, v)}
                                    onRevert={() => revertText(`topic:${topic.id}:title`)}
                                  />
                                  <TextField
                                    label="Lesson content" hint="Markdown. Supports {{diagram:id}} placeholders."
                                    multiline rows={14}
                                    value={content[`topic:${topic.id}:lesson`] ?? ""} shipped={topic.lesson}
                                    edited={content[`topic:${topic.id}:lesson`] !== undefined} busy={busy}
                                    onSave={(v) => saveText(`topic:${topic.id}:lesson`, v)}
                                    onRevert={() => revertText(`topic:${topic.id}:lesson`)}
                                  />

                                  <div>
                                    <h4 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                      <ClipboardList className="w-3.5 h-3.5 text-tiq-mint" />
                                      Questions
                                    </h4>
                                    <ul className="space-y-2">
                                      {(topic.quiz || []).map((q, qi) => {
                                        const qid = questionId(q);
                                        const ovr = qOverrides[qid];
                                        const suppressed = ovr?.action === "suppress";
                                        const replaced = ovr?.action === "replace";
                                        const qType = q.questionType || "multiple-choice";
                                        const isEditing = editingQ === qid;
                                        const found = { moduleId: mod.id, topicId: topic.id };

                                        return (
                                          <li key={qid + qi} className="rounded-lg border border-tiq-border p-3">
                                            <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                                              <span className="text-[10px] font-mono-tiq text-slate-400">
                                                {qType} · {qid}
                                              </span>
                                              <div className="flex items-center gap-1.5">
                                                {replaced && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">Edited</span>}
                                                {suppressed && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-medium">Removed</span>}
                                              </div>
                                            </div>

                                            <p className="text-sm text-tiq-ink font-medium mb-1.5">{q.q}</p>

                                            {Array.isArray(q.options) && (
                                              <ul className="text-xs text-slate-500 space-y-0.5 mb-2">
                                                {q.options.map((o, i) => (
                                                  <li key={i} className={qType === "multiple-choice" && i === q.answer ? "text-emerald-600 font-medium" : ""}>
                                                    {qType === "sorting" ? `${i + 1}.` : `${String.fromCharCode(65 + i)}.`} {o}
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                            {q.answerText && <p className="text-xs text-emerald-600 mb-2">Answer: {q.answerText}</p>}
                                            {Array.isArray(q.pairs) && (
                                              <ul className="text-xs text-slate-500 space-y-0.5 mb-2">
                                                {q.pairs.map((p, i) => (
                                                  <li key={i}><span className="text-tiq-ink font-medium">{p.term}</span> — {p.definition}</li>
                                                ))}
                                              </ul>
                                            )}
                                            {q.explain && <p className="text-[11px] text-slate-500 italic mb-2">{q.explain}</p>}

                                            {isEditing ? (
                                              <QuestionFullEditor
                                                initial={q}
                                                saving={busy}
                                                onCancel={() => setEditingQ(null)}
                                                onSave={(replacement) => saveQuestion(qid, replacement, found)}
                                              />
                                            ) : (
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <button
                                                  onClick={() => setEditingQ(qid)}
                                                  disabled={busy}
                                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-[11px] disabled:opacity-50"
                                                >
                                                  <Pencil className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                  onClick={() => toggleSuppress(qid, found, suppressed)}
                                                  disabled={busy}
                                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-[11px] disabled:opacity-50 ${
                                                    suppressed
                                                      ? "border-tiq-border text-slate-600 hover:bg-tiq-mintLight"
                                                      : "border-red-500/30 text-red-600 hover:bg-red-500/5"
                                                  }`}
                                                >
                                                  {suppressed ? <><Eye className="w-3 h-3" /> Reinstate</> : <><EyeOff className="w-3 h-3" /> Remove</>}
                                                </button>
                                              </div>
                                            )}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
