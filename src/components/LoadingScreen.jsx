import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#2a2a2a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999,
    }}>
      <span style={{
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '1.4rem',
        letterSpacing: '0.05em',
        width: '10ch',
      }}>
        {'Loading' + '.'.repeat(dots)}
      </span>
    </div>
  );
}
