import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { useCourses } from "@/lib/CoursesContext";
import { findIdCollisions } from "@/lib/courses";
import { questionId } from "@/lib/questionId";
import { AdminPage, SearchBox, ResultCount, EmptyState, matchesQuery } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";

// Catalog health, so growth stays safe.
//
// Nothing here is broken today — every store that holds learner state keys by
// course id as well as topic id. These are the things that WOULD become bugs as
// the catalog grows, surfaced while they are still cheap to fix.

function Row({ ok, title, detail, children }) {
  return (
    <section className="rounded-xl border border-tiq-border bg-white p-5">
      <div className="flex items-start gap-3 mb-3">
        {ok ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-tiq-gold shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-slab text-base text-tiq-ink font-bold">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AdminAudit() {
  const { courses } = useCourses();
  const [query, setQuery] = useState("");

  const collisions = useMemo(() => findIdCollisions(courses || []), [courses]);
  const titleById = useMemo(() => {
    const m = new Map();
    for (const c of courses || []) m.set(c.id, c.title);
    return m;
  }, [courses]);

  const visibleCollisions = useMemo(
    () => collisions.filter((c) => matchesQuery(query, c.id, c.kind, ...c.courses.map((id) => titleById.get(id) || id))),
    [collisions, query, titleById],
  );

  // Unprefixed ids are the root cause of collisions: a course using "m1t1"
  // collides with every other course that does the same.
  const unprefixed = useMemo(() => {
    const out = [];
    for (const c of courses || []) {
      const bare = [];
      for (const m of c.modules || []) {
        if (/^m\d+$/i.test(m.id || "")) bare.push(m.id);
        for (const t of m.topics || []) if (/^m\d+t\d+$/i.test(t.id || "")) bare.push(t.id);
      }
      if (bare.length) out.push({ courseId: c.id, title: c.title, count: bare.length, sample: bare.slice(0, 4) });
    }
    return out;
  }, [courses]);

  // Question ids are a 32-bit content hash. Two different questions landing on
  // the same hash would share one spaced-repetition card, so it is worth knowing
  // whether that has actually happened rather than assuming it hasn't.
  const questionStats = useMemo(() => {
    const byId = new Map();
    let total = 0;
    for (const c of courses || []) {
      for (const m of c.modules || []) {
        for (const t of m.topics || []) {
          for (const q of t.quiz || []) {
            total++;
            const id = questionId(q);
            const basis = `${q.q || ""}|${q.answerText || (q.options ? q.options[q.answer] : "") || ""}`;
            if (!byId.has(id)) byId.set(id, new Set());
            byId.get(id).add(basis);
          }
        }
      }
    }
    const clashes = [...byId.entries()].filter(([, basates]) => basates.size > 1);
    return { total, unique: byId.size, clashes: clashes.length };
  }, [courses]);

  return (
    <AdminGate>
      <AdminPage
        title="Catalog audit"
        description="Checks that keep the catalog safe to keep growing."
        icon={ShieldCheck}
      >
        <div className="space-y-4">
          <Row
            ok={collisions.length === 0}
            title={collisions.length === 0 ? "No id collisions" : `${collisions.length} id${collisions.length === 1 ? "" : "s"} used by more than one course`}
            detail="Module and topic ids only have to be unique within a course. Collisions are not corrupting today, but every one is a latent bug for anything that later keys by bare topic id. New uploads are namespaced automatically."
          >
            {collisions.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <SearchBox value={query} onChange={setQuery} placeholder="Search id or course…" />
                  <ResultCount shown={visibleCollisions.length} total={collisions.length} noun="collision" />
                </div>
                {visibleCollisions.length === 0 ? (
                  <EmptyState>No collisions match that search.</EmptyState>
                ) : (
                  <ul className="space-y-1.5">
                    {visibleCollisions.map((c) => (
                      <li key={`${c.kind}:${c.id}`} className="rounded-lg border border-tiq-border p-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono-tiq text-xs text-tiq-ink bg-slate-100 px-1.5 py-0.5 rounded">{c.id}</code>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">{c.kind}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Used by {c.courses.map((id, i) => (
                            <React.Fragment key={id}>
                              {i > 0 && ", "}
                              <Link to={`/admin/course/${id}`} className="text-tiq-mint hover:underline">
                                {titleById.get(id) || id}
                              </Link>
                            </React.Fragment>
                          ))}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Row>

          <Row
            ok={unprefixed.length === 0}
            title={unprefixed.length === 0 ? "All courses use namespaced ids" : `${unprefixed.length} course${unprefixed.length === 1 ? "" : "s"} using unprefixed ids`}
            detail={'A course whose ids look like "m1" / "m1t1" will collide with any other course that does the same. Prefixing them per course (e.g. "uaeb_m1t1") removes the risk permanently.'}
          >
            {unprefixed.length > 0 && (
              <ul className="space-y-1.5">
                {unprefixed.map((u) => (
                  <li key={u.courseId} className="rounded-lg border border-tiq-border p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-tiq-ink truncate">{u.title}</p>
                      <p className="text-xs text-slate-500">
                        {u.count} unprefixed id{u.count === 1 ? "" : "s"} — {u.sample.join(", ")}
                        {u.count > u.sample.length ? "…" : ""}
                      </p>
                    </div>
                    <Link
                      to={`/admin/course/${u.courseId}`}
                      className="text-xs font-medium text-tiq-mint hover:text-tiq-ink shrink-0"
                    >
                      Open →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Row>

          <Row
            ok={questionStats.clashes === 0}
            title={
              questionStats.clashes === 0
                ? "No question id clashes"
                : `${questionStats.clashes} question id${questionStats.clashes === 1 ? "" : "s"} shared by different questions`
            }
            detail={`Question ids are a content hash, so identical questions in different courses intentionally share one review card. ${questionStats.unique} distinct ids across ${questionStats.total} questions. A clash between genuinely different questions would make them share a spaced-repetition card.`}
          />
        </div>
      </AdminPage>
    </AdminGate>
  );
}
