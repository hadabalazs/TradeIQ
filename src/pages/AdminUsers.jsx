import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, AlertCircle, RefreshCw, ChevronDown, Award, Loader2, Activity, GraduationCap,
} from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import {
  AdminPage, SearchBox, FilterChips, ResultCount, EmptyState, matchesQuery,
} from "@/components/admin/AdminUI";
import { useAdminCourses } from "@/lib/useAdminCourses";
import { completedInCourse, isEnrolledIn } from "@/lib/ProgressContext";
import { listUsers, getUser } from "@/lib/adminUsers";

const DAY = 86_400_000;

function relative(iso) {
  if (!iso) return "never";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  const diff = Date.now() - t;
  if (diff < 60_000) return "just now";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function shortDate(iso) {
  if (!iso) return "—";
  const t = Date.parse(iso);
  return Number.isNaN(t)
    ? "—"
    : new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// last_active_date is a calendar date ("2026-09-12") in the learner's own time
// zone, not a timestamp, so it is shown as a day rather than "3h ago".
function studiedLabel(dateStr) {
  if (!dateStr) return "never";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - d) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Active means either signed in or studied within the window. Sign-in alone
// undercounts badly: sessions persist, so a learner who studies every day can
// go months without a fresh sign-in.
function isActive(u, days) {
  const cutoff = Date.now() - days * DAY;
  const signIn = u.last_sign_in_at ? Date.parse(u.last_sign_in_at) : 0;
  const studied = u.last_active_date ? Date.parse(`${u.last_active_date}T00:00:00`) : 0;
  return Math.max(signIn || 0, studied || 0) >= cutoff;
}

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "active", label: "Active 7 days", test: (u) => isActive(u, 7) },
  { id: "started", label: "Started a course", test: (u) => u.courses_started > 0 },
  { id: "idle", label: "Never started", test: (u) => u.courses_started === 0 },
  { id: "certified", label: "Certified", test: (u) => u.certificates > 0 || u.certified_courses > 0 },
  { id: "admins", label: "Admins", test: (u) => u.is_admin },
  { id: "unconfirmed", label: "Unconfirmed email", test: (u) => !u.email_confirmed },
];

const time = (iso) => (iso ? Date.parse(iso) || 0 : 0);

const SORTS = [
  { id: "newest", label: "Newest", cmp: (a, b) => time(b.created_at) - time(a.created_at) },
  { id: "studied", label: "Last studied", cmp: (a, b) => (b.last_active_date || "").localeCompare(a.last_active_date || "") },
  { id: "signin", label: "Last sign-in", cmp: (a, b) => time(b.last_sign_in_at) - time(a.last_sign_in_at) },
  { id: "lessons", label: "Most lessons", cmp: (a, b) => b.lessons_completed - a.lessons_completed },
  { id: "xp", label: "Most XP", cmp: (a, b) => b.total_xp - a.total_xp },
];

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl bg-white border border-tiq-border p-4">
      <Icon className="w-4 h-4 text-tiq-mint mb-2" />
      <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Badge({ tone = "slate", children }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    mint: "bg-tiq-mint/10 text-tiq-mint",
    gold: "bg-tiq-gold/15 text-tiq-gold",
    red: "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tones[tone]}`}>{children}</span>
  );
}

function Notice({ title, children }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-xl bg-white border border-tiq-border p-5">
      <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-tiq-ink mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

function UserDetail({ userId, courses }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let alive = true;
    getUser(userId).then((res) => { if (alive) setState(res); });
    return () => { alive = false; };
  }, [userId]);

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 px-4 pb-4">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (state.status !== "ok") {
    return (
      <p className="text-sm text-slate-500 px-4 pb-4">
        {state.status === "missing" ? "This account no longer exists." : "Couldn't load this account."}
      </p>
    );
  }

  const u = state.user;
  const progress = u.progress || {};
  const byId = new Map((courses || []).map((c) => [c.id, c]));

  // Only courses the learner actually started, by the same rule the app uses —
  // every course has an empty entry by default.
  const started = Object.entries(progress.courses || {})
    .filter(([cid]) => isEnrolledIn(progress, cid))
    .map(([cid, cp]) => {
      const course = byId.get(cid);
      const total = course ? course.topicsCount : null;
      // Counted against the course when its body is loaded, so stale topic ids
      // do not overstate progress; otherwise capped at the lesson count.
      const raw = (cp.completed_topics || []).length;
      const done = course?.full
        ? completedInCourse(course, cp.completed_topics).length
        : total != null ? Math.min(raw, total) : raw;
      return {
        cid,
        title: course?.title || cid,
        removed: !course,
        done,
        total,
        certified: !!cp.certified,
        score: cp.final_assessment_score || 0,
        enrolledAt: cp.enrolled_at,
      };
    })
    .sort((a, b) => b.done - a.done);

  return (
    <div className="border-t border-tiq-border px-4 py-4 space-y-4">
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div><dt className="text-slate-500">Joined</dt><dd className="text-tiq-ink">{shortDate(u.created_at)}</dd></div>
        <div><dt className="text-slate-500">Last sign-in</dt><dd className="text-tiq-ink">{relative(u.last_sign_in_at)}</dd></div>
        <div><dt className="text-slate-500">Streak</dt><dd className="text-tiq-ink">{progress.streak_count || 0} days · best {progress.best_streak || 0}</dd></div>
        <div><dt className="text-slate-500">Progress synced</dt><dd className="text-tiq-ink">{relative(u.progress_synced_at)}</dd></div>
      </dl>

      <div>
        <h3 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-2">Courses</h3>
        {started.length === 0 ? (
          <p className="text-sm text-slate-500">Hasn't started a course.</p>
        ) : (
          <ul className="space-y-1.5">
            {started.map((c) => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <li key={c.cid} className="rounded-lg border border-tiq-border p-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="text-sm text-tiq-ink truncate">{c.title}</span>
                      {c.removed && <Badge>course removed</Badge>}
                      {c.certified && <Badge tone="gold">Certified · {c.score}%</Badge>}
                    </div>
                    <span className="text-xs font-mono-tiq text-slate-500 shrink-0">
                      {c.done}{c.total != null ? `/${c.total}` : ""} lessons
                    </span>
                  </div>
                  {c.total != null && (
                    <div className="h-1.5 bg-tiq-mintLight rounded-full overflow-hidden">
                      <div className="h-full bg-tiq-mint rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {(u.certificates || []).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-tiq-ink uppercase tracking-wider mb-2">Certificates</h3>
          <ul className="space-y-1">
            {u.certificates.map((ct) => (
              <li key={ct.cert_id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <Award className="w-3.5 h-3.5 text-tiq-gold shrink-0" />
                  <span className="truncate text-tiq-ink">{ct.course_title}</span>
                  <span className="text-xs text-slate-500 shrink-0">{ct.score}% · {shortDate(ct.issued_at)}</span>
                </span>
                <Link to={`/verify/${ct.cert_id}`} className="text-xs font-mono-tiq text-tiq-mint hover:underline shrink-0">
                  {ct.cert_id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-slate-400 font-mono-tiq break-all">id {u.user_id}</p>
    </div>
  );
}

function UserRow({ user, open, onToggle, courses }) {
  const name = user.display_name || user.email || "Unnamed";
  const initial = (name.trim()[0] || "?").toUpperCase();
  const certified = user.certificates > 0 || user.certified_courses > 0;

  return (
    <li className="rounded-lg border border-tiq-border bg-white">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5 text-left" aria-expanded={open}>
        <span className="w-9 h-9 rounded-full bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center text-sm font-semibold text-tiq-mint shrink-0">
          {initial}
        </span>

        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-medium text-tiq-ink truncate">{name}</span>
            {user.is_admin && <Badge tone="mint">Admin</Badge>}
            {certified && <Badge tone="gold">Certified</Badge>}
            {!user.email_confirmed && <Badge tone="red">Unconfirmed</Badge>}
          </span>
          <span className="block text-xs text-slate-500 truncate">
            {user.display_name ? `${user.email} · ` : ""}joined {shortDate(user.created_at)}
          </span>
        </span>

        <span className="hidden md:grid grid-cols-4 gap-5 text-right shrink-0">
          <span><span className="block text-sm font-mono-tiq text-tiq-ink">{user.courses_started}</span><span className="block text-[10px] text-slate-500">courses</span></span>
          <span><span className="block text-sm font-mono-tiq text-tiq-ink">{user.lessons_completed}</span><span className="block text-[10px] text-slate-500">lessons</span></span>
          <span><span className="block text-sm font-mono-tiq text-tiq-ink">{user.total_xp}</span><span className="block text-[10px] text-slate-500">XP</span></span>
          <span><span className="block text-sm text-tiq-ink whitespace-nowrap">{studiedLabel(user.last_active_date)}</span><span className="block text-[10px] text-slate-500">last studied</span></span>
        </span>

        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <UserDetail userId={user.user_id} courses={courses} />}
    </li>
  );
}

export default function AdminUsers() {
  const { courses } = useAdminCourses();
  const [state, setState] = useState({ status: "loading", users: [] });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    setState(await listUsers());
  }, []);

  useEffect(() => { load(); }, [load]);

  const users = state.users || [];

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => isActive(u, 7)).length,
    started: users.filter((u) => u.courses_started > 0).length,
    certified: users.filter((u) => u.certificates > 0 || u.certified_courses > 0).length,
  }), [users]);

  const filterOptions = useMemo(
    () => FILTERS.map((f) => ({ id: f.id, label: f.label, count: users.filter(f.test).length })),
    [users],
  );

  const visible = useMemo(() => {
    const test = (FILTERS.find((f) => f.id === filter) || FILTERS[0]).test;
    const cmp = (SORTS.find((s) => s.id === sort) || SORTS[0]).cmp;
    return users
      .filter(test)
      .filter((u) => matchesQuery(query, u.email, u.display_name, u.user_id))
      .sort(cmp);
  }, [users, filter, sort, query]);

  return (
    <AdminGate>
      <AdminPage
        title="Users"
        description="Every account, what they're studying, and when they were last active."
        icon={Users}
        actions={
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        }
      >
        {state.status === "not_installed" ? (
          <Notice title="Not installed yet">
            <p>
              Run <code className="font-mono-tiq text-xs">migrations/008_admin_users.sql</code> in the
              Supabase SQL editor. Accounts can only be listed through the admin-only functions it
              creates.
            </p>
          </Notice>
        ) : state.status === "forbidden" ? (
          <Notice title="The database doesn't recognise this account as an admin">
            <p>
              The admin panel let you in, but the server-side check refused the request. Your user needs{" "}
              <code className="font-mono-tiq text-xs">app_metadata.role = &quot;admin&quot;</code> in Supabase.
              If you just changed it, sign out and back in so your session picks up the new role.
            </p>
          </Notice>
        ) : state.status === "error" ? (
          <Notice title="Couldn't load users">
            <p>{state.error?.message || "Check your connection and try again."}</p>
          </Notice>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <Stat icon={Users} label="Accounts" value={state.status === "loading" ? "…" : stats.total} />
              <Stat icon={Activity} label="Active in 7 days" value={state.status === "loading" ? "…" : stats.active} sub="signed in or studied" />
              <Stat icon={GraduationCap} label="Started a course" value={state.status === "loading" ? "…" : stats.started} />
              <Stat icon={Award} label="Certified" value={state.status === "loading" ? "…" : stats.certified} />
            </div>

            <div className="rounded-xl border border-tiq-border bg-white p-5">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <SearchBox value={query} onChange={setQuery} placeholder="Search by email, name or id…" autoFocus />
                <ResultCount shown={visible.length} total={users.length} noun="user" />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <FilterChips options={filterOptions} value={filter} onChange={setFilter} label="Show" />
                <FilterChips options={SORTS.map(({ id, label }) => ({ id, label }))} value={sort} onChange={setSort} label="Sort" />
              </div>

              {state.status === "loading" ? (
                <EmptyState>Loading…</EmptyState>
              ) : visible.length === 0 ? (
                <EmptyState>{users.length ? "No users match those filters." : "No accounts yet."}</EmptyState>
              ) : (
                <ul className="space-y-2">
                  {visible.map((u) => (
                    <UserRow
                      key={u.user_id}
                      user={u}
                      courses={courses}
                      open={openId === u.user_id}
                      onToggle={() => setOpenId(openId === u.user_id ? null : u.user_id)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <p className="text-xs text-slate-500 mt-6 leading-relaxed">
          <span className="font-medium text-tiq-ink">Visible to admins only.</span> Accounts are read
          through server-side functions that refuse anyone without the admin role, so this data never
          reaches a learner's browser. Private lesson notes and spaced-repetition cards are not shown
          here. &quot;Last studied&quot; comes from the learner&apos;s own progress and is a better activity
          signal than last sign-in, because sessions stay signed in for weeks.
        </p>
      </AdminPage>
    </AdminGate>
  );
}
