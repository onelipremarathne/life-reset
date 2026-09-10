function JournalEntryCard({ entry, onDelete }) {
  return (
    <div className="journal-card">
      <div className="journal-card-header">
        <span className="journal-date">{entry.date}</span>
        <span className="journal-mood">Mood: {entry.mood}/10</span>
        <button onClick={onDelete} className="delete-btn">✕</button>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.entry}</p>
    </div>
  );
}

export default JournalEntryCard;