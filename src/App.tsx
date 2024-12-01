import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import PracticeMode from './components/PracticeMode';

// Create a responsive theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
      dark: '#2980b9',
      light: '#74b9ff',
    },
    secondary: {
      main: '#2ecc71',
      dark: '#27ae60',
      light: '#7bed9f',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PracticeMode onExitPracticeMode={() => console.log('Exit practice mode')} />
    </ThemeProvider>
  );
}

export default App;
