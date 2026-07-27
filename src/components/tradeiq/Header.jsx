import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, PanelRightOpen, Sparkles, Menu, Shield, Cloud, CloudOff, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { isAdminUser } from "@/lib/adminRole";
import { useProgress, overallPercent, levelFromXp } from "@/lib/ProgressContext";
import Logo from "@/components/tradeiq/Logo";

export default function Header({ course, onOpenGlossary, glossaryOpen, onToggleSidebar }) {
  const { progress } = useProgress();
  const { user, isAuthenticated, logout } = useAuth();
  const pct = course ? overallPercent(course, progress?.courses?.[course.id]?.completed_topics || []) : 0;
  const { level } = levelFromXp(progress?.total_xp || 0);
  const isAdmin = isAdminUser(user);

  return (
    <header className="h-16 bg-white border-b border-tiq-border flex items-center px-4 gap-4 shrink-0 z-30">
      <button onClick={onToggleSidebar} className="lg:hidden text-slate-500 hover:text-tiq-ink">
        <Menu className="w-5 h-5" />
      </button>
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <Logo size={36} />
        <div className="hidden sm:block">
          <span className="font-slab text-tiq-ink font-bold text-lg leading-none block">TradeIQ</span>
          <span className="text-[10px] text-slate-500 tracking-widest uppercase">
            {course ? course.subtitle : "Academy"}
          </span>
        </div>
      </Link>

      {/* Progress bar — only show when inside a course */}
      {course && (
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-tiq-mintLight rounded-full overflow-hidden">
              <div className="h-full bg-tiq-mint rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-slate-600 font-mono-tiq w-9 text-right">{pct}%</span>
          </div>
        </div>
      )}

      {!course && <div className="flex-1" />}

      <div className="flex items-center gap-3 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
          <Sparkles className="w-4 h-4 text-tiq-mint" />
          <span className="text-sm text-tiq-ink font-mono-tiq">{progress?.total_xp || 0} XP</span>
          <span className="text-xs text-slate-500">· Lv {level}</span>
        </div>
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500/20 transition text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
        {isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            <span
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 text-xs text-tiq-mint"
              title={`Synced as ${user?.email}`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="max-w-[140px] truncate">{user?.email}</span>
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-lg border border-tiq-border text-slate-500 hover:text-red-500 hover:border-red-500/30 transition"
              title="Sign out (progress stays on this device)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-tiq-border text-slate-500 hover:text-tiq-mint hover:border-tiq-mint/40 transition text-sm"
            title="Sign in to sync your progress across devices"
          >
            <CloudOff className="w-4 h-4" />
            <span className="hidden sm:inline">Sync</span>
          </Link>
        )}
        {course && (
          <button
            onClick={onOpenGlossary}
            className={`p-2 rounded-lg border transition ${glossaryOpen ? "bg-tiq-mint/10 border-tiq-mint/30 text-tiq-mint" : "border-tiq-border text-slate-500 hover:text-tiq-ink"}`}
          >
            {glossaryOpen ? <PanelRightOpen className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}