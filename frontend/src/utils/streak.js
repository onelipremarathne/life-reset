export function calculateStreak(habits) {
  if (habits.length === 0) return 0;

  let streak = 0;
  let cursor = new Date();

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0]; //turns into the standard format then splits at T and will get yyyy-mm-dd

    const allCompleted = habits.every((habit) => {
      const entry = habit.completionHistory.find((h) => h.date === dateStr);
      return entry && entry.completed;
    });

    if (!allCompleted) break;

    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}