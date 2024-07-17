// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Couleur principale
    },
    secondary: {
      main: '#f50057', // Couleur secondaire
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Pour désactiver la capitalisation automatique
        },
      },
    },
  },
});

export default theme;
