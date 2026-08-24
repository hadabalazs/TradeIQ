import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Library, ChevronDown, Save, RotateCcw, Award, Trash2, AlertTriangle,
  FileText, ArrowRight, AlertCircle, Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { useCourses } from "@/lib/CoursesContext";
import { adminDeleteCourse } from "@/lib/remoteCourses";
import { useAdminCourses } from "@/lib/useAdminCourses";
import {
  fetchCourseOverrides, saveCourseOverride, clearCourseOverride,
} from "@/lib/courseOverrides";
import { AdminPage, SearchBox, FilterChips, ResultCount, EmptyState, matchesQuery } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";

const field =
  "w-full px-3 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink placeholder:text-slate-400 focus:outline-none focus:border-tiq-mint";

function Field({ label, hint, value, placeholder, onChange, multiline = false }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="block text-xs font-medium text-tiq-ink mb-1">{label}</label>
      {hint && <p className="text-[11px] text-slate-500 mb-1.5">{hint}</p>}
      <Tag
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className={`${field} ${multiline ? "resize-none" : ""}`}
      />
    </div>
  );
}

export default function AdminCourses() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshCourseText, reloadCourses } = useCourses();
  // Every published course, including ones not downloaded to this device.
  const { courses, remoteIds, reload: reloadAdminList } = useAdminCourses();

  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [category, setCategory] = useState("all");

  const [installed, setInstalled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [overrides, setOverrides] = useState({});
  const [drafts, setDrafts] = useState({});
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchCourseOverrides();
    if (!rows) {
      setInstalled(false);
      setLoading(false);
      return;
    }
    const byId = {};
    for (const r of rows) byId[r.course_id] = r;
    setOverrides(byId);
    setInstalled(true);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = useMemo(() => {
    const counts = new Map();
    for (const c of courses || []) {
      const key = c.category || "Uncategorised";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [
      { id: "all", label: "All", count: (courses || []).length },
      ...[...counts.entries()].sort().map(([id, count]) => ({ id, label: id, count })),
    ];
  }, [courses]);

  const sourceOptions = useMemo(() => {
    const all = courses || [];
    const custom = all.filter((c) => remoteIds.has(c.id)).length;
    return [
      { id: "all", label: "All", count: all.length },
      { id: "builtin", label: "Built-in", count: all.length - custom },
      { id: "custom", label: "Uploaded", count: custom },
    ];
  }, [courses, remoteIds]);

  const filtered = useMemo(() => {
    return (courses || []).filter((c) => {
      if (source === "custom" && !remoteIds.has(c.id)) return false;
      if (source === "builtin" && remoteIds.has(c.id)) return false;
      if (category !== "all" && (c.category || "Uncategorised") !== category) return false;
      // Searching the id and category too: an admin chasing a specific course
      // often has the slug from a URL or an export rather than the exact title.
      return matchesQuery(query, c.title, c.subtitle, c.description, c.id, c.category, c.certificateTitle);
    });
  }, [courses, remoteIds, source, category, query]);

  const draftFor = (course) => {
    if (drafts[course.id]) return drafts[course.id];
    const o = overrides[course.id] || {};
    return {
      title: o.title || "",
      subtitle: o.subtitle || "",
      certificateTitle: o.certificate_title || "",
      certificateText: o.certificate_text || "",
    };
  };

  const setDraft = (courseId, patch) =>
    setDrafts((d) => ({ ...d, [courseId]: { ...draftFor({ id: courseId }), ...d[courseId], ...patch } }));

  const save = async (course) => {
    setBusy(course.id);
    try {
      await saveCourseOverride({ courseId: course.id, ...draftFor(course), userId: user?.id });
      await refreshCourseText?.();
      await load();
      setDrafts((d) => { const n = { ...d }; delete n[course.id]; return n; });
      toast({ title: "Saved", description: "Live everywhere, including certificates." });
    } catch (err) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const revert = async (course) => {
    setBusy(course.id);
    try {
      await clearCourseOverride(course.id);
      await refreshCourseText?.();
      await load();
      setDrafts((d) => { const n = { ...d }; delete n[course.id]; return n; });
      toast({ title: "Reverted to the original text" });
    } catch (err) {
      toast({ title: "Couldn't revert", description: err.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const remove = async (course) => {
    setBusy(course.id);
    try {
      await adminDeleteCourse(course.id);
      await reloadCourses();
      await reloadAdminList();
      await load();
      setConfirmDelete(null);
      toast({ title: "Course deleted", description: `"${course.title}" has been removed.` });
    } catch (err) {
      toast({ title: "Couldn't delete", description: err.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminGate>
      <AdminPage
        title="Courses"
        description="Search the catalog, rename courses, edit certificate wording, and open the content editor."
        icon={Library}
      >
        <div className="rounded-xl border border-tiq-border bg-white p-5">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Search by name, subtitle, description, category or id…"
              autoFocus
            />
            <ResultCount shown={filtered.length} total={(courses || []).length} noun="course" />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <FilterChips options={sourceOptions} value={source} onChange={setSource} label="Source" />
            <FilterChips options={categories} value={category} onChange={setCategory} label="Category" />
          </div>

          {!installed && (
            <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-lg bg-tiq-mintLight border border-tiq-border p-3.5 mb-4">
              <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-tiq-ink mb-1">Renaming isn't installed yet</p>
                <p>
                  Run <code className="font-mono-tiq text-xs">migrations/002_course_overrides.sql</code> in the
                  Supabase SQL editor to rename courses or change certificate wording. Searching and the
                  content editor work without it.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <EmptyState>Loading…</EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              {query || source !== "all" || category !== "all"
                ? "No courses match those filters."
                : "No courses loaded."}
            </EmptyState>
          ) : (
            <ul className="space-y-2">
              {filtered.map((course) => {
                const draft = draftFor(course);
                const edited = !!overrides[course.id];
                const dirty = !!drafts[course.id];
                const open = openId === course.id;
                const working = busy === course.id;
                const isCustom = remoteIds.has(course.id);
                const modules = course.modulesCount;
                const topics = course.topicsCount;
                const questions = course.full
                  ? (course.modules || []).flatMap((m) => m.topics || []).reduce((s, t) => s + (t.quiz || []).length, 0)
                  : null;

                return (
                  <li key={course.id} className="rounded-lg border border-tiq-border">
                    <div className="flex items-center gap-3 p-3.5">
                      <button
                        onClick={() => setOpenId(open ? null : course.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                          {edited && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiq-mint/10 text-tiq-mint">
                              Edited
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            {isCustom ? "Uploaded" : "Built-in"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {course.category || "Uncategorised"} · {modules} modules · {topics} lessons{questions != null ? ` · ${questions} questions` : ""}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono-tiq truncate">{course.id}</p>
                      </button>

                      <Link
                        to={`/admin/course/${course.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white text-xs font-medium shrink-0 hover:bg-tiq-mint/90 transition"
                      >
                        <FileText className="w-3.5 h-3.5" /> Content <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setOpenId(open ? null : course.id)}
                        aria-label={open ? "Collapse" : "Expand"}
                        className="p-1 shrink-0"
                      >
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {open && (
                      <div className="px-3.5 pb-3.5 space-y-3 border-t border-tiq-border pt-3.5">
                        {!installed ? (
                          <p className="text-xs text-slate-500">
                            Renaming needs migration 002. Use <span className="font-medium">Content</span> to edit
                            lessons and questions.
                          </p>
                        ) : (
                          <>
                            <Field
                              label="Course name"
                              hint="Shown in the catalog, sidebar and dashboard."
                              value={draft.title}
                              placeholder={course.title}
                              onChange={(v) => setDraft(course.id, { title: v })}
                            />
                            <Field
                              label="Course subheader"
                              hint="The line under the course name."
                              value={draft.subtitle}
                              placeholder={course.subtitle || course.description || "—"}
                              onChange={(v) => setDraft(course.id, { subtitle: v })}
                            />

                            <div className="pt-2 border-t border-tiq-border">
                              <p className="text-xs font-semibold text-tiq-ink mb-2.5 flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-tiq-gold" />
                                On the certificate
                              </p>
                              <div className="space-y-3">
                                <Field
                                  label="Certificate name"
                                  hint="Leave blank to use the course name above."
                                  value={draft.certificateTitle}
                                  placeholder={course.certificateTitle || course.title}
                                  onChange={(v) => setDraft(course.id, { certificateTitle: v })}
                                />
                                <Field
                                  label="Certificate subtitle"
                                  hint="The description printed under the name."
                                  value={draft.certificateText}
                                  placeholder={course.certificateText || "—"}
                                  onChange={(v) => setDraft(course.id, { certificateText: v })}
                                  multiline
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              <button
                                onClick={() => save(course)}
                                disabled={working || !dirty}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mint text-white font-medium hover:bg-tiq-mint/90 transition text-xs disabled:opacity-50"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {working ? "Saving…" : "Save"}
                              </button>
                              {edited && (
                                <button
                                  onClick={() => revert(course)}
                                  disabled={working}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs disabled:opacity-50"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Revert to original
                                </button>
                              )}
                            </div>
                          </>
                        )}

                        {isCustom && (
                          <div className="pt-3 border-t border-tiq-border">
                            {confirmDelete === course.id ? (
                              <div className="rounded-lg border border-red-300 bg-red-50 p-3">
                                <p className="text-xs text-red-800 flex items-start gap-2 mb-2.5">
                                  <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                                  <span>
                                    Delete <span className="font-semibold">{course.title}</span> for everyone? Learner
                                    progress for this course is not removed, but the course disappears from the catalog.
                                  </span>
                                </p>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => remove(course)}
                                    disabled={working}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition disabled:opacity-50"
                                  >
                                    {working ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    Delete permanently
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 text-xs hover:bg-white transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(course.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete course
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </AdminPage>
    </AdminGate>
  );
}
