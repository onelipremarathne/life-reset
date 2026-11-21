import { Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";

function JournalEntryCard({ entry, onOpen, onEdit, onDelete }) {
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      whileHover={{ y: -2 }}
      className="journal-card clickable"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="journal-card-header">
        <span className="journal-date">{entry.date}</span>
        <span className="journal-mood">Mood: {entry.mood}/10</span>
        <div className="journal-card-actions">
          <button
            onClick={stop(onEdit)}
            className="icon-btn"
            aria-label="Edit entry"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={stop(onDelete)}
            className="icon-btn danger"
            aria-label="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.entry}</p>
    </motion.div>
  );
}

export default JournalEntryCard;
