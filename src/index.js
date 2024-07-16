import React from 'react';
import ReactDOM from 'react-dom'; // Utilisez correctement ReactDOM
import App from './App.js'; // Assurez-vous d'inclure l'extension '.js'

// Cibler l'élément DOM avec l'ID 'root'
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  console.error('Failed to find the root element');
}
