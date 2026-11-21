import { useRef, useState } from "react";
import api from "../api";
import { getTodayString, isCompletedOn } from "../utils/dateHelpers";

export function useHabitToggle(setHabits, onError) {
  const inFlight = useRef(new Set());
  const [pending, setPending] = useState([]);

  const toggle = async (habit) => {
    if (inFlight.current.has(habit._id)) return;
    inFlight.current.add(habit._id);
    setPending([...inFlight.current]);

    const today = getTodayString();
    try {
      const res = await api.put(`/habits/${habit._id}`, {
        completedToday: !isCompletedOn(habit, today),
        date: today,
      });
      setHabits((prev) =>
        prev.map((h) => (h._id === habit._id ? res.data : h)),
      );
    } catch {
      onError?.("Couldn't update that habit. Is the backend running?");
    } finally {
      inFlight.current.delete(habit._id);
      setPending([...inFlight.current]);
    }
  };

  return { toggle, isPending: (id) => pending.includes(id) };
}
