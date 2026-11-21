import { useEffect, useState } from "react";
import api from "../api";
import {
  getLast7Days,
  getLast14Days,
  isCompletedOn,
  startDateOf,
  weekStats,
} from "../utils/dateHelpers";
import { getHabitIcon } from "../utils/habitIcons";
import SegmentedBar from "../components/SegmentedBar";
import MoodChart from "../components/MoodChart";
import { getBadges } from "../utils/badges";
import BadgeGrid from "../components/BadgeGrid";

function Progress() {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/habits"), api.get("/journal")])
      .then(([h, j]) => {
        setHabits(h.data);
        setEntries(j.data);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        setError("Failed to load progress data. Is the backend running?");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading progress...</p>;

  const last7 = getLast7Days();
  const last14 = getLast14Days();

  const totalPossible = habits.length * 7;
  const totalCompleted = habits.reduce((sum, h) => {
    return (
      sum +
      last7.filter((date) => {
        const entry = h.completionHistory.find((c) => c.date === date);
        return entry && entry.completed;
      }).length
    );
  }, 0);

  const { completed, possible } = weekStats(habits, last7);
  const overallPct =
    totalPossible === 0
      ? 0
      : Math.round((totalCompleted / totalPossible) * 100);

  const moodDays = last14.map((date) => {
    const match = entries.find((e) => e.date === date);
    return { date, mood: match ? match.mood : null };
  });

  const badges = getBadges(habits, entries);

  return (
    <div className="progress-page">
      <h2>Progress</h2>
      <p className="page-subtitle">The last seven days, habit by habit.</p>

      <div className="progress-grid">
        <div className="this-week-card">
          <div className="card-header-row">
            <h3>This Week</h3>
            <span className="card-header-meta">{overallPct}% OVERALL</span>
          </div>

          {habits.length === 0 ? (
            <p className="empty-state">
              No habits yet — add some on the Habits page.
            </p>
          ) : (
            habits.map((habit) => {
              const start = startDateOf(habit);
              const segments = last7.map((date) => isCompletedOn(habit, date));
              const tracked = last7.filter((d) => d >= start).length;
              const count = last7.filter(
                (d) => d >= start && isCompletedOn(habit, d),
              ).length;
              const pct =
                tracked === 0 ? 0 : Math.round((count / tracked) * 100);
              const Icon = getHabitIcon(habit.icon);

              return (
                <div key={habit._id} className="progress-habit-row">
                  <div className="progress-habit-header">
                    <span className="progress-habit-label">
                      <Icon size={14} strokeWidth={2.2} />
                      {habit.name}
                    </span>
                    <span className="progress-habit-count">
                      {count}/{tracked}
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <SegmentedBar segments={segments} />
                </div>
              );
            })
          )}
        </div>
        <div className="mood-card">
          <h3>Mood, last 14 days</h3>
          <MoodChart days={moodDays} />
          <p className="mood-chart-note">
            Bars show each day's journal mood from 1 to 10. Gaps are days
            without an entry.
          </p>
        </div>
      </div>
      <BadgeGrid badges={badges} />
    </div>
  );
}

export default Progress;
