import React, { useRef } from "react";
import { HardDrive, Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { notifyDataChanged } from "@/lib/sync";
import { AdminPage } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";
import CurriculumExport from "@/components/admin/CurriculumExport";

const DATA_KEYS = [
  "tradeiq_profile",
  "tradeiq_progress",
  "tradeiq_custom_courses",
  "tradeiq_lesson_notes",
];

export default function AdminData() {
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
      <AdminPage
        title="Data & exports"
        description="Back up this device's progress, and export curriculum for review."
        icon={HardDrive}
      >
        <div className="space-y-6">
          <section className="rounded-xl bg-white border border-tiq-border p-5">
            <h2 className="font-slab text-base text-tiq-ink font-bold mb-1">Your data</h2>
            <p className="text-sm text-slate-500 mb-4">
              Progress and notes live on this device (and sync to your account when signed in).
              Export a backup file as an extra safety net.
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
          </section>

          <CurriculumExport />
        </div>
      </AdminPage>
    </AdminGate>
  );
}
