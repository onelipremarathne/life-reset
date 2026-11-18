import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { getTodayString, getLast7Days } from '../utils/dateHelpers';
import { calculateStreak } from '../utils/streak';
import HabitCard from '../components/HabitCard';
import CompletionRing from '../components/CompletionRing';
import WeekStrip from '../components/WeekStrip';
import DailyCard from '../components/DailyCard';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [habitsRes, journalRes] = await Promise.all([
        api.get('/habits'),
        api.get('/journal'),
      ]);
      setHabits(habitsRes.data);
      setEntries(journalRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggle = async (habit) => {
    const res = await api.put(`/habits/${habit._id}`, { completedToday: !habit.completedToday });
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data : h)));
  };

  if (loading) return <p>Loading dashboard...</p>;

  const today = getTodayString();
  const last7 = getLast7Days();

  const completedToday = habits.filter((h) => h.completedToday).length;
  const progressPct = habits.length === 0 ? 0 : Math.round((completedToday / habits.length) * 100);
  const streak = calculateStreak(habits);

  const totalPossible = habits.length * 7;
  const totalCompleted = habits.reduce((sum, h) => {
    return sum + last7.filter((date) => {
      const entry = h.completionHistory.find((c) => c.date === date);
      return entry && entry.completed;
    }).length;
  }, 0);
  const weeklyAvg = totalPossible === 0 ? 0 : Math.round((totalCompleted / totalPossible) * 100);

  const entriesThisWeek = entries.filter((e) => last7.includes(e.date)).length;
  const todayEntry = entries.find((e) => e.date === today) || null;

  const weekDays = last7.map((date) => {
    const dateObj = new Date(date + 'T00:00:00');
    const anyCompleted = habits.some((h) => {
      const entry = h.completionHistory.find((c) => c.date === date);
      return entry && entry.completed;
    });
    return {
      label: dateObj.toLocaleDateString('en-US', { weekday: 'narrow' }),
      active: anyCompleted,
      isToday: date === today,
    };
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
          </p>
          <h1>Life Reset <span className="brand-accent">Dashboard</span></h1>
        </div>
        <div className="streak-pill">{streak} Day Streak</div>
      </div>

      <div className="dashboard-grid">
        <div className="today-habits">
          <div className="card-header-row">
            <h3>Today's Habits</h3>
            <span className="card-header-meta">{completedToday} OF {habits.length} COMPLETED</span>
          </div>
          {habits.length === 0 ? (
            <p className="empty-state">No habits yet — add some on the Habits page.</p>
          ) : (
            habits.map((habit) => (
              <HabitCard key={habit._id} habit={habit} onToggle={() => handleToggle(habit)} />
            ))
          )}
        </div>

        <div className="dashboard-side">
          <div className="metric-card">
            <h3>Daily Completion</h3>
            <CompletionRing percent={progressPct} />
          </div>

          <div className="metric-card">
            <h3>Quick Metrics</h3>
            <div className="quick-metrics-grid">
              <div className="quick-metric">
                <span className="quick-metric-label">WEEKLY AVG</span>
                <span className="quick-metric-value">{weeklyAvg}%</span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">HABITS TRACKED</span>
                <span className="quick-metric-value">{habits.length}</span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">DONE TODAY</span>
                <span className="quick-metric-value">{completedToday}</span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">ENTRIES THIS WEEK</span>
                <span className="quick-metric-value">{entriesThisWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="today-journal-card">
          <div className="card-header-row">
            <h3>Daily Reflection</h3>
            <Link to="/journal" state={todayEntry ? { editEntryId: todayEntry._id } : { openNew: true }}>
              <button className="edit-entry-btn">{todayEntry ? 'EDIT ENTRY' : 'WRITE ENTRY'}</button>
            </Link>
          </div>
          {todayEntry ? (
            <div className="reflection-preview">
              <h4>{todayEntry.title}</h4>
              <p>{todayEntry.entry}</p>
              <span className="reflection-mood">MOOD {todayEntry.mood}/10</span>
            </div>
          ) : (
            <p className="empty-state">No entry yet today.</p>
          )}
        </div>

        <div className="dashboard-side">
          <div className="metric-card">
            <h3>Last 7 Days</h3>
            <WeekStrip days={weekDays} />
          </div>

          <div className="metric-card">
            <h3>Today's Card</h3>
            <DailyCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;