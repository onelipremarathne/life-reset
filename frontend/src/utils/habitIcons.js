import { Footprints, BookOpen, Flame, Dumbbell, Droplet, Moon, Ban, Coffee, Brain, PenLine } from 'lucide-react';

export const HABIT_ICONS = {
  Footprints,
  BookOpen,
  Flame,
  Dumbbell,
  Droplet,
  Moon,
  Ban,
  Coffee,
  Brain,
  PenLine,
};

export const HABIT_ICON_KEYS = Object.keys(HABIT_ICONS);

export function getHabitIcon(key) {
  return HABIT_ICONS[key] || Footprints; // fallback if key is missing or unrecognized
}