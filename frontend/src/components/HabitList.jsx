import api from "../api";
import HabitCard from "./HabitCard";

function HabitList({ habits, setHabits }) {
  const handleToggle = async (habit) => {
    const res = await api.put(`/habits/${habit._id}`, {
      completedToday: !habit.completedToday,
    });

    setHabits((current) =>
      current.map((item) =>
        item._id === habit._id ? res.data : item
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this habit?")) return;

    await api.delete(`/habits/${id}`);
    setHabits((current) => current.filter((habit) => habit._id !== id));
  };

  if (habits.length === 0) {
    return <p>No habits yet — add one above.</p>;
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onToggle={() => handleToggle(habit)}
          onDelete={() => handleDelete(habit._id)}
        />
      ))}
    </div>
  );
}

export default HabitList;