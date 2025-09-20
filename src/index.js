import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // ✅ explicitly point to App.jsx

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Setup IndexedDB for offline storage
const initDB = () => {
  const request = indexedDB.open('EduGameHub', 1);

  request.onerror = () => {
    console.log('IndexedDB error');
  };

  request.onsuccess = () => {
    console.log('IndexedDB initialized');
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object stores
    if (!db.objectStoreNames.contains('gameData')) {
      const gameStore = db.createObjectStore('gameData', { keyPath: 'id', autoIncrement: true });
      gameStore.createIndex('subject', 'subject', { unique: false });
      gameStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    if (!db.objectStoreNames.contains('userProgress')) {
      db.createObjectStore('userProgress', { keyPath: 'subject' });
    }

    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
    }
  };
};

// Initialize IndexedDB
initDB();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
