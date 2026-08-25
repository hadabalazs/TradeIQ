import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, AlertCircle, RefreshCw, Eye, Users, Share2, Monitor } from "lucide-react";
import { AdminPage, EmptyState, FilterChips } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";
import { fetchPageViews, summarise } from "@/lib/analyticsQueries";
import { useCourses } from "@/lib/CoursesContext";

const RANGES = [
  { id: 7, label: "7 days" },
  { id: 30, label: "30 days" },
  { id: 90, label: "90 days" },
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

// A bar chart drawn with divs. A charting library would be ~50KB for one screen
// that four people will ever open.
function Sparkline({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-px h-28" role="img" aria-label="Page views per day">
      {data.map((d) => (
        <div key={d.date} className="flex-1 min-w-0 group relative flex items-end h-full">
          <div
            className="w-full bg-tiq-mint/70 group-hover:bg-tiq-mint rounded-sm transition-all"
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
          />
          <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-tiq-ink text-white text-[10px] whitespace-nowrap z-10">
            {d.date}: {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function Table({ title, rows, total, renderLabel }) {
  if (!rows.length) return null;
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-xl bg-white border border-tiq-border p-5">
      <h2 className="font-slab text-base text-tiq-ink font-bold mb-3">{title}</h2>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="relative">
            <div
              className="absolute inset-y-0 left-0 bg-tiq-mint/10 rounded"
              style={{ width: `${(r.count / max) * 100}%` }}
            />
            <div className="relative flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
              <span className="truncate text-tiq-ink min-w-0">
                {renderLabel ? renderLabel(r.label) : r.label}
              </span>
              <span className="font-mono-tiq text-xs text-slate-500 shrink-0">
                {r.count}
                {total ? <span className="text-slate-400"> · {Math.round((r.count / total) * 100)}%</span> : null}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AdminAnalytics() {
  const { courses } = useCourses();
  const [days, setDays] = useState(30);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [installed, setInstalled] = useState(true);

  const load = async (range) => {
    setLoading(true);
    const data = await fetchPageViews({ days: range });
    setInstalled(data !== null);
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(days); }, [days]);

  const stats = useMemo(() => (rows ? summarise(rows, { days }) : null), [rows, days]);

  const titleFor = (courseId) =>
    (courses || []).find((c) => c.id === courseId)?.title || courseId;

  return (
    <AdminGate>
      <AdminPage
        title="Traffic"
        description="Anonymous page views, recorded in your own database."
        icon={BarChart3}
        actions={
          <button
            onClick={() => load(days)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        }
      >
        {!installed ? (
          <div className="flex items-start gap-2.5 text-sm text-slate-600 rounded-xl bg-white border border-tiq-border p-5">
            <AlertCircle className="w-4 h-4 text-tiq-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-tiq-ink mb-1">Not installed yet</p>
              <p>
                Run <code className="font-mono-tiq text-xs">migrations/006_analytics.sql</code> in the
                Supabase SQL editor. Until then nothing is recorded and nothing is shown — the site
                works exactly as it does now.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <FilterChips
                options={RANGES.map((r) => ({ id: r.id, label: r.label }))}
                value={days}
                onChange={setDays}
                label="Range"
              />
            </div>

            {loading ? (
              <EmptyState>Loading…</EmptyState>
            ) : stats.views === 0 ? (
              <EmptyState>
                No page views recorded in this range yet. Traffic appears here once someone
                opens the site.
              </EmptyState>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Stat icon={Eye} label="Page views" value={stats.views} />
                  <Stat icon={Users} label="Browser sessions" value={stats.sessions} sub="not unique people" />
                  <Stat icon={Share2} label="Direct / no referrer" value={`${stats.directShare}%`} />
                  <Stat icon={Monitor} label="Signed in" value={`${stats.signedInShare}%`} sub="of views" />
                </div>

                <section className="rounded-xl bg-white border border-tiq-border p-5">
                  <h2 className="font-slab text-base text-tiq-ink font-bold mb-3">Views per day</h2>
                  <Sparkline data={stats.perDay} />
                </section>

                <div className="grid lg:grid-cols-2 gap-4">
                  <Table
                    title="Courses viewed"
                    rows={stats.topCourses}
                    total={stats.views}
                    renderLabel={(id) => (
                      <Link to={`/course/${id}`} className="hover:text-tiq-mint transition">
                        {titleFor(id)}
                      </Link>
                    )}
                  />
                  <Table title="Where traffic came from" rows={stats.referrers} total={stats.views} />
                  <Table title="Pages" rows={stats.topPaths} total={stats.views} />
                  <Table title="Devices" rows={stats.devices} total={stats.views} />
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-slate-500 mt-6 leading-relaxed">
          <span className="font-medium text-tiq-ink">What is recorded:</span> the page path, which
          course it belongs to, the referring site's host, a device category from the window width,
          whether the viewer was signed in, and a random id held in the tab that disappears when the
          tab closes. No IP address, no user agent, no user id, no cookies. Do Not Track and Global
          Privacy Control are honoured, and lessons are grouped per course rather than recorded
          individually. "Browser sessions" counts tabs, not people — someone returning tomorrow
          counts again, which is the cost of not tracking anyone between visits.
        </p>
      </AdminPage>
    </AdminGate>
  );
}
