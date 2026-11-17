import api from "../api";
import HabitCard from "./HabitCard";

function HabitList({ habits, setHabits, onEdit, onDelete }) {
  const handleToggle = async (habit) => {
    const res = await api.put(`/habits/${habit._id}`, {
      completedToday: !habit.completedToday,
    });

    setHabits((prev) =>
      prev.map((item) =>
        item._id === habit._id ? res.data : item
      )
    );
  };

  if (habits.length === 0) {
    return <p className="empty-state">No habits yet — add one to get started.</p>;
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onToggle={() => handleToggle(habit)}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit._id)}
        />
      ))}
    </div>
  );
}

export default HabitList;