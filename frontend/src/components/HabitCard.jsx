import { motion } from 'motion/react';
import { getLast7Days, getTodayString, isCompletedOn } from '../utils/dateHelpers';
import CircularCheckbox from './CircularCheckbox';
import DotProgress from './DotProgress';
import { getHabitIcon } from '../utils/habitIcons';
import { Pencil, Trash2 } from 'lucide-react';

function HabitCard({ habit, onToggle, onDelete, onEdit,pending = false }) {
  const last7 = getLast7Days();
  const filled = last7.filter((date) => isCompletedOn(habit, date)).length;
  const completedToday = isCompletedOn(habit, getTodayString());

  return (
    <motion.div
    layout="position"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.25 }}
    className={`habit-card ${completedToday ? 'completed' : ''}`}
    >
      <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
        <div className="habit-card-main">
          <CircularCheckbox checked={completedToday} onChange={onToggle} disabled={pending}/>
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
    </motion.div>
  );
}

export default HabitCard;