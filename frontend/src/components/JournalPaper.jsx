import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getTodayString } from "../utils/dateHelpers";

function JournalPaper({ mode = "add", initialEntry, onSubmit, onCancel }) {
  const isEdit = mode === "edit";
  const [date, setDate] = useState(initialEntry?.date || getTodayString());
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [mood, setMood] = useState(initialEntry?.mood || 5);
  const [entry, setEntry] = useState(initialEntry?.entry || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = title.trim() && entry.trim() && !saving;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      await onSubmit({ date, title: title.trim(), mood, entry });
      // parent closes the paper on success
    } catch {
      setError("Couldn't save that. Is the backend running?");
      setSaving(false);
    }
  };

  const ENTRY_LIMIT = 5000;

  return (
    <div className="reader-overlay">
      <form className="paper-sheet" onSubmit={handleSubmit}>
        <button
          type="button"
          className="paper-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="paper-top">
          <label className="paper-label" htmlFor="paper-date">
            {isEdit ? "EDITING ENTRY" : "NEW ENTRY"}
          </label>
          <input
            id="paper-date"
            type="date"
            className="paper-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <input
          type="text"
          className="paper-title"
          placeholder="Title (e.g. Good day)"
          aria-label="Title"
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="paper-mood">
          <span className="paper-label">MOOD {mood}/10</span>
          <div className="paper-mood-dots" role="radiogroup" aria-label="Mood">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={mood === n}
                aria-label={`Mood ${n}`}
                className={`paper-dot ${n <= mood ? "on" : ""}`}
                onClick={() => setMood(n)}
              />
            ))}
          </div>
        </div>

        <textarea
          className="paper-lines"
          placeholder="Write about your day…"
          aria-label="Entry"
          maxLength={ENTRY_LIMIT}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          autoFocus={!isEdit}
        />

        {error && <p className="paper-error">{error}</p>}

        <div className="paper-actions">
          <span className={`paper-count ${entry.length > ENTRY_LIMIT * 0.9 ? "near" : ""}`}>
              {entry.length}/{ENTRY_LIMIT}
          </span>
          <button type="button" className="paper-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="paper-save" disabled={!canSave}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Save entry"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default JournalPaper;
