function DotProgress({ total = 7, filled = 0 }) {
  return (
    <div className="dot-progress">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`dot ${i < filled ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

export default DotProgress;