import { createTheme } from '@mui/material/styles';

// Paleta de la imagen
const palette = {
  primary:  { main: '#6C4F4B' },   // marrón
  secondary:{ main: '#B59F6B' },   // dorado
  info:     { main: '#CED2D4' },   // gris claro
  background:{ default: '#F2EFEA' },
  text:     { primary: '#3A4A58' } // azul grisáceo
};

// Tipografías de @fontsource
import '@fontsource/playfair-display/700.css'; // títulos
import '@fontsource/merriweather/600.css';     // subtítulos
import '@fontsource/source-sans-pro/400.css';  // texto

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: `'Source Sans Pro', sans-serif`,
    h1: { fontFamily: `'Playfair Display', serif`, fontWeight: 700 },
    h2: { fontFamily: `'Merriweather', serif`, fontWeight: 600 },
  },
});
