function WeekStrip({ days }) {
  return (
    <div className="week-strip">
      {days.map((d, i) => (
        <div key={i} className={`week-strip-day ${d.isToday ? 'today' : ''}`}>
          <span className="week-strip-letter">{d.label}</span>
          <span className={`week-strip-dot ${d.active ? 'active' : ''}`} />
        </div>
      ))}
    </div>
  );
}

export default WeekStrip;