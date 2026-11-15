import { getLast7Days } from '../utils/dateHelpers';
import CircularCheckbox from './CircularCheckbox';
import DotProgress from './DotProgress';
import { getHabitIcon } from '../utils/habitIcons';
import { Pencil, Trash2 } from 'lucide-react';

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
        <span className="habit-icon-badge">
          {(() => {
            const Icon = getHabitIcon(habit.icon);
            return <Icon size={14} strokeWidth={2.2} />;
           })()}
        </span>
        <span className="habit-name">{habit.name}</span>
      </div>
      <div className="habit-card-side">
        <DotProgress total={7} filled={filled} />
        {onEdit && (
           <button onClick={onEdit} className="icon-btn" aria-label="Edit habit"><Pencil size={14} /></button>
        )}
        {onDelete && (
           <button onClick={onDelete} className="icon-btn danger" aria-label="Delete habit"><Trash2 size={14} /></button>
        )}
      </div>
    </div>
  );
}

export default HabitCard;