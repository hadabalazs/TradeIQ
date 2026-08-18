import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameMonth,
  isToday,
} from "date-fns";

// `history` is days a Daily Recap was completed; `activeDays` is every day with
// any study activity. Both are shown, because a streak is built from activity —
// showing only recap days left learners with a live streak staring at an empty
// calendar.
export default function StreakCalendar({ history = [], activeDays = [], streak = 0, bestStreak = 0 }) {
  const [month, setMonth] = useState(new Date());

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = gridStart;
  while (day <= gridEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const recapDays = new Set(history);
  const studyDays = new Set(activeDays);
  // A day in the future can never have been studied. Guarding here rather than
  // trusting the data, because history is merged across devices and a device
  // with a skewed clock could otherwise stamp tomorrow as done.
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const notFuture = (d) => format(d, "yyyy-MM-dd") <= todayKey;
  const isRecap = (d) => notFuture(d) && recapDays.has(format(d, "yyyy-MM-dd"));
  const isStudied = (d) => notFuture(d) && studyDays.has(format(d, "yyyy-MM-dd"));

  return (
    <div className="bg-white rounded-xl border border-tiq-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="font-slab text-tiq-ink font-bold text-sm">Streak Calendar</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setMonth(addMonths(month, -1))}
          className="p-1 rounded hover:bg-tiq-mintLight"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-sm font-medium text-tiq-ink">
          {format(month, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setMonth(addMonths(month, 1))}
          className="p-1 rounded hover:bg-tiq-mintLight"
        >
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-[10px] text-slate-400 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const recap = isRecap(d);
          const studied = isStudied(d);
          const inMonth = isSameMonth(d, month);
          const today = isToday(d);
          // Only a day actually studied gets a fill. Every other in-month day
          // used to carry a mint tint, which read as "marked" — so the whole
          // month, future days included, looked like a perfect streak.
          const future = !notFuture(d);
          let style;
          if (recap) style = "bg-tiq-mint text-white font-bold";
          else if (studied) style = "bg-tiq-mint/30 text-tiq-ink font-semibold ring-1 ring-tiq-mint/40";
          else if (future) style = "text-slate-300";
          else if (inMonth) style = "text-slate-500";
          else style = "text-slate-300/70";
          return (
            <div
              key={i}
              title={recap ? "Daily Recap completed" : studied ? "Studied" : undefined}
              className={`aspect-square flex items-center justify-center text-xs rounded-md transition ${style} ${
                today ? "ring-2 ring-tiq-mint/50" : ""
              }`}
            >
              {format(d, "d")}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-tiq-mint inline-block" /> Recap done
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-tiq-mint/25 inline-block" /> Studied
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-tiq-border flex items-center justify-between text-xs">
        <span className="text-orange-500 font-mono-tiq font-bold flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> {streak} day streak
        </span>
        <span className="text-slate-500">Best: {bestStreak}</span>
      </div>
    </div>
  );
}