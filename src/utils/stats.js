import { todayStr, daysAgoStr } from "./date";

// "2026-11-21" ← رقم اليوم (بدون تأثر بالمنطقة الزمنية)
const toDayNumber = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

export function lastDays(logs, n) {
  const map = {};
  for (const l of logs) map[l.date] = (map[l.date] ?? 0) + l.pages;

  return Array.from({ length: n }, (_, i) => {
    const date = daysAgoStr(n - 1 - i);
    return { date, pages: map[date] ?? 0 };
  });
}

export function currentStreak(logs) {
  const days = new Set(logs.map((l) => l.date));
  // لو لم تقرأ اليوم بعد، لا تنكسر السلسلة حتى ينتهي اليوم
  let i = days.has(todayStr()) ? 0 : 1;
  let streak = 0;
  while (days.has(daysAgoStr(i))) {
    streak++;
    i++;
  }
  return streak;
}

export function longestStreak(logs) {
  const nums = [...new Set(logs.map((l) => l.date))]
    .map(toDayNumber)
    .sort((a, b) => a - b);

  let best = 0;
  let run = 0;
  nums.forEach((n, i) => {
    run = i > 0 && n - nums[i - 1] === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

export function monthPages(logs) {
  const prefix = todayStr().slice(0, 7); // "2026-11"
  return logs
    .filter((l) => l.date.startsWith(prefix))
    .reduce((sum, l) => sum + l.pages, 0);
}