function BadgeGrid({ badges }) {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="badges-card">
      <div className="card-header-row">
        <h3>Milestones</h3>
        <span className="card-header-meta">
          {earnedCount} OF {badges.length} EARNED
        </span>
      </div>
      <div className="badge-grid">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`badge ${b.earned ? "earned" : "locked"}`}
            >
              <span className="badge-icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-desc">{b.description}</span>
              <span className="sr-only">{b.earned ? "Earned" : "Locked"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BadgeGrid;
