import { useEffect, useState } from "react";
import api from "../api";
import HabitList from "../components/HabitList";
import AddHabitForm from "../components/AddHabitForm";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="habits-page">
      <h2>Habits</h2>
      <AddHabitForm onAdd={handleAdd} />
      <HabitList habits={habits} setHabits={setHabits} />
    </div>
  );
}

export default Habits;