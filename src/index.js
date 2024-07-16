import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Assurez-vous que le chemin correspond à la localisation exacte de App.js

// Cibler l'élément DOM avec l'ID 'root'
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
