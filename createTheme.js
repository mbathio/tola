import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Button from '@mui/material/Button';

// Thème clair
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Thème sombre
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const ThemeSwitcher = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
      {children}
    </ThemeProvider>
  );
};

export default ThemeSwitcher;
