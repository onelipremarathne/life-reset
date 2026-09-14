import { useEffect, useState } from 'react';
import api from '../api';
import { getLast7Days } from '../utils/dateHelpers';

function Progress() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/habits').then((res) => {
      setHabits(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading progress...</p>;

  const last7Days = getLast7Days();

  return (
    <div className="progress-page">
      <h2>This Week</h2>
      {habits.length === 0 ? (
        <p>No habits yet — add some on the Habits page.</p>
      ) : (
        habits.map((habit) => {
          const completedCount = last7Days.filter((date) => {
            const entry = habit.completionHistory.find((h) => h.date === date);
            return entry && entry.completed;
          }).length;

          const pct = Math.round((completedCount / 7) * 100);

          return (
            <div key={habit._id} className="progress-row">
              <span className="progress-label">{habit.emoji} {habit.name}</span>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="progress-count">{completedCount}/7 days</span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Progress;