import { styled } from '@mui/material';

// Paleta de colores (ajusta según el mockup)
export const COLORS = {
  primary: '#3A4A58',   // Color principal: fondo, textos destacados
  brown: '#6C4F4B',     // Títulos
  gold: '#B59F6B',      // Detalles dorados
  light: '#CED2D4',     // Fondo claro de secciones
  paper: '#F2EFEA',     // Fondo general (blanco roto)
};

// Estilos para cada sección
export const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: COLORS.paper,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 1),
  },
}));

export const Title = styled('h2')({
  fontFamily: `'Playfair Display', serif`,
  fontWeight: 700,
  color: COLORS.brown,
  marginBottom: '0.5rem',
});

export const SubTitle = styled('h3')({
  fontFamily: `'Merriweather', serif`,
  fontWeight: 600,
  color: COLORS.primary,
  margin: '1rem 0 0.5rem',
});

export const Paragraph = styled('p')({
  fontFamily: `'Source Sans Pro', sans-serif`,
  fontSize: '1rem',
  lineHeight: 1.6,
  color: COLORS.primary,
});
