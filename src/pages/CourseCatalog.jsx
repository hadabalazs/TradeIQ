import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Building2, ArrowRight, Sparkles, Award, Flame, BookOpen, GraduationCap, Lightbulb, Briefcase, Shield, Code, FlaskConical, Globe, LineChart, Scale, Banknote, Cpu, Rocket } from "lucide-react";
import { getNextStep } from "@/lib/courses";
import { useCourses } from "@/lib/CoursesContext";
import { useProgress, overallPercent, levelFromXp } from "@/lib/ProgressContext";
import Logo from "@/components/tradeiq/Logo";
import { useAuth } from "@/lib/AuthContext";
import { Cloud, Download, Loader2, WifiOff, Compass } from "lucide-react";
import TodaysDilemma from "@/components/tradeiq/TodaysDilemma";
import { useToast } from "@/components/ui/use-toast";

const ICONS = {
  TrendingUp, Building2, Briefcase, Shield, Code, FlaskConical, Globe,
  LineChart, Scale, Banknote, Cpu, Rocket,
};

export default function CourseCatalog() {
  const { progress } = useProgress();
  const { courses, availableCourses, downloadCourse } = useCourses();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (courseId, title) => {
    setDownloading(courseId);
    try {
      await downloadCourse(courseId);
      toast({ title: "Course downloaded", description: `"${title}" is now available offline.` });
    } catch {
      toast({ variant: "destructive", title: "Download failed", description: "Check your connection and try again." });
    } finally {
      setDownloading(null);
    }
  };
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [sending, setSending] = useState(false);
  const totalXP = progress?.total_xp || 0;
  const { level } = levelFromXp(totalXP);
  const streak = progress?.streak_count || 0;

  const sendSuggestion = () => {
    if (!suggestion.trim()) return;
    setSending(true);
    const subject = encodeURIComponent("TradeIQ Academy — New Course Suggestion");
    const body = encodeURIComponent(`Course suggestion:\n\n${suggestion.trim()}`);
    window.location.href = `mailto:development.hada@gmail.com?subject=${subject}&body=${body}`;
    toast({ title: "Opening your email app...", description: "Send the pre-filled email to submit your suggestion." });
    setSuggestion("");
    setSuggesting(false);
    setSending(false);
  };

  // "Mine" means explicitly enrolled OR already under way — existing learners
  // never clicked an Enroll button, so activity has to count as enrolment or
  // their in-progress courses would sit in the browse list.
  const isMine = (course) => {
    const cp = progress?.courses?.[course.id];
    if (!cp) return false;
    return (
      !!cp.enrolled ||
      (cp.completed_topics || []).length > 0 ||
      Object.keys(cp.quiz_scores || {}).length > 0 ||
      !!cp.certified
    );
  };

  const myCourses = courses.filter(isMine);
  const otherCourses = courses.filter((c) => !isMine(c));

  // One card definition, used by both My Courses and the browse list, so the
  // two sections can never drift apart visually.
  const renderCourseCard = (course) => {
    const Icon = ICONS[course.icon] || BookOpen;
    const courseProg = progress?.courses?.[course.id];
    const completed = courseProg?.completed_topics || [];
    const pct = overallPercent(course, completed);
    const totalTopics = course.modules.reduce((s, m) => s + m.topics.length, 0);
    const certified = courseProg?.certified;
    const nextStep = getNextStep(course, completed, courseProg?.quiz_scores);
    const continueHref = nextStep
      ? nextStep.type === "lesson"
        ? `/course/${course.id}/learn/${nextStep.topic.id}`
        : `/course/${course.id}/quiz/${nextStep.module.id}`
      : `/course/${course.id}`;

    return (
      <Link
        key={course.id}
        to={continueHref}
        className="block rounded-xl bg-white border border-tiq-border hover:border-tiq-mint/40 transition group overflow-hidden"
      >
        <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/80 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-tiq-mint" />
            </div>
            {certified && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">Certified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded uppercase tracking-wider">
              {course.category}
            </span>
            <span className="text-[10px] text-slate-500">· {course.level}</span>
          </div>
          <h3 className="font-slab text-tiq-ink font-bold text-lg leading-tight mb-1">{course.title}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 bg-tiq-mintLight rounded-full overflow-hidden">
              <div className="h-full bg-tiq-mint rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono-tiq text-slate-500">{pct}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {course.modules.length} modules · {totalTopics} topics
            </span>
            <span className="flex items-center gap-1 text-sm text-tiq-mint font-medium group-hover:gap-2 transition-all">
              {pct > 0 ? "Continue" : "Start"} <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Logo size={56} />
        </div>
        <h1 className="font-slab text-3xl sm:text-4xl text-tiq-ink font-bold mb-2">
          TradeIQ Academy
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Master professional skills with expert-led courses. Learn at your own pace,
          track your progress, and earn certificates.
        </p>
      </div>

      {/* Guest sign-up CTA */}
      {!isAuthenticated && (
        <div className="mb-10 max-w-3xl mx-auto rounded-xl bg-gradient-to-r from-tiq-mint/10 to-tiq-gold/5 border border-tiq-mint/30 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-tiq-mint/15 border border-tiq-mint/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-tiq-mint" />
            </div>
            <p className="text-sm text-slate-600 text-left">
              <span className="font-semibold text-tiq-ink">Create a free account</span> to keep your
              progress synced across devices and earn certificates when you complete a course.
            </p>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white text-sm font-semibold hover:bg-tiq-mint/90 transition shrink-0"
          >
            <Cloud className="w-4 h-4" /> Sign Up · Free
          </Link>
          <Link
            to="/login"
            className="text-sm text-tiq-mint font-medium hover:underline shrink-0"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="rounded-xl bg-white border border-tiq-border p-4 text-center">
          <BookOpen className="w-4 h-4 text-tiq-mint mx-auto mb-2" />
          <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">{courses.length}</p>
          <p className="text-xs text-slate-500">Courses</p>
        </div>
        <div className="rounded-xl bg-white border border-tiq-border p-4 text-center">
          <Sparkles className="w-4 h-4 text-tiq-mint mx-auto mb-2" />
          <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">{totalXP}</p>
          <p className="text-xs text-slate-500">Total XP</p>
        </div>
        <div className="rounded-xl bg-white border border-tiq-border p-4 text-center">
          <Award className="w-4 h-4 text-tiq-mint mx-auto mb-2" />
          <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">Lv {level}</p>
          <p className="text-xs text-slate-500">Level</p>
        </div>
        <div className="rounded-xl bg-white border border-tiq-border p-4 text-center">
          <Flame className="w-4 h-4 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-mono-tiq text-tiq-ink font-bold">{streak}</p>
          <p className="text-xs text-slate-500">Day Streak</p>
        </div>
      </div>

      {/* Today's Dilemma */}
      <TodaysDilemma />

      {/* Daily lesson quick action */}
      <Link
        to="/daily"
        className="block mb-8 p-5 rounded-xl bg-gradient-to-r from-orange-500/10 to-tiq-mint/5 border border-orange-500/20 hover:border-orange-500/40 transition group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-slab text-tiq-ink font-bold">Daily Recap</h3>
            <p className="text-sm text-slate-600">Review random questions from everything you've learned and keep your streak going.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition" />
        </div>
      </Link>

      {/* My Courses — enrolled, or already under way. Kept separate so the
          courses you are actually working through are not buried among the ones
          you have never opened. */}
      {myCourses.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-tiq-mint" />
            <h2 className="font-slab text-xl text-tiq-ink font-bold">My Courses</h2>
            <span className="text-xs font-mono-tiq text-slate-500">{myCourses.length}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {myCourses.map((course) => renderCourseCard(course))}
          </div>
        </>
      )}

      {/* Courses */}
      {otherCourses.length > 0 && (
      <div className="mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5 text-tiq-mint" />
        <h2 className="font-slab text-xl text-tiq-ink font-bold">
          {myCourses.length > 0 ? "Browse Other Courses" : "Available Courses"}
        </h2>
      </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {otherCourses.map((course) => renderCourseCard(course))}
      </div>

      {/* More courses — download on demand */}
      {availableCourses.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-5 h-5 text-tiq-mint" />
            <h2 className="font-slab text-xl text-tiq-ink font-bold">More Courses</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Download the courses that interest you — once downloaded, they work fully offline.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {availableCourses.map((c) => {
              const Icon = ICONS[c.icon] || BookOpen;
              const busy = downloading === c.course_id;
              return (
                <div key={c.course_id} className="rounded-xl bg-white border border-tiq-border overflow-hidden">
                  <div className={`bg-gradient-to-br ${c.gradient || "from-blue-500/10 to-indigo-500/5"} p-6`}>
                    <div className="w-12 h-12 rounded-lg bg-white/80 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-tiq-mint" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-500">· {c.level}</span>
                    </div>
                    <h3 className="font-slab text-tiq-ink font-bold text-lg leading-tight mb-1">{c.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {c.modules_count || "?"} modules · {c.topics_count || "?"} topics
                    </span>
                    {navigator.onLine ? (
                      <button
                        onClick={() => handleDownload(c.course_id, c.title)}
                        disabled={busy}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {busy ? "Downloading..." : "Download"}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <WifiOff className="w-4 h-4" /> Connect to download
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggest new courses */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setSuggesting(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight hover:text-tiq-ink transition text-sm font-medium"
        >
          <Lightbulb className="w-4 h-4 text-tiq-gold" />
          Suggest New Courses
        </button>
      </div>

      {/* Suggestion modal */}
      {suggesting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !sending && setSuggesting(false)}>
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-slab text-lg text-tiq-ink font-bold mb-1">Suggest a New Course</h3>
            <p className="text-sm text-slate-500 mb-4">
              Tell us what topic or skill you'd like to learn. We'll send your suggestion to our development team.
            </p>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={5}
              placeholder="e.g. A course on corporate finance, derivatives trading, or sustainability reporting…"
              className="w-full px-3 py-2.5 rounded-lg border border-tiq-border bg-white text-sm text-tiq-ink focus:outline-none focus:ring-2 focus:ring-tiq-mint/30 resize-none"
              disabled={sending}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setSuggesting(false)}
                disabled={sending}
                className="px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={sendSuggestion}
                disabled={sending || !suggestion.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold text-sm hover:bg-tiq-mint/90 transition disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send Suggestion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}