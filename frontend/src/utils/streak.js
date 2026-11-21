import { toDateString, isCompletedOn, startDateOf } from './dateHelpers';

export function calculateStreak(habits) {
  if (habits.length === 0) return 0;

  const isDayComplete = (dateStr) => {
    const existing = habits.filter((h) => startDateOf(h) <= dateStr);
    if (existing.length === 0) return false;
    return existing.every((h) => isCompletedOn(h, dateStr));
  };

  const cursor = new Date();
  if (!isDayComplete(toDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (isDayComplete(toDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}