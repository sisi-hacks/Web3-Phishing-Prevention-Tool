import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  async function verifyUrl() {
    try {
      const response = await fetch(`/verify?url=${encodeURIComponent(url)}&chainId=ethereum`);
      const data = await response.json();
      setResult(data.message || data.error);
    } catch (error) {
      setResult('Error verifying URL.');
    }
  }

  async function reportUrl() {
    try {
      const response = await fetch('/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, user: 'user123' }),
      });
      const data = await response.json();
      setResult(data.message || data.error);
    } catch (error) {
      setResult('Error reporting URL.');
    }
  }

  return (
    <div>
      <h1>Web3 URL Verifier</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={verifyUrl}>Verify URL</button>
      <button onClick={reportUrl}>Report URL</button>
      <p>{result}</p>
    </div>
  );
}

export default App;