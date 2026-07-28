import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { PASS_THRESHOLD } from "@/lib/courses";
import { FlashcardQuestion, FillInBlankQuestion, SortingQuestion } from "@/components/tradeiq/QuestionTypes";
import TermMatchQuestion from "@/components/tradeiq/TermMatchQuestion";
import RecallPopup from "@/components/tradeiq/RecallPopup";
import FlagQuestion from "@/components/tradeiq/FlagQuestion";
import { recordReview, Grades } from "@/lib/srs";

// Delay before auto-advancing after a wrong answer, so the learner sees the
// correct option highlighted. Correct answers advance on the confidence tap.
const WRONG_ADVANCE_MS = 1400;

export default function PracticeQuiz({
  questions,
  onComplete,
  onExit,
  onQuestionResult,
  title,
  exitLabel = "Back to Setup",
  overlay = false,
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const advanceTimer = useRef(null);

  const question = questions[current];
  const isLast = current === questions.length - 1;
  const questionType = question.questionType || "multiple-choice";

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Advance to the next question (or finish). `grade` is the FSRS grade to
  // commit for a correct answer; wrong answers are already graded AGAIN.
  const advance = useCallback(
    async (grade) => {
      clearTimeout(advanceTimer.current);
      if (wasCorrect && grade) {
        recordReview(question, grade);
      }
      setWasCorrect(false);
      if (isLast) {
        const score = Math.round((correctCount / questions.length) * 100);
        const res = onComplete ? await onComplete(correctCount, questions.length) : {};
        setResult({ score, ...res });
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnswered(false);
      }
    },
    [wasCorrect, question, isLast, correctCount, questions.length, onComplete]
  );

  const handleAnswer = useCallback(
    (isCorrect, selectedIdx = -1) => {
      if (answered) return;
      setSelected(selectedIdx);
      setAnswered(true);
      setWasCorrect(isCorrect);
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        // Correct → wait for the confidence tap to advance (sets spacing).
      } else {
        setMissed((m) => [...m, { question, selected: selectedIdx }]);
        recordReview(question, Grades.AGAIN);
        // Wrong → no confidence to pick; show the answer briefly, then move on.
        advanceTimer.current = setTimeout(() => advance(null), WRONG_ADVANCE_MS);
      }
      if (onQuestionResult && question._topicId) {
        onQuestionResult(question._topicId, isCorrect);
      }
    },
    [answered, question, advance, onQuestionResult]
  );

  const choose = (idx) => handleAnswer(idx === question.answer, idx);
  const chooseTyped = (isCorrect) => handleAnswer(isCorrect, -1);

  const retake = () => {
    clearTimeout(advanceTimer.current);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setMissed([]);
    setFinished(false);
    setResult(null);
    setWasCorrect(false);
  };

  // ---------- Results screen ----------
  if (finished) {
    const passed = result.score >= PASS_THRESHOLD;
    const body = (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-emerald-500/10" : "bg-tiq-mintLight"}`}>
            {passed ? <Trophy className="w-10 h-10 text-emerald-500" /> : <AlertCircle className="w-10 h-10 text-slate-500" />}
          </div>
          <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">{passed ? "Well Done!" : "Keep Practicing"}</h2>
          <p className="text-slate-600 mb-1">
            You scored <span className="text-tiq-mint font-mono-tiq font-bold text-lg">{result.score}%</span>
          </p>
          <p className="text-sm text-slate-500 mb-4">{correctCount} of {questions.length} correct</p>
          {result.xpGain > 0 && (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 text-tiq-mint mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono-tiq font-semibold">+{result.xpGain} XP</span>
            </div>
          )}
        </div>

        {missed.length > 0 ? (
          <div className="mb-6">
            <h3 className="font-slab text-lg text-tiq-ink font-bold mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Review: {missed.length} missed {missed.length === 1 ? "question" : "questions"}
            </h3>
            <div className="space-y-4">
              {missed.map((m, i) => {
                const isMC = !m.question.questionType || m.question.questionType === "multiple-choice";
                return (
                  <div key={i} className="p-4 rounded-lg bg-white border border-tiq-border">
                    <p className="font-medium text-tiq-ink mb-2 text-sm">{m.question.q}</p>
                    {isMC ? (
                      <div className="space-y-1.5 mb-3">
                        {m.question.options.map((opt, idx) => {
                          const isCorrect = idx === m.question.answer;
                          const isSelected = idx === m.selected;
                          let style = "text-slate-500";
                          if (isCorrect) style = "text-emerald-600 font-medium";
                          else if (isSelected) style = "text-red-600 font-medium";
                          return (
                            <div key={idx} className={`text-sm flex items-center gap-2 ${style}`}>
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono-tiq shrink-0">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                              {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mb-3 p-3 rounded-lg bg-tiq-mintLight border border-tiq-border space-y-1">
                        {m.question.answerText && (
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold text-tiq-mint">Answer: </span>{m.question.answerText}
                          </p>
                        )}
                        {m.question.questionType === "sorting" && (
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-tiq-mint">Correct order:</p>
                            {m.question.options.map((opt, i) => (
                              <p key={i} className="text-sm text-slate-700 flex items-center gap-1.5">
                                <span className="font-mono-tiq text-tiq-mint font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
                              </p>
                            ))}
                          </div>
                        )}
                        {m.question.questionType === "term-match" && (
                          <div className="space-y-1">
                            {m.question.pairs.map((p, i) => (
                              <p key={i} className="text-sm text-slate-700">
                                <span className="font-medium text-tiq-ink">{p.term}</span> — {p.definition}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-tiq-mintLight border border-tiq-border">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-tiq-mint">Explanation: </span>{m.question.explain}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <p className="text-sm text-emerald-600 font-medium">Perfect score — no missed questions to review!</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={retake} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          {onExit && (
            <button onClick={onExit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm">
              {exitLabel}
            </button>
          )}
        </div>
      </div>
    );
    return overlay ? <Overlay onClose={onExit}>{body}</Overlay> : body;
  }

  // ---------- Question screen ----------
  const progressPct = (current / questions.length) * 100;
  const body = (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono-tiq text-slate-500">Question {current + 1} of {questions.length}</span>
        <div className="flex-1 h-1 bg-tiq-mintLight rounded-full mx-3 overflow-hidden">
          <div className="h-full bg-tiq-mint transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        {/* Review questions carry their origin on the question itself, since a
            session mixes topics and courses. */}
        <FlagQuestion
          question={question}
          courseId={question._courseId}
          topicId={question._topicId}
          className="shrink-0"
        />
      </div>

      {questionType === "multiple-choice" && (
        <>
          <h2 className="font-slab text-xl text-tiq-ink font-bold mb-5">{question.q}</h2>
          <div className="space-y-2.5 mb-5">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.answer;
              const isSelected = idx === selected;
              let style = "border-tiq-border bg-white hover:border-tiq-mint/30 text-slate-700";
              if (answered) {
                if (isCorrect) style = "border-emerald-500/50 bg-emerald-500/10 text-tiq-ink";
                else if (isSelected) style = "border-red-500/50 bg-red-500/10 text-tiq-ink";
                else style = "border-tiq-border bg-tiq-mintLight/50 text-slate-500";
              }
              return (
                <button key={idx} onClick={() => choose(idx)} disabled={answered}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${style}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono-tiq shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm flex-1">{opt}</span>
                  {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
      {questionType === "flashcard" && <FlashcardQuestion key={`fc-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={false} />}
      {questionType === "fill-in-the-blank" && <FillInBlankQuestion key={`fb-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={false} />}
      {questionType === "sorting" && <SortingQuestion key={`so-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={false} />}
      {questionType === "term-match" && <TermMatchQuestion key={`tm-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={false} />}

      {/* Correct → recall popup IS the advance control (tap = grade + next).
          No separate "Next" button anywhere. Wrong → auto-advances after a beat. */}
      {answered && wasCorrect && <RecallPopup onSelect={(grade) => advance(grade)} />}
      {answered && !wasCorrect && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2">
          <span className="inline-block w-4 h-4 border-2 border-tiq-mint/30 border-t-tiq-mint rounded-full animate-spin" />
          Moving on…
        </div>
      )}
    </div>
  );

  return overlay ? <Overlay onClose={onExit}>{body}</Overlay> : body;
}

// Full-screen overlay wrapper for review sessions — easier to focus and
// navigate than an inline panel, especially on mobile.
function Overlay({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="relative bg-tiq-navy w-full sm:max-w-2xl sm:rounded-2xl shadow-xl min-h-[100dvh] sm:min-h-0 sm:my-6 p-5 sm:p-7">
        {onClose && (
          <button onClick={onClose} aria-label="Close review"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-tiq-border flex items-center justify-center text-slate-500 transition">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="pt-6 sm:pt-2">{children}</div>
      </div>
    </div>
  );
}
