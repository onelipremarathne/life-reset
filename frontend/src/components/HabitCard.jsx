function HabitCard({ habit, onToggle, onDelete }) {
  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={habit.completedToday}
          onChange={onToggle}
        />
        <span className="habit-emoji">{habit.emoji}</span>
        <span className="habit-name">{habit.name}</span>
      </label>
      <button onClick={onDelete} className="delete-btn">✕</button>
    </div>
  );
}

export default HabitCard;