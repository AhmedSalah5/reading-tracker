import { Flame, Minus, Plus } from "lucide-react";
import { todayStr } from "../utils/date";
import {
  lastDays,
  currentStreak,
  longestStreak,
  monthPages,
} from "../utils/stats";

const dayLabel = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ar-EG", {
    weekday: "short",
  });
};

export default function StatsPage({ books, logs, goal, onGoalChange }) {
  const week = lastDays(logs, 7);
  const weekTotal = week.reduce((s, d) => s + d.pages, 0);
  const maxPages = Math.max(...week.map((d) => d.pages), 1);

  const streak = currentStreak(logs);
  const best = longestStreak(logs);
  const readToday = logs.some((l) => l.date === todayStr());
  const totalPages = logs.reduce((s, l) => s + l.pages, 0);

  // هدف السنة
  const now = new Date();
  const year = now.getFullYear();
  const doneThisYear = books.filter(
    (b) =>
      b.status === "done" &&
      b.finishedAt &&
      new Date(b.finishedAt).getFullYear() === year
  ).length;
  const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / 86400000);
  const expected = (goal * dayOfYear) / 365;
  const diff = doneThisYear - expected;
  const goalPercent = Math.min(100, Math.round((doneThisYear / goal) * 100));

  let paceText = "أنت على المسار الصحيح 👌";
  if (diff >= 0.5) paceText = "أنت متقدم عن الخطة 🚀";
  else if (diff <= -0.5) paceText = "أنت متأخر قليلًا عن الخطة، أكمل 💪";

  let streakText = "ابدأ اليوم بتسجيل بعض الصفحات";
  if (streak > 0 && !readToday) streakText = "سجّل اليوم للحفاظ على سلسلتك";
  else if (streak > 0) streakText = "أحسنت، استمر!";

  const cards = [
    { label: "صفحات هذا الشهر", value: monthPages(logs) },
    { label: "أطول سلسلة (يوم)", value: best },
    { label: "إجمالي الصفحات", value: totalPages },
    {
      label: "كتب منتهية",
      value: books.filter((b) => b.status === "done").length,
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-center">إحصائياتي</h1>

      {/* السلسلة */}
      <div className="bg-orange-500 text-white rounded-xl p-4 flex items-center gap-4">
        <Flame size={48} />
        <div>
          <p className="text-3xl font-bold">{streak} يوم متتالي</p>
          <p className="text-sm opacity-90">{streakText}</p>
        </div>
      </div>

      {/* الهدف السنوي */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">هدف {year}</h2>
          <div className="flex items-center gap-3">
            <button
              aria-label="إنقاص الهدف"
              onClick={() => onGoalChange(Math.max(1, goal - 1))}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold w-6 text-center">{goal}</span>
            <button
              aria-label="زيادة الهدف"
              onClick={() => onGoalChange(goal + 1)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${goalPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-slate-600">
          <span>
            {doneThisYear} / {goal} كتاب
          </span>
          <span>{paceText}</span>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">آخر 7 أيام</h2>
          <span className="text-sm text-slate-500">{weekTotal} صفحة</span>
        </div>

        <div className="flex items-end gap-2 h-36">
          {week.map((d) => {
            const isToday = d.date === todayStr();
            return (
              <div
                key={d.date}
                className="flex-1 h-full flex flex-col justify-end items-center gap-1"
              >
                <span className="text-xs text-slate-500">
                  {d.pages > 0 ? d.pages : ""}
                </span>
                <div
                  className={`w-full rounded-t-md ${
                    isToday ? "bg-indigo-600" : "bg-indigo-300"
                  }`}
                  style={{
                    height: `${(d.pages / maxPages) * 80}%`,
                    minHeight: "4px",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          {week.map((d) => (
            <span
              key={d.date}
              className="flex-1 text-center text-xs text-slate-500"
            >
              {dayLabel(d.date)}
            </span>
          ))}
        </div>
      </div>

      {/* بطاقات */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl shadow p-4 text-center"
          >
            <p className="text-3xl font-bold text-indigo-600">{c.value}</p>
            <p className="text-sm text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}