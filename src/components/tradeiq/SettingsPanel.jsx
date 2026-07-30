import React, { useState } from "react";
import { Settings, ChevronDown, Moon, Sun, LockOpen, RotateCcw } from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";
import { useTheme } from "@/lib/ThemeContext";

export default function SettingsPanel({ course }) {
  const { progress, save, resetProgress, resetCourseProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(progress?.user_name || "");
  const [confirmReset, setConfirmReset] = useState(false);

  const updateName = () => {
    if (name.trim() && name.trim() !== progress?.user_name) {
      save({ user_name: name.trim() });
    }
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
    setName("");
    setOpen(false);
  };

  const handleResetCourse = () => {
    if (course) {
      resetCourseProgress(course.id);
    }
  };

  return (
    <div className="pt-3 mt-3 border-t border-tiq-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-2 w-full rounded-md text-sm text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink transition"
      >
        <Settings className="w-4 h-4" /> Settings
        <ChevronDown className={`w-4 h-4 ml-auto transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 px-1 space-y-3">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 px-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={updateName}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              className="w-full px-2.5 py-1.5 text-sm rounded-md bg-tiq-mintLight border border-tiq-border text-tiq-ink focus:outline-none focus:border-tiq-mint/50"
            />
          </div>
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Dark mode
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-9 h-5 rounded-full transition ${
                theme === "dark" ? "bg-tiq-mint" : "bg-tiq-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>
          {/* Unlock all sections (course-specific) */}
          {course && (
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <LockOpen className="w-4 h-4" />
                Unlock all modules
              </div>
              <button
                onClick={() => save({
                  courses: {
                    ...(progress?.courses || {}),
                    [course.id]: {
                      ...(progress?.courses?.[course.id] || {}),
                      unlock_all: !(progress?.courses?.[course.id]?.unlock_all),
                    },
                  },
                })}
                className={`relative w-9 h-5 rounded-full transition ${
                  progress?.courses?.[course.id]?.unlock_all ? "bg-tiq-mint" : "bg-tiq-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    progress?.courses?.[course.id]?.unlock_all ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>
          )}
          {/* Reset course progress */}
          {course && (
            <div className="pt-2 border-t border-tiq-border">
              <button
                onClick={handleResetCourse}
                className="flex items-center gap-2 px-2.5 py-1.5 w-full rounded-md text-xs text-amber-600 hover:bg-amber-500/10 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset course progress
              </button>
            </div>
          )}
          {/* Reset all data */}
          <div className={course ? "" : "pt-2 border-t border-tiq-border"}>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 w-full rounded-md text-xs text-red-500 hover:bg-red-500/10 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all data
              </button>
            ) : (
              <div className="px-2 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-600 mb-2">This will erase ALL progress across all courses. Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-2.5 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 px-2.5 py-1.5 rounded-md border border-tiq-border text-slate-600 text-xs hover:bg-tiq-mintLight transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}