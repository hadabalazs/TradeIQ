import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Trophy, Sparkles, Lock, Eye } from "lucide-react";
import { getCourse, FINAL_PASS_THRESHOLD, shuffleQuestionOptions, diversifyQuizArray, buildFinalExamPool } from "@/lib/courses";
import { useProgress } from "@/lib/ProgressContext";
import { useAuth } from "@/lib/AuthContext";
import { issueCertificate } from "@/lib/certificates";
import Certificate from "@/components/tradeiq/Certificate";
import FlagQuestion from "@/components/tradeiq/FlagQuestion";
import { FillInBlankQuestion, SortingQuestion } from "@/components/tradeiq/QuestionTypes";
import TermMatchQuestion from "@/components/tradeiq/TermMatchQuestion";

export default function FinalAssessmentView() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { progress, save } = useProgress();
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  // The final exam used to be multiple-choice only, which made it the least
  // varied assessment in the app. It now runs through the same diversification
  // as module quizzes — but with allowSelfGraded:false, so no flashcards: those
  // are marked by the learner tapping "I Remembered This", which cannot decide a
  // certification. Fill-in-the-blank, sorting and term-match are all checked
  // against a definitive answer, so they are fair game.
  const [shuffledAssessment, setShuffledAssessment] = useState(() =>
    course ? diversifyQuizArray(buildFinalExamPool(course).map(shuffleQuestionOptions), { allowSelfGraded: false }) : []
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [certName, setCertName] = useState(progress?.user_name || "");

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-600 mb-4">Course not found.</p>
        <Link to="/" className="text-tiq-mint hover:underline">Back to courses</Link>
      </div>
    );
  }

  const courseProg = progress?.courses?.[course.id] || {};
  const totalTopics = course.modules.reduce((s, m) => s + m.topics.length, 0);
  const allCompleted = (courseProg.completed_topics || []).length >= totalTopics || courseProg.unlock_all;
  const question = shuffledAssessment[current];
  const isLast = current === shuffledAssessment.length - 1;

  const questionType = question?.questionType || "multiple-choice";

  // Non-MCQ types report their own correctness against a definitive answer.
  const chooseTyped = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const choose = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.answer) setCorrectCount((c) => c + 1);
  };

  const next = async () => {
    if (isLast) {
      const pct = Math.round((correctCount / shuffledAssessment.length) * 100);
      setScore(pct);
      const passed = pct >= FINAL_PASS_THRESHOLD;
      save({
        courses: {
          ...(progress.courses || {}),
          [course.id]: {
            ...courseProg,
            final_assessment_score: Math.max(pct, courseProg.final_assessment_score || 0),
            certified: passed || courseProg.certified || false,
          },
        },
        total_xp: (progress?.total_xp || 0) + correctCount * 10 + (passed && !courseProg.certified ? 100 : 0),
      });

      // Record the certificate so it can actually be verified. Certificates are
      // only issuable for a signed-in learner — there is no way to attest to a
      // credential for an anonymous device, and printing an id that would fail
      // verification is worse than printing none.
      if (passed && user?.id) {
        issueCertificate({
          userId: user.id,
          courseId: course.id,
          courseTitle: course.certificateTitle || course.title,
          learnerName: progress?.user_name || user.email?.split("@")[0] || "Learner",
          score: pct,
        }).catch(() => { /* offline or not yet migrated — cert stays unissued */ });
      }

      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const retake = () => {
    setShuffledAssessment(diversifyQuizArray(buildFinalExamPool(course).map(shuffleQuestionOptions), { allowSelfGraded: false }));
    setStarted(false);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
    setScore(0);
  };

  // Preview screen
  if (previewMode && !started && !finished) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
          <button onClick={() => setPreviewMode(false)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-slab text-lg text-tiq-ink font-bold">Certificate Preview</h2>
          <div className="w-16" />
        </div>
        <Certificate course={course} name={progress?.user_name} score={courseProg.final_assessment_score || 0} date={new Date()} preview />
        <p className="text-center text-sm text-slate-500 mt-4">This is a preview. Pass the final assessment to earn your certificate.</p>
      </div>
    );
  }

  // Intro screen
  if (!started && !finished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <div className="w-16 h-16 rounded-full bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-tiq-mint" />
        </div>
        <h1 className="font-slab text-3xl text-tiq-ink font-bold mb-2">Final Assessment</h1>
        <p className="text-slate-600 mb-6">
          {shuffledAssessment.length} questions covering all modules. Score {FINAL_PASS_THRESHOLD}% or higher to earn your TradeIQ Certificate.
        </p>

        {!allCompleted ? (
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-tiq-border text-slate-500 mb-4">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Complete all module topics first</span>
          </div>
        ) : (
          <div>
            {courseProg.certified && (
              <p className="text-sm text-emerald-600 mb-4">You're already certified! Retake to improve your score.</p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setStarted(true)}
                disabled={!allCompleted}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-40"
              >
                Begin Final Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview Certificate
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link to={`/course/${course.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const passed = score >= FINAL_PASS_THRESHOLD;
    return (
      <div className="py-6">
        {passed ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Certification Earned!</span>
              </div>
              <p className="text-slate-600">You scored {correctCount} of {shuffledAssessment.length} ({score}%)</p>
            </div>
            <div className="max-w-2xl mx-auto mb-6">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Name on certificate</label>
              <div className="flex gap-2">
                <input
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-tiq-mintLight border border-tiq-border text-tiq-ink focus:outline-none focus:border-tiq-mint/50"
                  placeholder="Your name"
                />
                <button
                  onClick={() => certName.trim() && save({ user_name: certName.trim() })}
                  disabled={!certName.trim() || certName.trim() === progress?.user_name}
                  className="px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition disabled:opacity-40"
                >
                  Update
                </button>
              </div>
            </div>
            <Certificate course={course} name={certName || progress?.user_name} score={score} date={new Date()} />
          </>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-8">
            <div className="w-20 h-20 rounded-full bg-tiq-mintLight mx-auto mb-4 flex items-center justify-center">
              <RotateCcw className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">Almost There</h2>
            <p className="text-slate-600 mb-1">You scored <span className="text-tiq-mint font-mono-tiq font-bold text-lg">{score}%</span></p>
            <p className="text-sm text-slate-500 mb-6">You need {FINAL_PASS_THRESHOLD}% to certify. Review the modules and try again.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={retake} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <Link to={`/course/${course.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm">
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
            </div>
          </div>
        )}
        {passed && (
          <div className="text-center mt-8">
            <button onClick={retake} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition text-sm">
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          </div>
        )}
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono-tiq text-slate-500">
          Question {current + 1} of {shuffledAssessment.length}
        </span>
        <div className="flex-1 h-1 bg-tiq-mintLight rounded-full mx-3 overflow-hidden">
          <div className="h-full bg-tiq-mint transition-all" style={{ width: `${(current / shuffledAssessment.length) * 100}%` }} />
        </div>
        <FlagQuestion
          question={question}
          courseId={course?.id}
          topicId={question._topicId}
          className="shrink-0"
        />
      </div>

      {questionType !== "multiple-choice" ? (
        <div className="mb-5">
          {questionType === "fill-in-the-blank" && (
            <FillInBlankQuestion key={`fb-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation />
          )}
          {questionType === "sorting" && (
            <SortingQuestion key={`so-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation />
          )}
          {questionType === "term-match" && (
            <TermMatchQuestion key={`tm-${current}`} question={question} answered={answered} onAnswered={chooseTyped} showExplanation />
          )}
        </div>
      ) : (
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