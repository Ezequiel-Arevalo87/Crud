// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#13487a',
    },
    secondary: {
      main: '#f3973c',
    },
    error: {
      main: '#b12d0c',
    },
    background: {
      default: '#eff3f6',
    },
    text: {
      primary: '#1a1b1b',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: { fontFamily: 'Playfair Display, serif' },
    h2: { fontFamily: 'Playfair Display, serif' },
    h3: { fontFamily: 'Playfair Display, serif' },
    h4: { fontFamily: 'Playfair Display, serif' },
    h5: { fontFamily: 'Playfair Display, serif' },
    h6: { fontFamily: 'Playfair Display, serif' },
  },
});

export default theme;
