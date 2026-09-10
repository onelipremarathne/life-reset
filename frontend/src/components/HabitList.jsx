import api from '../api';
import HabitCard from './HabitCard';

function HabitList({ habits, setHabits }) {
  const handleToggle = async (habit) => {
    const res = await api.put(`/habits/${habit._id}`, {
      completedToday: !habit.completedToday,
    });
    setHabits((prev) =>
      prev.map((h) => (h._id === habit._id ? res.data : h))
    );
  };

  const handleDelete = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  if (habits.length === 0) return <p>No habits yet — add one above.</p>;

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