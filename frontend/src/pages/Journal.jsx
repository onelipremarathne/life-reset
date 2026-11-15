import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import JournalForm from '../components/JournalForm';
import JournalEntryList from '../components/JournalEntryList';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const res = await api.get('/journal');
      setEntries(res.data);
    } catch (err) {
      setError('Failed to load journal entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handles being linked here from Dashboard's edit/write entry button
  useEffect(() => {
    const state = location.state;
    if (!state) return;

    if (state.editEntryId && entries.length > 0) {
      const match = entries.find((e) => e._id === state.editEntryId);
      if (match) {
        setEditingEntry(match);
        setShowForm(true);
      }
      navigate(location.pathname, { replace: true }); // clear state so refresh doesn't reopen it
    } else if (state.openNew) {
      setEditingEntry(null);
      setShowForm(true);
      navigate(location.pathname, { replace: true });
    }
  }, [entries, location.state, location.pathname, navigate]);

  const handleAdd = async (data) => {
    const res = await api.post('/journal', data);
    setEntries((prev) => [res.data, ...prev]);
    setShowForm(false);
  };

  const handleSaveEdit = async (data) => {
    const res = await api.put(`/journal/${editingEntry._id}`, data);
    setEntries((prev) => prev.map((e) => (e._id === res.data._id ? res.data : e)));
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await api.delete(`/journal/${id}`);
    setEntries((prev) => prev.filter((e) => e._id !== id));
    if (editingEntry?._id === id) { setEditingEntry(null); setShowForm(false); }
  };

  const openNew = () => { setEditingEntry(null); setShowForm(true); };
  const openEdit = (entry) => { setEditingEntry(entry); setShowForm(true); };
  const closeForm = () => { setEditingEntry(null); setShowForm(false); };

  if (loading) return <p>Loading journal...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="journal-page">
      <div className="journal-header-row">
        <div>
          <h2>Journal</h2>
          <p className="page-subtitle">How the days actually felt.</p>
        </div>
        {!showForm && <button onClick={openNew} className="new-entry-btn">+ New entry</button>}
      </div>

      {showForm && (
        <JournalForm
          key={editingEntry?._id || 'new'}
          mode={editingEntry ? 'edit' : 'add'}
          initialEntry={editingEntry}
          onSubmit={editingEntry ? handleSaveEdit : handleAdd}
          onCancel={closeForm}
        />
      )}

      <JournalEntryList entries={entries} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}

export default Journal;