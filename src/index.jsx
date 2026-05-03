import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MobileApp from './components/MobileApp';

function Root() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile ? <MobileApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
