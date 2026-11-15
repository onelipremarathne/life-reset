import { useState } from "react";
import DotProgress from './DotProgress';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function JournalForm({ mode = 'add', initialEntry, onSubmit, onCancel }) {
  const isEdit = mode === 'edit';
  const [date, setDate] = useState(initialEntry?.date || getToday());
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [mood, setMood] = useState(initialEntry?.mood || 5);
  const [entry, setEntry] = useState(initialEntry?.entry || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !entry.trim()) return;

    onSubmit({ date, title, mood: Number(mood), entry });

    if (!isEdit) {
      setTitle('');
      setMood(5);
      setEntry('');
      setDate(getToday());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="journal-form">
      <h3 className="form-title">
        {isEdit ? 'Edit entry' : <>New <span className="brand-accent">entry</span></>}
      </h3>

      <label className="form-label">Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label className="form-label">Title</label>
      <input
        type="text"
        placeholder="Title (e.g. Good day)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="mood-label">
        Mood: {mood}/10
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <DotProgress total={10} filled={Number(mood)} />
      </label>

      <label className="form-label">Entry</label>
      <textarea
        placeholder="Write about your day..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows={4}
      />

      <div className="form-actions">
        <button type="submit" className="submit-habit-btn">
          {isEdit ? 'Save changes' : '+ New entry'}
        </button>
        {isEdit && <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>}
      </div>
    </form>
  );
}

export default JournalForm;