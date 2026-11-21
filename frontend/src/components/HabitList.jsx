import HabitCard from "./HabitCard";
import { useHabitToggle } from "../hooks/useHabitToggle";

function HabitList({ habits, setHabits, onEdit, onDelete, onError }) {
  const { toggle, isPending } = useHabitToggle(setHabits, onError);

  if (habits.length === 0) {
    return <p className="empty-state">No habits yet — add one to get started.</p>;
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          pending={isPending(habit._id)}
          onToggle={() => toggle(habit)}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit._id)}
        />
      ))}
    </div>
  );
}

export default HabitList;