function SegmentedBar({ segments }) {
  return (
    <div className="segmented-bar">
      {segments.map((filled, i) => (
        <span key={i} className={`segment ${filled ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

export default SegmentedBar;