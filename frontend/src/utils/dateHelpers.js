export function toDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getTodayString() {
  return toDateString();
}

function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toDateString(d));
  }
  return days;
}

export const getLast7Days = () => lastNDays(7);
export const getLast14Days = () => lastNDays(14);

export function isCompletedOn(habit, date) {
  const entry = habit.completionHistory.find((h) => h.date === date);
  return !!(entry && entry.completed);
}

// Day the habit started being tracked (local date)
export function startDateOf(habit) {
  return toDateString(new Date(habit.createdAt));
}

// Completed vs possible check-ins across the given days,
// only counting days on/after each habit was created.
export function weekStats(habits, days) {
  let completed = 0;
  let possible = 0;
  for (const h of habits) {
    const start = startDateOf(h);
    for (const d of days) {
      if (d < start) continue;
      possible++;
      if (isCompletedOn(h, d)) completed++;
    }
  }
  return { completed, possible };
}
