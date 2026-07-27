import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles, Theater } from "lucide-react";
import { PASS_THRESHOLD, shuffleQuestionOptions, diversifyQuizArray } from "@/lib/courses";
import { FlashcardQuestion, FillInBlankQuestion, SortingQuestion } from "@/components/tradeiq/QuestionTypes";
import TermMatchQuestion from "@/components/tradeiq/TermMatchQuestion";
import InlineDilemma from "@/components/tradeiq/InlineDilemma";
import ConfidenceGrade from "@/components/tradeiq/ConfidenceGrade";
import { recordReview, Grades } from "@/lib/srs";

function interleaveDilemmas(questions, dilemmas) {
  if (!dilemmas || dilemmas.length === 0) return questions;
  const result = [...questions];
  const interval = Math.max(2, Math.floor(result.length / (dilemmas.length + 1)));
  dilemmas.forEach((d, i) => {
    const insertAt = Math.min((i + 1) * interval + i, result.length);
    result.splice(insertAt, 0, { ...d, questionType: "dilemma" });
  });
  return result;
}

export default function QuizView({ topic, onComplete, onBackToLesson, dilemmas, course }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [shuffledQuiz, setShuffledQuiz] = useState(() => interleaveDilemmas(diversifyQuizArray(topic.quiz.map(shuffleQuestionOptions)), dilemmas));

  const question = shuffledQuiz[current];
  const isLast = current === shuffledQuiz.length - 1;
  const questionType = question.questionType || "multiple-choice";
  const scoredLength = shuffledQuiz.filter((q) => q.questionType !== "dilemma").length;

  const choose = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === question.answer;
    setWasCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    else recordReview(question, Grades.AGAIN);
  };

  const chooseTyped = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    setWasCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    else recordReview(question, Grades.AGAIN);
  };

  const next = async () => {
    if (wasCorrect && questionType !== "dilemma") {
      recordReview(question, confidence ?? Grades.GOOD);
    }
    setConfidence(null);
    setWasCorrect(false);
    if (isLast) {
      const score = Math.round((correctCount / scoredLength) * 100);
      const res = await onComplete(correctCount, scoredLength);
      setResult({ score, ...res });
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const retake = () => {
    setShuffledQuiz(interleaveDilemmas(diversifyQuizArray(topic.quiz.map(shuffleQuestionOptions)), dilemmas));
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
    setResult(null);
  };

  if (finished) {
    const passed = result.score >= PASS_THRESHOLD;
    return (
      <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center py-8">
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-emerald-500/10" : "bg-tiq-mintLight"}`}>
          {passed ? <Trophy className="w-10 h-10 text-emerald-500" /> : <RotateCcw className="w-10 h-10 text-slate-500" />}
        </div>
        <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">
          {passed ? "Quiz Passed!" : "Keep Studying"}
        </h2>
        <p className="text-slate-600 mb-1">
          You scored <span className="text-tiq-mint font-mono-tiq font-bold text-lg">{result.score}%</span>
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {correctCount} of {shuffledQuiz.length} correct · Pass mark {PASS_THRESHOLD}%
        </p>

        {result.xpGain > 0 && (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint/10 border border-tiq-mint/30 text-tiq-mint mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono-tiq font-semibold">+{result.xpGain} XP earned</span>
            {result.isFirstPass && <span className="text-xs">(First-pass bonus!)</span>}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={retake} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          <button onClick={onBackToLesson} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono-tiq text-slate-500">
          Question {current + 1} of {shuffledQuiz.length}
        </span>
        <div className="flex-1 h-1 bg-tiq-mintLight rounded-full mx-3 overflow-hidden">
          <div className="h-full bg-tiq-mint transition-all" style={{ width: `${((current) / shuffledQuiz.length) * 100}%` }} />
        </div>
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
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  disabled={answered}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${style}`}
                >
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

          {answered && (
            <div className="mb-5 p-3.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
              <p className="text-sm text-slate-700">
                <span className={`font-semibold ${selected === question.answer ? "text-emerald-600" : "text-red-600"}`}>
                  {selected === question.answer ? "Correct! " : "Not quite. "}
                </span>
                {question.explain}
              </p>
            </div>
          )}
        </>
      )}
      {questionType === "flashcard" && (
        <FlashcardQuestion key={`fc-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={true} />
      )}
      {questionType === "fill-in-the-blank" && (
        <FillInBlankQuestion key={`fb-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={true} />
      )}
      {questionType === "sorting" && (
        <SortingQuestion key={`so-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={true} />
      )}
      {questionType === "term-match" && (
        <TermMatchQuestion key={`tm-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation={true} />
      )}
      {questionType === "dilemma" && (
        <div className="rounded-lg border border-tiq-gold/30 bg-tiq-mintLight/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Theater className="w-4 h-4 text-tiq-gold" />
            <span className="font-slab text-sm text-tiq-ink font-bold">Real-World Scenario</span>
          </div>
          <InlineDilemma dilemma={question} course={course} onAdvance={next} />
        </div>
      )}

      {answered && wasCorrect && questionType !== "dilemma" && (
        <ConfidenceGrade value={confidence} onSelect={setConfidence} />
      )}

      {answered && (
        <button
          onClick={next}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition ml-auto"
        >
          {isLast ? "See Results" : "Next Question"}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}