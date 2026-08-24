import React from "react";
import { Link } from "react-router-dom";
import { Brain, RefreshCw, Shuffle, LineChart, ArrowRight, Cloud, Award } from "lucide-react";
import Logo from "@/components/tradeiq/Logo";

// What a first-time visitor sees. Signed-in learners get their own stats
// instead — showing a guest "0 XP · Level 1 · 0 day streak" is noise that
// explains nothing about what the platform is.
//
// Every claim below maps to something the app actually does, so the pitch stays
// honest as the product changes:
//   Recall    — every topic, module and review session is answered, not re-read
//   Spacing   — ts-fsrs schedules each question individually (src/lib/srs.js)
//   Mixing    — interleaveByTopic + diversifyQuizArray vary topic and format
//   Measuring — retentionScore() and the Knowledge Check score real recall
const METHOD = [
  {
    icon: Brain,
    title: "Answering beats re-reading",
    body:
      "Re-reading feels productive and fades fast. Every topic here ends in questions, because pulling an answer out of your head does far more for recall than reading the same page twice. Researchers call it the testing effect.",
  },
  {
    icon: RefreshCw,
    title: "Timed against forgetting",
    body:
      "Every question gets its own schedule and comes back just before you would lose it. Answer confidently and the gap widens. Hesitate and it returns sooner.",
  },
  {
    icon: Shuffle,
    title: "Shuffled, not grouped",
    body:
      "Topics and question formats are mixed together instead of coming in blocks. Sessions feel harder that way, and harder practice produces memory that lasts.",
  },
  {
    icon: LineChart,
    title: "Know where you stand",
    body:
      "Each module carries a predicted recall score. You can see which parts have held and which are fading, then drill just those instead of going back over everything.",
  },
];

export default function GuestIntro() {
  return (
    <div className="mb-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size={56} />
        </div>
        <h1 className="font-slab text-3xl sm:text-4xl text-tiq-ink font-bold mb-3">
          Study it once. Still know it next year.
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-2">
          TradeIQ Academy teaches professional subjects using methods drawn from
          research on how memory forms.
        </p>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Most courses get watched once and fade within weeks. This one keeps bringing the
          material back until it sticks.
        </p>
      </div>

      {/* CTA — honest about what an account is for. The app is fully usable
          without one, so gating the pitch behind a signup would be a lie the
          first click would expose. */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
        >
          <Cloud className="w-4 h-4" /> Create a free account
        </Link>
        <a
          href="#courses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-tiq-border text-slate-700 font-medium hover:bg-tiq-mintLight transition"
        >
          Browse courses
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Method */}
      <div className="rounded-2xl border border-tiq-border bg-white p-6 sm:p-8 mb-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-tiq-mint bg-tiq-mint/10 px-3 py-1 rounded-full mb-3">
            <Brain className="w-3.5 h-3.5" />
            The method
          </span>
          <h2 className="font-slab text-xl sm:text-2xl text-tiq-ink font-bold mb-2">
            Where the method comes from
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Four findings from memory research, and how each one shapes the way lessons and
            reviews work here.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {METHOD.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-tiq-mint/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-tiq-mint" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-tiq-ink mb-1">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What an account adds */}
      <div className="rounded-xl bg-gradient-to-r from-tiq-mint/10 to-tiq-gold/5 border border-tiq-mint/30 p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-tiq-mint/15 border border-tiq-mint/30 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-tiq-mint" />
          </div>
          <p className="text-sm text-slate-600 text-left">
            <span className="font-semibold text-tiq-ink">You can start right now</span> without
            an account. Create one free to sync progress across your devices and earn a
            verifiable certificate when you finish a course.
          </p>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white text-sm font-semibold hover:bg-tiq-mint/90 transition shrink-0"
        >
          <Cloud className="w-4 h-4" /> Sign up · Free
        </Link>
        <Link to="/login" className="text-sm text-tiq-mint font-medium hover:underline shrink-0">
          Sign in
        </Link>
      </div>
    </div>
  );
}
