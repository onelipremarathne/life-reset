import JournalEntryCard from './JournalEntryCard';

function JournalEntryList({ entries, onDelete }) {
  if (entries.length === 0) return <p>No journal entries yet — write your first one above.</p>;

  return (
    <div className="journal-list">
      {entries.map((entry) => (
        <JournalEntryCard
          key={entry._id}
          entry={entry}
          onDelete={() => onDelete(entry._id)}
        />
      ))}
    </div>
  );
}

export default JournalEntryList;