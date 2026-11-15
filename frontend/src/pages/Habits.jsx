import { useEffect, useState } from "react";
import api from "../api";
import HabitList from "../components/HabitList";
import AddHabitForm from "../components/AddHabitForm";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits");
      setHabits(res.data);
    } catch (err) {
      setError("Failed to load habits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAdd = async (name, icon) => {
    const res = await api.post('/habits', { name, icon });
    setHabits((prev) => [...prev, res.data]);
  };

  const handleSaveEdit = async (name, icon) => {
    const res = await api.put(`/habits/${editingHabit._id}`, { name, icon });
    setHabits((prev) => prev.map((h) => (h._id === res.data._id ? res.data : h)));
    setEditingHabit(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
    if (editingHabit?._id === id) setEditingHabit(null);
  };

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="habits-page">
      <h2>Habits</h2>
      <p className="page-subtitle">The small things you're keeping consistent.</p>

      <div className="habits-grid">
        <AddHabitForm
          key={editingHabit?._id || 'new'}
          mode={editingHabit ? 'edit' : 'add'}
          initialName={editingHabit?.name}
          initialIcon={editingHabit?.icon}
          onSubmit={editingHabit ? handleSaveEdit : handleAdd}
          onCancel={() => setEditingHabit(null)}
        />

        <div className="habit-list-card">
          <div className="habit-list-header">
            <h3>Your list</h3>
            <span>{habits.length} tracked</span>
          </div>
          <HabitList
            habits={habits}
            setHabits={setHabits}
            onEdit={setEditingHabit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Habits;