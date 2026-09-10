import { useState } from 'react';

function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✅');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, emoji);
    setName('');
    setEmoji('✅');
  };

  return (
    <form onSubmit={handleSubmit} className="add-habit-form">
      <input
        type="text"
        placeholder="Emoji"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        maxLength={2}
        className="emoji-input"
      />
      <input
        type="text"
        placeholder="New habit (e.g. Workout)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default AddHabitForm;