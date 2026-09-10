import { useState } from "react";

function getToday() {
  return new Date().toISOString().split("T")[0]; // "2026-09-10"
}

function JournalForm({ onAdd }) {
  const [date, setDate] = useState(getToday());
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(5);
  const [entry, setEntry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !entry.trim()) return;

    onAdd({ date, title, mood: Number(mood), entry });

    // reset form
    setTitle("");
    setMood(5);
    setEntry("");
    setDate(getToday());
  };

  return (
    <form onSubmit={handleSubmit} className="journal-form">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

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
      </label>

      <textarea
        placeholder="Write about your day..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows={4}
      />

      <button type="submit">Save Entry</button>
    </form>
  );
}

export default JournalForm;
