import React, { useState, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Target,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useProgress } from "@/lib/ProgressContext";
import PracticeQuiz from "@/components/tradeiq/PracticeQuiz";
import {
  buildAssessment,
  buildImprovementSession,
  scoreAssessment,
  assessableTopicCount,
  moduleBand,
  ASSESSMENT_SIZE,
  IMPROVE_SIZE,
  WEAK_THRESHOLD,
} from "@/lib/knowledgeCheck";

function timeAgo(iso) {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

// Knowledge Check — one place to measure recall across everything learned and
// then close the gaps it finds. Two modes on purpose: assessing and improving
// need opposite question selection (see knowledgeCheck.js), and blurring them
// would make the score meaningless.
export default function KnowledgeCheck() {
  const { progress, recordAssessment } = useProgress();
  const [mode, setMode] = useState(null); // 'assess' | 'improve'
  const [questions, setQuestions] = useState([]);
  const [justScored, setJustScored] = useState(null);

  // Per-topic tallies for the run in progress. A ref because PracticeQuiz reports
  // each answer as it happens and re-rendering on every question would restart
  // the quiz.
  const tallies = useRef({});

  const last = progress?.last_assessment || null;
  const topicCount = useMemo(() => assessableTopicCount(progress), [progress]);
  const history = progress?.assessment_history || [];
  const previous = history.length > 1 ? history[history.length - 2] : null;

  const startAssessment = () => {
    tallies.current = {};
    setJustScored(null);
    setQuestions(buildAssessment(progress, ASSESSMENT_SIZE));
    setMode("assess");
  };

  const startImprove = () => {
    tallies.current = {};
    setJustScored(null);
    setQuestions(buildImprovementSession(progress, last, IMPROVE_SIZE));
    setMode("improve");
  };

  const onQuestionResult = useCallback((topicId, isCorrect, question) => {
    const courseId = question?._courseId || "";
    const key = `${courseId}::${topicId}`;
    const t = tallies.current[key] || { correct: 0, total: 0 };
    t.total += 1;
    if (isCorrect) t.correct += 1;
    tallies.current[key] = t;
  }, []);

  const finishAssessment = async () => {
    const result = scoreAssessment(tallies.current);
    recordAssessment(result);
    setJustScored(result);
    return { xpGain: 0 };
  };

  const exit = () => {
    setMode(null);
    setQuestions([]);
  };

  if (mode && questions.length > 0) {
    return (
      <PracticeQuiz
        questions={questions}
        onQuestionResult={onQuestionResult}
        onComplete={mode === "assess" ? finishAssessment : async () => ({ xpGain: 0 })}
        onExit={exit}
        title={mode === "assess" ? "Knowledge Check" : "Boost Weak Topics"}
        exitLabel="Back to Knowledge Check"
        overlay
      />
    );
  }

  const shown = justScored || last;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
          <ArrowLeft className="w-4 h-4" /> All Courses
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Brain className="w-6 h-6 text-tiq-mint" />
        <h1 className="font-slab text-2xl sm:text-3xl text-tiq-ink font-bold">Knowledge Check</h1>
      </div>
      <p className="text-slate-600 mb-6">
        Measure how well you remember each module, then drill the weak spots. Built for
        keeping knowledge fresh long after a course is finished.
      </p>

      {topicCount === 0 ? (
        <div className="rounded-xl border border-tiq-border bg-tiq-mintLight/40 p-6 text-center">
          <BookOpen className="w-10 h-10 text-tiq-mint mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-1">Nothing to assess yet.</p>
          <p className="text-xs text-slate-500 mb-4">
            Complete some lessons and your knowledge check will draw questions from them.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition"
          >
            Browse courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl border border-tiq-border bg-white p-5 flex flex-col">
              <Target className="w-5 h-5 text-tiq-mint mb-2" />
              <h2 className="font-slab text-base text-tiq-ink font-bold mb-1">Assess my knowledge</h2>
              <p className="text-sm text-slate-600 mb-4 flex-1">
                {ASSESSMENT_SIZE} questions spread evenly across all {topicCount} topics you've
                learned — an even sample, so the score actually means something.
              </p>
              <button
                onClick={startAssessment}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
              >
                {last ? "Reassess" : "Start assessment"}
                <ArrowRight className="w-4 h-4" />
              </button>
              {last && (
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Last assessed {timeAgo(last.date)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-tiq-border bg-white p-5 flex flex-col">
              <TrendingUp className="w-5 h-5 text-tiq-gold mb-2" />
              <h2 className="font-slab text-base text-tiq-ink font-bold mb-1">Boost weak topics</h2>
              <p className="text-sm text-slate-600 mb-4 flex-1">
                {last
                  ? `${IMPROVE_SIZE} questions weighted towards the topics your last assessment found weakest.`
                  : `${IMPROVE_SIZE} questions weighted towards whatever your memory is currently shakiest on. Assess first for a sharper target.`}
              </p>
              <button
                onClick={startImprove}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-tiq-border text-slate-700 font-semibold hover:bg-tiq-mintLight transition text-sm"
              >
                Start boost session
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results */}
          {shown && (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                <h2 className="font-slab text-lg text-tiq-ink font-bold">
                  {justScored ? "Your results" : "Last assessment"}
                </h2>
                <span className="text-xs text-slate-500">
                  {shown.correct}/{shown.total} correct · {timeAgo(shown.date)}
                </span>
              </div>

              <div className="rounded-xl border border-tiq-border bg-white p-5 mb-6">
                <div className="flex items-end gap-3 mb-1">
                  <span className="font-slab text-4xl text-tiq-ink font-bold leading-none">{shown.pct}%</span>
                  {previous && justScored && (
                    <span
                      className={`text-sm font-medium ${
                        shown.pct >= previous.pct ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {shown.pct >= previous.pct ? "+" : ""}
                      {shown.pct - previous.pct} vs last time
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Overall recall across the topics sampled</p>
              </div>

              {/* Module breakdown */}
              <h3 className="font-slab text-base text-tiq-ink font-bold mb-3">How well you remember each module</h3>
              <ul className="space-y-2.5 mb-8">
                {shown.modules.map((m) => {
                  const band = moduleBand(m.pct);
                  return (
                    <li key={`${m.courseId}::${m.moduleId}`} className="rounded-lg border border-tiq-border bg-white p-3.5">
                      <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-tiq-ink truncate">{m.moduleTitle}</p>
                          <p className="text-[11px] text-slate-400 truncate">{m.courseTitle}</p>
                        </div>
                        <span className={`text-xs font-semibold shrink-0 ${band.tone}`}>
                          {band.label} · {m.pct}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-tiq-mintLight rounded-full overflow-hidden">
                          <div className={`h-full ${band.bar} rounded-full transition-all`} style={{ width: `${m.pct}%` }} />
                        </div>
                        <span className="text-[11px] font-mono-tiq text-slate-400 shrink-0">
                          {m.correct}/{m.total}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Suggested review */}
              <h3 className="font-slab text-base text-tiq-ink font-bold mb-1">Suggested review</h3>
              {shown.weakTopics.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-tiq-ink mb-0.5">Nothing below {WEAK_THRESHOLD}%.</p>
                    <p className="text-xs text-slate-600">
                      Every topic sampled came back solid. Reassess in a week or two to catch anything fading.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-3">
                    These scored under {WEAK_THRESHOLD}% — open the lesson, or run a boost session to drill them.
                  </p>
                  <ul className="space-y-2">
                    {shown.weakTopics.map((t) => (
                      <li key={`${t.courseId}::${t.topicId}`}>
                        <Link
                          to={`/course/${t.courseId}/learn/${t.topicId}`}
                          className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 hover:border-amber-500/50 transition"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-tiq-ink truncate">{t.topicTitle}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {t.moduleTitle} · {t.courseTitle}
                            </p>
                          </div>
                          <span className="text-xs font-mono-tiq text-amber-600 shrink-0">
                            {t.correct}/{t.total}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={startImprove}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-tiq-gold/90 text-white font-semibold hover:bg-tiq-gold transition text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Drill these now
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
