import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { getTodayString, getLast7Days, isCompletedOn, weekStats } from '../utils/dateHelpers';
import { useHabitToggle } from '../hooks/useHabitToggle';
import { calculateStreak } from '../utils/streak';
import HabitCard from '../components/HabitCard';
import CompletionRing from '../components/CompletionRing';
import WeekStrip from '../components/WeekStrip';
import DailyCard from '../components/DailyCard';
import { calculateXP, getLevelInfo } from '../utils/xp';
import XpBar from '../components/XpBar';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggle, isPending } = useHabitToggle(setHabits, setError);

  const loadData = async () => {
    try {
      const [habitsRes, journalRes] = await Promise.all([
        api.get('/habits'),
        api.get('/journal'),
      ]);
      setHabits(habitsRes.data);
      setEntries(journalRes.data);
    } catch {
      setError('Failed to load your dashboard. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error && habits.length === 0) return <p>{error}</p>;

  const today = getTodayString();
  const last7 = getLast7Days();

  const completedToday = habits.filter((h) => isCompletedOn(h, today)).length;
  const progressPct = habits.length === 0 ? 0 : Math.round((completedToday / habits.length) * 100);
  const streak = calculateStreak(habits);
  const levelInfo = getLevelInfo(calculateXP(habits, entries));

  const { completed, possible } = weekStats(habits, last7);
  const weeklyAvg = possible === 0 ? 0 : Math.round((completed / possible) * 100);

  const entriesThisWeek = entries.filter((e) => last7.includes(e.date)).length;
  const todayEntry = entries.find((e) => e.date === today) || null;

  const weekDays = last7.map((date) => {
    const dateObj = new Date(date + 'T00:00:00');
    const anyCompleted = habits.some((h) => isCompletedOn(h, date));
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
        <div className="streak-pill"><CountUp value={streak} /> Day Streak</div>
      </div>
      <XpBar {...levelInfo} />

      {error && <p className="form-error">{error}</p>}

      <div className="dashboard-grid">
        <Reveal className="today-habits" index={0}>
          <div className="card-header-row">
            <h3>Today's Habits</h3>
            <span className="card-header-meta">{completedToday} OF {habits.length} COMPLETED</span>
          </div>
          {habits.length === 0 ? (
            <p className="empty-state">No habits yet — add some on the Habits page.</p>
          ) : (
            habits.map((habit) => (
              <HabitCard key={habit._id} habit={habit} pending={isPending(habit._id)} onToggle={() => toggle(habit)} />
            ))
          )}
        </Reveal>

        <div className="dashboard-side">
          <Reveal className="metric-card" index={1}>
            <h3>Daily Completion</h3>
            <CompletionRing percent={progressPct} />
          </Reveal>

          <Reveal className="metric-card" index={2}>
            <h3>Quick Metrics</h3>
            <div className="quick-metrics-grid">
              <div className="quick-metric">
                <span className="quick-metric-label">WEEKLY AVG</span>
                <span className="quick-metric-value"><CountUp value={weeklyAvg} suffix="%" /></span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">HABITS TRACKED</span>
                <span className="quick-metric-value"><CountUp value={habits.length} /></span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">DONE TODAY</span>
                <span className="quick-metric-value"><CountUp value={completedToday} /></span>
              </div>
              <div className="quick-metric">
                <span className="quick-metric-label">ENTRIES THIS WEEK</span>
                <span className="quick-metric-value"><CountUp value={entriesThisWeek} /></span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="dashboard-grid">
        <Reveal className="today-journal-card" index={3}>
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
        </Reveal>

        <div className="dashboard-side">
          <Reveal className="metric-card" index={4}>
            <h3>Last 7 Days</h3>
            <WeekStrip days={weekDays} />
          </Reveal>

          <Reveal className="metric-card" index={5}>
            <h3>Today's Card</h3>
            <DailyCard />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;