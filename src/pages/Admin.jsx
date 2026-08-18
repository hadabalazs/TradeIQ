import { Link } from "react-router-dom";
import { ArrowLeft, Shield, HardDrive, Download, Upload } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { isAdminUser } from "@/lib/adminRole";
import { notifyDataChanged } from "@/lib/sync";
import CurriculumExport from "@/components/admin/CurriculumExport";
import AddCourse from "@/components/admin/AddCourse";
import CourseManager from "@/components/admin/CourseManager";
import FlaggedQuestions from "@/components/admin/FlaggedQuestions";
import CourseTextEditor from "@/components/admin/CourseTextEditor";
import CourseContentManager from "@/components/admin/CourseContentManager";

const DATA_KEYS = [
  "tradeiq_profile",
  "tradeiq_progress",
  "tradeiq_custom_courses",
  "tradeiq_lesson_notes",
];

export default function Admin() {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  if (!isAdminUser(user)) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-full bg-tiq-mintLight border border-tiq-border flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-slate-400" />
        </div>
        <h1 className="font-slab text-xl text-tiq-ink font-bold mb-2">Admins only</h1>
        <p className="text-sm text-slate-500 mb-6">
          {isAuthenticated
            ? "Your account doesn't have admin access. Course management and data tools are restricted to administrators."
            : "Sign in with an admin account to manage courses and data."}
        </p>
        <Link to={isAuthenticated ? "/" : "/login"} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition">
          {isAuthenticated ? "Back to courses" : "Sign in"}
        </Link>
      </div>
    );
  }

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

      <div className="mb-6 rounded-xl bg-white border border-tiq-border p-5">
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

      <div className="mt-6 space-y-6">
        <CourseContentManager />
        <CourseTextEditor />
        <FlaggedQuestions />
        <AddCourse />
        <CourseManager />
        <CurriculumExport />
      </div>
    </div>
  );
}
