import JournalEntryCard from './JournalEntryCard';

function JournalEntryList({ entries, onOpen, onEdit, onDelete }) {
  if (entries.length === 0) return <p className="empty-state">No journal entries yet — write your first one above.</p>;

  return (
    <div className="journal-list">
      {entries.map((entry) => (
        <JournalEntryCard
          key={entry._id}
          entry={entry}
          onOpen={() => onOpen(entry)}
          onEdit={() => onEdit(entry)}
          onDelete={() => onDelete(entry._id)}
        />
      ))}
    </div>
  );
}

export default JournalEntryList;