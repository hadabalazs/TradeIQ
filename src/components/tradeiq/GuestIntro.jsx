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
    title: "You recall, not re-read",
    body:
      "Re-reading feels like learning but fades fast. Every topic here ends in questions, because the act of retrieving something is what makes it stick — the testing effect.",
  },
  {
    icon: RefreshCw,
    title: "Timed to the forgetting curve",
    body:
      "Each question is scheduled individually and comes back just before you'd forget it. Answer confidently and it waits longer; hesitate and it returns sooner.",
  },
  {
    icon: Shuffle,
    title: "Mixed on purpose",
    body:
      "Topics and question formats are interleaved rather than blocked. It feels harder in the moment — and that difficulty is what builds durable memory.",
  },
  {
    icon: LineChart,
    title: "Retention you can see",
    body:
      "A predicted recall score per module, so you know what's solid and what's slipping — and can drill exactly the weak spots instead of re-reading everything.",
  },
];

export default function GuestIntro({ courseCount = 0 }) {
  return (
    <div className="mb-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size={56} />
        </div>
        <h1 className="font-slab text-3xl sm:text-4xl text-tiq-ink font-bold mb-3">
          Learn it once. Actually remember it.
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-2">
          TradeIQ Academy teaches professional subjects using a method backed by
          neuroscience research on how memory actually forms — not how courses usually look.
        </p>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Most courses are watched once and forgotten within weeks. This one is built to
          still be in your head months later.
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
          Browse {courseCount > 0 ? `${courseCount} courses` : "courses"}
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
            Built on how memory works
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Four findings from decades of memory research, wired into the way every lesson
            and review session behaves.
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
            <span className="font-semibold text-tiq-ink">Start learning right now</span> — no
            account needed. Create one free to sync your progress across devices and earn a
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
