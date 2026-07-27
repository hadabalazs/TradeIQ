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

export default function StreakCalendar({ history = [], streak = 0, bestStreak = 0 }) {
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

  const isCompleted = (d) => history.includes(format(d, "yyyy-MM-dd"));

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
          const completed = isCompleted(d);
          const inMonth = isSameMonth(d, month);
          const today = isToday(d);
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-xs rounded-md transition ${
                completed
                  ? "bg-tiq-mint text-white font-bold"
                  : inMonth
                  ? "bg-tiq-mintLight/50 text-slate-600"
                  : "text-slate-300"
              } ${today ? "ring-2 ring-tiq-mint/50" : ""}`}
            >
              {format(d, "d")}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-tiq-border flex items-center justify-between text-xs">
        <span className="text-orange-500 font-mono-tiq font-bold flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> {streak} day streak
        </span>
        <span className="text-slate-500">Best: {bestStreak}</span>
      </div>
    </div>
  );
}