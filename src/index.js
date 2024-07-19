import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import AppMenu from './components/AppMenu'; // Assurez-vous que AppMenu est bien votre composant principal ou remplacez-le par App si nécessaire
import './index.css';

// Définir le thème MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#00a0dc', // Couleur principale
    },
    secondary: {
      main: '#bdbdbd', // Couleur secondaire
    },
    background: {
      default: '#f5f5f5', // Couleur de fond par défaut
      paper: '#ffffff',   // Couleur de fond pour les composants en papier
    },
    text: {
      primary: '#333333', // Couleur du texte principal
      secondary: '#666666', // Couleur du texte secondaire
    },
    action: {
      hover: '#e0e0e0', // Couleur de survol des actions
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    body1: {
      fontSize: '1rem',
      color: '#666',
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalise les styles CSS pour l'application */}
      <AppMenu /> {/* Remplacez AppMenu par App si nécessaire */}
    </ThemeProvider>
  </BrowserRouter>
);
