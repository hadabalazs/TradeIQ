import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, HardDrive, Download, Upload, FileText, ArrowRight,
  Maximize2, ShieldCheck, BarChart3,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { notifyDataChanged } from "@/lib/sync";
import AdminGate from "@/components/admin/AdminGate";
import CurriculumExport from "@/components/admin/CurriculumExport";
import AddCourse from "@/components/admin/AddCourse";
import CourseManager from "@/components/admin/CourseManager";
import FlaggedQuestions from "@/components/admin/FlaggedQuestions";
import CourseTextEditor from "@/components/admin/CourseTextEditor";
import CourseContentManager from "@/components/admin/CourseContentManager";

// The admin panel: every tool on one page, as it has always been.
//
// An earlier version replaced this with a hub of links, which made the common
// case slower — most admin jobs are a quick look or a small edit, and those want
// everything to hand rather than a navigation step per task. The dedicated
// full-page views still exist for work that needs room, such as searching a
// large catalog or filtering flags by course, and each section links to its own.
const DATA_KEYS = [
  "tradeiq_profile",
  "tradeiq_progress",
  "tradeiq_custom_courses",
  "tradeiq_lesson_notes",
];

function SectionLink({ to, label = "Open full view" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-mint/40 bg-white text-tiq-mint text-xs font-medium hover:bg-tiq-mintLight transition shrink-0"
    >
      <Maximize2 className="w-3.5 h-3.5" /> {label}
    </Link>
  );
}

// Overlays the section's own card with its full-view link. The sections render
// their own headings, so the link is positioned rather than passed in — that
// keeps each component unchanged and usable on its own page too.
function Section({ to, label, children }) {
  return (
    <div className="relative">
      <div className="absolute right-5 top-5 z-10">
        <SectionLink to={to} label={label} />
      </div>
      {children}
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const fileRef = useRef(null);

  const exportData = () => {
    const data = { schema: 1, exported_at: new Date().toISOString() };
    for (const key of DATA_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) data[key] = JSON.parse(raw);
      } catch { /* skip corrupt keys */ }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradeiq-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup exported", description: "Keep this file safe — it contains all your progress." });
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.schema !== 1) throw new Error("Unknown backup format");
        if (!window.confirm("Importing will overwrite your current progress on this device. Continue?")) return;
        for (const key of DATA_KEYS) {
          if (data[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        }
        notifyDataChanged();
        toast({ title: "Backup imported", description: "Reloading the app..." });
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        toast({ variant: "destructive", title: "Import failed", description: err.message || "Invalid backup file" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

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
            <h1 className="font-slab text-2xl text-tiq-ink font-bold">Admin Panel</h1>
            <p className="text-sm text-slate-500">Manage courses and your local data</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white border border-tiq-border p-5 relative">
          <div className="absolute right-5 top-5">
            <SectionLink to="/admin/data" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-tiq-mint/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-tiq-mint" />
            </div>
            <h2 className="font-slab text-lg text-tiq-ink font-semibold">Your Data</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Your progress and notes live on this device (and sync to your account when signed in). Export a backup file as an extra safety net.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition"
            >
              <Download className="w-4 h-4" /> Export backup
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 text-sm font-medium hover:bg-tiq-mintLight transition"
            >
              <Upload className="w-4 h-4" /> Import backup
            </button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importData} />
          </div>
        </div>

        {/* Course editor — a single obvious button directly under Your Data.
            Earlier entry points were nested inside other admin sections and were
            missed; this one stands alone and depends on nothing. */}
        <Link
          to="/admin/editor"
          className="mb-6 flex items-center gap-4 rounded-xl border border-tiq-mint/40 bg-gradient-to-r from-tiq-mint/10 to-tiq-gold/5 p-5 hover:border-tiq-mint transition group"
        >
          <div className="w-12 h-12 rounded-lg bg-tiq-mint/15 border border-tiq-mint/30 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-tiq-mint" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-slab text-lg text-tiq-ink font-semibold">Course Editor</h2>
            <p className="text-sm text-slate-600">
              Read and edit every lesson, question and answer in any course.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-semibold shrink-0 group-hover:gap-2.5 transition-all">
            Open <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <div className="mt-6 space-y-6">
          <Section to="/admin/editor" label="Search courses">
            <CourseContentManager />
          </Section>

          <Section to="/admin/courses" label="Search & filter">
            <CourseTextEditor />
          </Section>

          <Section to="/admin/flags" label="Search & filter">
            <FlaggedQuestions />
          </Section>

          <Section to="/admin/upload">
            <AddCourse />
          </Section>

          <Section to="/admin/courses">
            <CourseManager />
          </Section>

          <Section to="/admin/data">
            <CurriculumExport />
          </Section>
        </div>

        <Link
          to="/admin/analytics"
          className="mt-6 flex items-center gap-4 rounded-xl border border-tiq-border bg-white p-5 hover:border-tiq-mint/40 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-tiq-mint" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-slab text-base text-tiq-ink font-semibold">Traffic</h2>
            <p className="text-sm text-slate-600">
              Which courses and pages are being opened, and where the traffic came from.
              Anonymous, recorded in your own database — no third-party analytics.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-tiq-mint transition" />
        </Link>

        {/* A health check rather than a daily tool, so it sits at the bottom as a
            link rather than an inline section. */}
        <Link
          to="/admin/audit"
          className="mt-6 flex items-center gap-4 rounded-xl border border-tiq-border bg-white p-5 hover:border-tiq-mint/40 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-tiq-mint" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-slab text-base text-tiq-ink font-semibold">Catalog audit</h2>
            <p className="text-sm text-slate-600">
              Three checks that keep the catalog safe to grow: module or topic ids used by
              more than one course, courses still using unprefixed ids like "m1t1", and
              whether two different questions have landed on the same review card.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-tiq-mint transition" />
        </Link>
      </div>
    </AdminGate>
  );
}
