import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ChevronDown, Pencil, Save, RotateCcw, AlertCircle, X,
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
import { SearchBox, FilterChips, ResultCount, EmptyState, matchesQuery } from "@/components/admin/AdminUI";

const field =
  "w-full px-3 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink focus:outline-none focus:border-tiq-mint";

// One editable text field backed by a content override.
//
// Read-only until you press Edit, matching how questions behave — an admin
// scrolling a course to review it should not be looking at a page of open
// textareas, and an always-editable field gives no way to abandon a change
// short of retyping it. Cancel discards the draft; Revert deletes the override
// entirely so the field returns byte-identical to what the course shipped with.
function TextField({ label, hint, value, shipped, multiline, rows = 3, onSave, onRevert, edited, busy }) {
  // Effective text: the override when set, otherwise whatever ships.
  const effective = (value ?? "").toString().trim().length > 0 ? value : (shipped ?? "");

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(effective);

  useEffect(() => { setDraft(effective); }, [effective]);

  // Seed from the EFFECTIVE text, not the override. A lesson that has never been
  // edited has no override, so seeding from that would open an empty box and
  // invite someone to retype a page of markdown from scratch.
  const startEdit = () => { setDraft(effective); setEditing(true); };
  const cancel = () => { setDraft(effective); setEditing(false); };
  const commit = async () => { await onSave(draft); setEditing(false); };

  const Tag = multiline ? "textarea" : "input";

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <label className="text-[11px] font-medium text-tiq-ink">{label}</label>
        <div className="flex items-center gap-1.5">
          {edited && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiq-mint/10 text-tiq-mint">Edited</span>
          )}
          {!editing && (
            <button
              onClick={startEdit}
              disabled={busy}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-tiq-mint hover:bg-tiq-mintLight transition disabled:opacity-40"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
      </div>
      {hint && editing && <p className="text-[11px] text-slate-500 mb-1">{hint}</p>}

      {editing ? (
        <>
          <Tag
            value={draft}
            rows={multiline ? rows : undefined}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            placeholder={shipped || ""}
            className={`${field} ${multiline ? "resize-y font-mono text-xs leading-relaxed" : ""}`}
          />
          <div className="flex items-center gap-2 mt-1.5">
            <button
              onClick={commit}
              disabled={busy || draft === effective}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-[11px] disabled:opacity-40"
            >
              <Save className="w-3 h-3" /> Save
            </button>
            <button
              onClick={cancel}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-[11px]"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            {edited && (
              <button
                onClick={async () => { await onRevert(); setEditing(false); }}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-[11px]"
              >
                <RotateCcw className="w-3 h-3" /> Revert to original
              </button>
            )}
          </div>
        </>
      ) : (
        <div
          className={`w-full px-3 py-2 rounded-lg border border-tiq-border bg-tiq-mintLight/30 text-tiq-ink ${
            multiline ? "font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto" : "text-sm"
          }`}
        >
          {effective || <span className="text-slate-400 italic">Empty</span>}
        </div>
      )}
    </div>
  );
}

export default function AdminCourseEditor() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshContent, refreshOverrides, courses: allCourses } = useCourses();

  const [installed, setInstalled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});      // path -> value
  const [qOverrides, setQOverrides] = useState({}); // questionId -> row
  const [openModule, setOpenModule] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);
  const [editingQ, setEditingQ] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pickQuery, setPickQuery] = useState("");
  const [query, setQuery] = useState("");

  const course = getCourse(courseId);

  // Course picker search.
  const pickedCourses = (allCourses || []).filter((c) =>
    matchesQuery(pickQuery, c.title, c.subtitle, c.description, c.id, c.category)
  );

  // In-course search.
  //
  // A course is 4 modules deep and ~120 questions wide, so scrolling to find the
  // one lesson or the one wrong answer is the slow part of the job. A module is
  // kept when it matches itself OR contains a matching topic, and its topic list
  // is narrowed to the matches — searching "murabaha" should show the lessons
  // that mention it, not every lesson in a module that happens to.
  const q = query.trim();
  const topicMatches = (t) =>
    matchesQuery(
      query,
      t.title,
      t.lesson,
      t.id,
      (t.quiz || []).map((x) => `${x.q || ""} ${(x.options || []).join(" ")} ${x.answerText || ""} ${x.explain || ""}`).join(" "),
    );

  const visibleModules = !q
    ? (course?.modules || [])
    : (course?.modules || [])
        .map((m) => {
          const selfMatch = matchesQuery(query, m.title, m.subtitle, m.overview, m.id);
          const topics = (m.topics || []).filter(topicMatches);
          // A module matching on its own title still shows all its topics —
          // otherwise searching a module name returns a module with nothing in it.
          if (selfMatch && topics.length === 0) return { ...m, topics: m.topics || [] };
          return topics.length ? { ...m, topics } : null;
        })
        .filter(Boolean);

  const totalTopics = (course?.modules || []).reduce((n, m) => n + (m.topics || []).length, 0);
  const shownTopics = visibleModules.reduce((n, m) => n + (m.topics || []).length, 0);

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

  // /admin/editor with no course selected: pick one. Keeps the button on the
  // admin page pointing at a single stable URL.
  if (!courseId) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to admin
        </Link>
        <h1 className="font-slab text-2xl text-tiq-ink font-bold mb-1">Course Editor</h1>
        <p className="text-sm text-slate-500 mb-4">
          Pick a course to read and edit its lessons, questions and answers.
        </p>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <SearchBox
            value={pickQuery}
            onChange={setPickQuery}
            placeholder="Search courses by name, category or id…"
            autoFocus
          />
          <ResultCount
            shown={pickedCourses.length}
            total={(allCourses || []).length}
            noun="course"
          />
        </div>

        {pickedCourses.length === 0 ? (
          <EmptyState>No courses match that search.</EmptyState>
        ) : (
        <ul className="space-y-2">
          {pickedCourses.map((c) => {
            const modules = (c.modules || []).length;
            const topics = (c.modules || []).reduce((s2, m) => s2 + (m.topics || []).length, 0);
            const questions = (c.modules || []).flatMap((m) => m.topics || []).reduce((s2, t) => s2 + (t.quiz || []).length, 0);
            return (
              <li key={c.id}>
                <Link
                  to={`/admin/course/${c.id}`}
                  className="flex items-center gap-3 rounded-lg border border-tiq-border bg-white p-4 hover:border-tiq-mint/40 transition"
                >
                  <BookOpen className="w-5 h-5 text-tiq-mint shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-tiq-ink truncate">{c.title}</p>
                    <p className="text-xs text-slate-500">
                      {modules} modules · {topics} lessons · {questions} questions
                    </p>
                  </div>
                  <span className="text-xs font-medium text-tiq-mint shrink-0">Open →</span>
                </Link>
              </li>
            );
          })}
        </ul>
        )}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-slate-600 mb-3">Course not found.</p>
        <Link to="/admin/editor" className="text-tiq-mint hover:underline text-sm">Pick another course</Link>
      </div>
    );
  }

  const run = async (fn, msg) => {
    if (!installed) {
      toast({
        title: "Saving isn't enabled yet",
        description: "Run migrations/004_content_overrides.sql first.",
        variant: "destructive",
      });
      return;
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>

      <h1 className="font-slab text-2xl text-tiq-ink font-bold mb-1">Edit course</h1>
      <p className="text-sm text-slate-500 mb-4">
        {course.title} — every change applies to all learners immediately. Blank a field and
        save to restore the original text.
      </p>

      {/* Reviewing the course must not depend on a migration — only saving does.
          The whole course renders either way; editing is simply disabled. */}
      {!installed && (
        <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-lg bg-tiq-mintLight border border-tiq-border p-3.5 mb-6">
          <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-tiq-ink mb-1">Read-only — saving not enabled yet</p>
            <p>
              Run <code className="font-mono-tiq text-xs">migrations/004_content_overrides.sql</code> in
              the Supabase SQL editor to enable editing. You can review everything below in the
              meantime.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search lessons, questions, answers, explanations…"
        />
        <ResultCount shown={shownTopics} total={totalTopics} noun="lesson" />
      </div>

      {/* Course-level text. Sits above the modules because it is what a visitor
          arriving from a shared link reads first. */}
      {!loading && !q && (
        <div className="rounded-xl border border-tiq-border bg-white p-4 mb-3">
          <TextField
            label="Course intro"
            hint="Two or three sentences on what the course covers. Shown at the top of the course page, which is the first thing someone sees when the link is shared."
            multiline
            rows={4}
            value={content["course:intro"] ?? ""}
            shipped={course.intro || course.description}
            edited={content["course:intro"] !== undefined}
            busy={busy || !installed}
            onSave={(v) => saveText("course:intro", v)}
            onRevert={() => revertText("course:intro")}
          />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500 py-6 text-center">Loading…</p>
      ) : visibleModules.length === 0 ? (
        <EmptyState>Nothing in this course matches that search.</EmptyState>
      ) : (
        <div className="space-y-3">
          {visibleModules.map((mod) => {
            // Index within the whole course, so the M-number stays correct
            // when the list is filtered by a search.
            const mi = (course.modules || []).findIndex((m) => m.id === mod.id);
            // While searching, everything that survived the filter is open — the
            // point of the search is to see the matches, not to hunt for them.
            const modOpen = q ? true : openModule === mod.id;
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
                        edited={content[`module:${mod.id}:title`] !== undefined} busy={busy || !installed}
                        onSave={(v) => saveText(`module:${mod.id}:title`, v)}
                        onRevert={() => revertText(`module:${mod.id}:title`)}
                      />
                      <TextField
                        label="Module subtitle" value={content[`module:${mod.id}:subtitle`] ?? ""} shipped={mod.subtitle}
                        edited={content[`module:${mod.id}:subtitle`] !== undefined} busy={busy || !installed}
                        onSave={(v) => saveText(`module:${mod.id}:subtitle`, v)}
                        onRevert={() => revertText(`module:${mod.id}:subtitle`)}
                      />
                    </div>
                    <TextField
                      label="Module overview" hint="Markdown. Shown on the module overview page."
                      multiline rows={5}
                      value={content[`module:${mod.id}:overview`] ?? ""} shipped={mod.overview}
                      edited={content[`module:${mod.id}:overview`] !== undefined} busy={busy || !installed}
                      onSave={(v) => saveText(`module:${mod.id}:overview`, v)}
                      onRevert={() => revertText(`module:${mod.id}:overview`)}
                    />
                    <TextField
                      label="Learning objectives" hint="One per line."
                      multiline rows={4}
                      value={(content[`module:${mod.id}:objectives`] ?? []).join("\n")}
                      shipped={(mod.objectives || []).join("\n")}
                      edited={content[`module:${mod.id}:objectives`] !== undefined} busy={busy || !installed}
                      onSave={(v) => saveText(`module:${mod.id}:objectives`, v.split("\n").map((x) => x.trim()).filter(Boolean))}
                      onRevert={() => revertText(`module:${mod.id}:objectives`)}
                    />

                    {/* Topics */}
                    <div>
                      <h3 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-2">Lessons</h3>
                      <div className="space-y-2">
                        {mod.topics.map((topic) => {
                          const tOpen = q ? true : openTopic === topic.id;
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
                                    edited={content[`topic:${topic.id}:title`] !== undefined} busy={busy || !installed}
                                    onSave={(v) => saveText(`topic:${topic.id}:title`, v)}
                                    onRevert={() => revertText(`topic:${topic.id}:title`)}
                                  />
                                  <TextField
                                    label="Lesson content" hint="Markdown. Supports {{diagram:id}} placeholders."
                                    multiline rows={14}
                                    value={content[`topic:${topic.id}:lesson`] ?? ""} shipped={topic.lesson}
                                    edited={content[`topic:${topic.id}:lesson`] !== undefined} busy={busy || !installed}
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
                                                  disabled={busy || !installed}
                                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-[11px] disabled:opacity-50"
                                                >
                                                  <Pencil className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                  onClick={() => toggleSuppress(qid, found, suppressed)}
                                                  disabled={busy || !installed}
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
