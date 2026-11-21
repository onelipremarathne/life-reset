import { toDateString, isCompletedOn, startDateOf } from "./dateHelpers";

function isDayComplete(habits, dateStr) {
    const existing = habits.filter((h) => startDateOf(h) <= dateStr);
    if (existing.length === 0) return false;
    return existing.every((h) => isCompletedOn(h, dateStr));
}

export function calculateStreak(habits) {
  if (habits.length === 0) return 0;

  const cursor = new Date();
  if (!isDayComplete(toDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (isDayComplete(habits, toDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function calculateLongestStreak(habits) {
  if (habits.length === 0) return 0;

  const earliest = habits.map(startDateOf).sort()[0];
  const cursor = new Date(earliest + "T00:00:00");
  const todayStr = toDateString();

  let best = 0;
  let run = 0;
  while (toDateString(cursor) <= todayStr) {
    if (isDayComplete(habits, toDateString(cursor))) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return best;
}