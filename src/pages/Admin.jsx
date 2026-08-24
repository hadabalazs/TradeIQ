import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, ArrowRight, Library, FileText, Flag, Plus, HardDrive, ShieldCheck,
} from "lucide-react";
import { useCourses } from "@/lib/CoursesContext";
import { findIdCollisions } from "@/lib/courses";
import AdminGate from "@/components/admin/AdminGate";
import { SearchBox, ResultCount, EmptyState, matchesQuery } from "@/components/admin/AdminUI";

// The admin hub.
//
// This page used to stack every admin tool on top of each other. That is fine
// with two courses and stops being fine well before twenty: no way to find one
// course, no room for per-section filters, and a page that grows without limit.
// Each tool now owns a route, and this page routes to them — plus a search that
// jumps straight to a course, which is the thing an admin does most often.

const SECTIONS = [
  {
    to: "/admin/courses",
    icon: Library,
    title: "Courses",
    blurb: "Search the catalog, rename courses, edit certificate wording, delete uploads.",
  },
  {
    to: "/admin/editor",
    icon: FileText,
    title: "Course content",
    blurb: "Edit every module overview, lesson and question, with search inside a course.",
  },
  {
    to: "/admin/flags",
    icon: Flag,
    title: "Flagged questions",
    blurb: "Reports from learners. Filter by course, then suppress or replace.",
  },
  {
    to: "/admin/upload",
    icon: Plus,
    title: "Add a course",
    blurb: "Publish a structured course JSON to the catalog.",
  },
  {
    to: "/admin/data",
    icon: HardDrive,
    title: "Data & exports",
    blurb: "Back up this device's progress, and export curriculum for review.",
  },
  {
    to: "/admin/audit",
    icon: ShieldCheck,
    title: "Catalog audit",
    blurb: "Id collisions and other checks that keep the catalog safe to grow.",
  },
];

export default function Admin() {
  const { courses } = useCourses();
  const [query, setQuery] = useState("");

  const collisionCount = useMemo(() => findIdCollisions(courses || []).length, [courses]);

  const hits = useMemo(() => {
    if (!query.trim()) return [];
    return (courses || [])
      .filter((c) => matchesQuery(query, c.title, c.subtitle, c.description, c.id, c.category))
      .slice(0, 8);
  }, [courses, query]);

  return (
    <AdminGate>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-tiq-mint" />
          </div>
          <div>
            <h1 className="font-slab text-2xl text-tiq-ink font-bold">Admin</h1>
            <p className="text-sm text-slate-500">
              {(courses || []).length} course{(courses || []).length === 1 ? "" : "s"} in the catalog
            </p>
          </div>
        </div>

        {/* Jump straight to a course — the most common reason to open admin. */}
        <div className="rounded-xl bg-white border border-tiq-border p-5 mb-6">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Find a course by name, category or id…"
            />
            {query.trim() && <ResultCount shown={hits.length} total={(courses || []).length} noun="course" />}
          </div>

          {query.trim() && (
            hits.length === 0 ? (
              <EmptyState>No courses match that search.</EmptyState>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {hits.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/admin/course/${c.id}`}
                      className="flex items-center gap-3 rounded-lg border border-tiq-border p-3 hover:border-tiq-mint/40 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-tiq-ink truncate">{c.title}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {c.category || "Uncategorised"} · {(c.modules || []).length} modules ·{" "}
                          <span className="font-mono-tiq">{c.id}</span>
                        </p>
                      </div>
                      <span className="text-xs font-medium text-tiq-mint shrink-0">Edit content →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const badge = s.to === "/admin/audit" && collisionCount > 0 ? collisionCount : null;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-start gap-3 rounded-xl border border-tiq-border bg-white p-5 hover:border-tiq-mint/40 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-tiq-mint" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-slab text-base text-tiq-ink font-semibold">{s.title}</h2>
                    {badge && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiq-gold/15 text-tiq-gold">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.blurb}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-1 group-hover:text-tiq-mint transition" />
              </Link>
            );
          })}
        </div>
      </div>
    </AdminGate>
  );
}
