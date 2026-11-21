import {
  Sprout,
  Flame,
  Trophy,
  PenLine,
  BookOpen,
  Layers,
  Star,
} from "lucide-react";
import { countCheckins, calculateXP, getLevelInfo } from "./xp";
import { calculateLongestStreak } from "./streak";

const DEFINITIONS = [
  {
    id: "first-checkin",
    name: "First Step",
    description: "Complete your first habit check-in.",
    icon: Sprout,
    test: (s) => s.checkins >= 1,
  },
  {
    id: "streak-3",
    name: "Warming Up",
    description: "Reach a 3-day streak.",
    icon: Flame,
    test: (s) => s.longestStreak >= 3,
  },
  {
    id: "streak-7",
    name: "Perfect Week",
    description: "Reach a 7-day streak.",
    icon: Flame,
    test: (s) => s.longestStreak >= 7,
  },
  {
    id: "streak-30",
    name: "Unshakeable",
    description: "Reach a 30-day streak.",
    icon: Trophy,
    test: (s) => s.longestStreak >= 30,
  },
  {
    id: "first-entry",
    name: "Dear Diary",
    description: "Write your first journal entry.",
    icon: PenLine,
    test: (s) => s.entries >= 1,
  },
  {
    id: "entries-10",
    name: "Storyteller",
    description: "Write 10 journal entries.",
    icon: BookOpen,
    test: (s) => s.entries >= 10,
  },
  {
    id: "habits-5",
    name: "Toolkit",
    description: "Track 5 habits at once.",
    icon: Layers,
    test: (s) => s.habits >= 5,
  },
  {
    id: "level-5",
    name: "Level 5",
    description: "Reach level 5.",
    icon: Star,
    test: (s) => s.level >= 5,
  },
];

export function buildStats(habits, entries) {
  return {
    checkins: countCheckins(habits),
    longestStreak: calculateLongestStreak(habits),
    entries: entries.length,
    habits: habits.length,
    level: getLevelInfo(calculateXP(habits, entries)).level,
  };
}

export function getBadges(habits, entries) {
  const stats = buildStats(habits, entries);
  return DEFINITIONS.map(({ test, ...badge }) => ({
    ...badge,
    earned: test(stats),
  }));
}
