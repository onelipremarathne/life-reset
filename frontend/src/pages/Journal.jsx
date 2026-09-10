import { useEffect, useState } from 'react';
import api from '../api';
import JournalForm from '../components/JournalForm';
import JournalEntryList from '../components/JournalEntryList';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAdd = async (entryData) => {
    const res = await api.post('/journal', entryData);
    setEntries((prev) => [res.data, ...prev]); // newest first, matches backend sort
  };

  const handleDelete = async (id) => {
    await api.delete(`/journal/${id}`);
    setEntries((prev) => prev.filter((e) => e._id !== id));
  };

  if (loading) return <p>Loading journal...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="journal-page">
      <h2>Journal</h2>
      <JournalForm onAdd={handleAdd} />
      <JournalEntryList entries={entries} onDelete={handleDelete} />
    </div>
  );
}

export default Journal;