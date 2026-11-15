function MoodChart({ days }) {
  return (
    <div className="mood-chart">
      {days.map((d, i) => (
        <div key={i} className="mood-bar-col">
          <div
            className={`mood-bar ${d.mood == null ? 'empty' : ''}`}
            style={{ height: d.mood ? `${d.mood * 10}%` : '4px' }}
          />
        </div>
      ))}
    </div>
  );
}

export default MoodChart;