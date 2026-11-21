export const XP_PER_CHECKIN = 10;
export const XP_PER_ENTRY = 15;

const BASE = 50;

// Total XP needed to reach a level: L1 = 0, L2 = 50, L3 = 200, L4 = 450...
export const xpForLevel = (level) => BASE * (level - 1) ** 2;

export function countCheckins(habits) {
  return habits.reduce(
    (sum, h) => sum + h.completionHistory.filter((c) => c.completed).length,
    0,
  );
}

export function calculateXP(habits, entries) {
  return countCheckins(habits) * XP_PER_CHECKIN + entries.length * XP_PER_ENTRY;
}

export function getLevelInfo(totalXP) {
  const level = Math.floor(Math.sqrt(totalXP / BASE)) + 1;
  const start = xpForLevel(level);
  const end = xpForLevel(level + 1);
  return {
    level,
    totalXP,
    xpIntoLevel: totalXP - start,
    xpForNext: end - start,
    pct: Math.round(((totalXP - start) / (end - start)) * 100),
  };
}
