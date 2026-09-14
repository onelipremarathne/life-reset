import { useEffect, useState } from 'react';
import api from '../api';
import { getTodayString } from '../utils/dateHelpers';
import { calculateStreak } from '../utils/streak';
import HabitCard from '../components/HabitCard';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [habitsRes, journalRes] = await Promise.all([
        api.get('/habits'),
        api.get('/journal'),
      ]);
      setHabits(habitsRes.data);

      const today = getTodayString();
      const match = journalRes.data.find((e) => e.date === today);
      setTodayEntry(match || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (habit) => {
    const res = await api.put(`/habits/${habit._id}`, {
      completedToday: !habit.completedToday,
    });
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data : h)));
  };

  if (loading) return <p>Loading dashboard...</p>;

  const completedCount = habits.filter((h) => h.completedToday).length;
  const progressPct = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);
  const streak = calculateStreak(habits);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>LIFE RESET</h1>
        <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div className="progress-section">
        <p>Today's Progress</p>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span>{progressPct}%</span>
      </div>

      <div className="streak-section">
        🔥 {streak} Day Streak
      </div>

      <div className="dashboard-grid">
        <div className="today-habits">
          <h3>Today</h3>
          {habits.length === 0 ? (
            <p>No habits yet — add some on the Habits page.</p>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={() => handleToggle(habit)}
                onDelete={() => {}} // no delete from dashboard, pass no-op
              />
            ))
          )}
        </div>

        <div className="today-journal">
          <h3>Today's Journal</h3>
          {todayEntry ? (
            <>
              <p className="journal-preview">"{todayEntry.entry.slice(0, 100)}{todayEntry.entry.length > 100 ? '...' : ''}"</p>
            </>
          ) : (
            <p>No entry yet today.</p>
          )}
          <a href="/journal"><button>Write Entry</button></a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;