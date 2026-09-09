import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    api.get('/habits')
      .then((res) => setMessage(`Connected! Found ${res.data.length} habits.`))
      .catch((err) => setMessage(`Error: ${err.message}`));
  }, []);

  return <h1>{message}</h1>;
}

export default App;