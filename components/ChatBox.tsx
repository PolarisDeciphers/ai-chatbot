
import { useState } from 'react';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data.response || 'No response');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <textarea 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        rows={4} 
        placeholder="Ask your question..." 
        style={{ width: '100%', padding: '1rem' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>Submit</button>
      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{response}</div>
    </div>
  );
}
