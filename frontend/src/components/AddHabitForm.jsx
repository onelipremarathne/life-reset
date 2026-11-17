import { useState } from 'react';
import { HABIT_ICON_KEYS, HABIT_ICONS } from '../utils/habitIcons';

function AddHabitForm({mode = 'add', initialName = '', initialIcon = 'Footprints', onSubmit, onCancel}) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const isEdit = mode === 'edit';


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), icon);
    if (!isEdit) {
      setName('');
      setIcon('Footprints');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-habit-form">
      <h3 className="form-title">
        {isEdit ? 'Edit habit' : <>New <span className="brand-accent">habit</span></>}
      </h3>
      <p className="form-subtitle">
        {isEdit ? 'Update the name or icon.' : 'Keep it small enough to do on a bad day.'}
      </p>
        
      <label className="form-label">Name</label>
      <input
        type="text"
        placeholder="Morning run"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="form-label">Icon</label>
      <div className="icon-grid">
        {HABIT_ICON_KEYS.map((key) => {
          const Icon = HABIT_ICONS[key];
          return (
            <button
              type="button"
              key={key}
              className={`icon-option ${icon === key ? 'selected' : ''}`}
              onClick={() => setIcon(key)}
              aria-label={key}
              aria-pressed={icon === key}
            >
              <Icon size={16} strokeWidth={2.2} />
            </button>
          );
        })}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-habit-btn">
          {isEdit ? 'Save changes' : '+ Add habit'}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        )}
      </div>
    </form>
  );
}

export default AddHabitForm;