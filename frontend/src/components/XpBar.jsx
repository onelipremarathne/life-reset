function XpBar({ level, xpIntoLevel, xpForNext, pct }) {
  return (
    <div className="xp-bar">
      <div className="xp-bar-top">
        <span className="xp-level">
          Level <span className="brand-accent">{level}</span>
        </span>
        <span className="xp-count">
          {xpIntoLevel} / {xpForNext} XP
        </span>
      </div>
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-label={`Level ${level} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default XpBar;
