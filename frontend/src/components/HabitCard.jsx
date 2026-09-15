import { getLast7Days } from '../utils/dateHelpers';
import CircularCheckbox from './CircularCheckbox';
import DotProgress from './DotProgress';

function HabitCard({ habit, onToggle, onDelete, onEdit }) {
  const last7 = getLast7Days();
  const filled = last7.filter((date) => {
    const entry = habit.completionHistory.find((h) => h.date === date);
    return entry && entry.completed;
  }).length;

  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
      <div className="habit-card-main">
        <CircularCheckbox checked={habit.completedToday} onChange={onToggle} />
        <span className="habit-emoji">{habit.emoji}</span>
        <span className="habit-name">{habit.name}</span>
      </div>
      <div className="habit-card-side">
        <DotProgress total={7} filled={filled} />
        {onEdit && (
          <button onClick={onEdit} className="icon-btn" aria-label="Edit habit">✎</button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="icon-btn danger" aria-label="Delete habit">🗑</button>
        )}
      </div>
    </div>
  );
}

export default HabitCard;