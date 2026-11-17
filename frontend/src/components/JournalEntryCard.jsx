import { Pencil, Trash2 } from "lucide-react";

function JournalEntryCard({ entry, onEdit, onDelete }) {
  return (
    <div className="journal-card">
      <div className="journal-card-header">
        <span className="journal-date">{entry.date}</span>
        <span className="journal-mood">Mood: {entry.mood}/10</span>
        <div className="journal-card-actions">
          <button onClick={onEdit} className="icon-btn" aria-label="Edit entry">
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="icon-btn danger"
            aria-label="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.entry}</p>
    </div>
  );
}

export default JournalEntryCard;
