const toDateStr = (d) => d.toISOString().split("T")[0];

export function calculateStreak(habits) {
  if (habits.length === 0) return 0;

  const isDayComplete = (dateStr) =>
    habit.every((habit) => {
      const entry = habit.completionHistory.find((h) => h.date === dateStr);
      return entry && entry.completed;
    });

  let cursor = new Date();

  if (!isDayComplete(toISOString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (isDayComplete(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}