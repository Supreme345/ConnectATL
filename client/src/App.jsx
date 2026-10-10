
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Connecting to backend...');

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.text();
      })
      .then(setMessage)
      .catch(() => setMessage('Backend connection failed'));
  }, []);

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>ConnectATL</h1>
      <p>Atlanta Broadband Benefit Navigator</p>
      <p>Backend status: {message}</p>
    </main>
  );
}

export default App;

