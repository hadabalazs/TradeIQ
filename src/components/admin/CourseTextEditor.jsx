import React, { useState, useEffect, useCallback } from "react";
import { Type, RotateCcw, Save, AlertCircle, Award, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { useCourses } from "@/lib/CoursesContext";
import { Link } from "react-router-dom";
import {
  fetchCourseOverrides,
  saveCourseOverride,
  clearCourseOverride,
} from "@/lib/courseOverrides";

// Admin editor for the four course display strings.
//
// They are edited separately on purpose. The catalog title and the certificate
// title are different jobs — one is for browsing, the other is a formal
// qualification name — and the same is true of the subtitle versus the blurb
// printed under the name on the certificate. Leaving a field blank falls back to
// the text the course ships with, so you can change one string without pinning
// the other three.
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
        className={`w-full px-3 py-2 text-sm rounded-lg border border-tiq-border bg-white text-tiq-ink placeholder:text-slate-400 focus:outline-none focus:border-tiq-mint ${
          multiline ? "resize-none" : ""
        }`}
      />
    </div>
  );
}

export default function CourseTextEditor() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { courses, refreshCourseText } = useCourses();

  const [installed, setInstalled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [overrides, setOverrides] = useState({});
  const [drafts, setDrafts] = useState({});
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(null);

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

  if (!installed) {
    return (
      <section className="rounded-xl border border-tiq-border bg-white p-5">
        <h2 className="font-slab text-base text-tiq-ink font-bold mb-2 flex items-center gap-2">
          <Type className="w-4 h-4 text-tiq-mint" />
          Course names &amp; certificate text
        </h2>
        <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-lg bg-tiq-mintLight border border-tiq-border p-3.5">
          <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-tiq-ink mb-1">Not installed yet</p>
            <p>
              Run <code className="font-mono-tiq text-xs">migrations/002_course_overrides.sql</code> in the
              Supabase SQL editor. Until then courses render exactly as shipped.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-tiq-border bg-white p-5">
      <h2 className="font-slab text-base text-tiq-ink font-bold mb-1 flex items-center gap-2">
        <Type className="w-4 h-4 text-tiq-mint" />
        Course names &amp; certificate text
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Rename a course or change what its certificate says. Blank fields fall back to the
        original text. Changes apply to every user immediately.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500 py-4 text-center">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {(courses || []).map((course) => {
            const draft = draftFor(course);
            const edited = !!overrides[course.id];
            const dirty = !!drafts[course.id];
            const open = openId === course.id;
            const working = busy === course.id;

            return (
              <li key={course.id} className="rounded-lg border border-tiq-border">
                <button
                  onClick={() => setOpenId(open ? null : course.id)}
                  className="w-full flex items-center gap-3 p-3.5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                    <p className="text-xs text-slate-500 truncate">{course.subtitle || course.description}</p>
                  </div>
                  {edited && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiq-mint/10 text-tiq-mint shrink-0">
                      Edited
                    </span>
                  )}
                  <Link
                    to={`/admin/course/${course.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-medium text-tiq-mint hover:text-tiq-ink transition shrink-0"
                  >
                    Edit content →
                  </Link>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="px-3.5 pb-3.5 space-y-3 border-t border-tiq-border pt-3.5">
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

                    <div className="flex items-center gap-2 pt-1">
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
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
