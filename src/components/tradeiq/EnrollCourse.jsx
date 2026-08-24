import React from "react";
import { ArrowRight, Cloud } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useProgress } from "@/lib/ProgressContext";
import { useAuth } from "@/lib/AuthContext";

// Shown on a course dashboard before the learner has enrolled.
//
// This replaced a "tell us your experience level" prompt that stored an answer
// nothing in the app ever read — it did not change the lessons, the questions,
// or the order of anything. Practice mode has its own per-session difficulty
// picker, which is where difficulty actually comes from. So the prompt was
// friction with no payoff; enrolling is at least a real signal, and it drives
// the "My Courses" section on the catalog.
//
// A signed-out visitor gets a different call to action. Course links get
// shared, so this is frequently someone's first contact with the product, and
// "Enroll" alone does not tell them that the certificate costs nothing or that
// an account is what carries progress between their phone and their laptop.
export default function EnrollCourse({ course }) {
  const { saveCourseProgress } = useProgress();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const enroll = () => {
    saveCourseProgress(course.id, { enrolled: true, enrolled_at: new Date().toISOString() });
  };

  return (
    <div className="mb-8 rounded-xl bg-white border border-tiq-border overflow-hidden">
      <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
        <h2 className="font-slab text-xl text-tiq-ink font-bold">
          {isAuthenticated ? "Start this course" : "Sign up and enroll"}
        </h2>
        <p className="text-sm text-slate-600">
          {isAuthenticated
            ? "Free, and your progress saves as you go."
            : "Earn a certification for free and keep track of your progress across devices!"}
        </p>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-5">
          Enrol to add this course to <span className="font-medium text-tiq-ink">My Courses</span> and
          start tracking your progress. Everything stays unlocked in order — finish a
          module, or pass its quiz, to move on.
        </p>
        {isAuthenticated ? (
          <button
            onClick={enroll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
          >
            Enroll
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Comes back to this course after signing in, rather than dropping
                someone on the catalog to find their way back. */}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
            >
              <Cloud className="w-4 h-4" />
              Sign up and enroll
            </Link>
            <button
              onClick={enroll}
              className="text-sm text-slate-500 hover:text-tiq-ink underline underline-offset-2"
            >
              or start without an account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
