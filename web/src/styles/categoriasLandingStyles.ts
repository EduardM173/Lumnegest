// web/src/styles/categoriasLandingStyles.ts

import { SxProps, Theme } from '@mui/material';

/* ─── GRID CONTENEDOR ─── */
export const gridContainer: SxProps<Theme> = {
  mt: 4,
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: 'repeat(2, 1fr)',
    sm: 'repeat(3, 1fr)',
    md: 'repeat(4, 1fr)',
  },
};

/* ─── TARJETA ─── */
export const cardRoot: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
};

/* ActionArea ocupa toda la tarjeta (imagen + contenido) */
export const actionArea: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  textAlign: 'center',
};

/* ─── Contenedor relativo para la imagen ─── */
export const mediaContainer: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
};

/* ─── Estilos para la imagen (CardMedia) ─── */
export const media: SxProps<Theme> = {
  height: 140,
  objectFit: 'cover',
  width: '100%',
};

/* ─── Botón de edición (ícono de lápiz) ─── */
export const editIcon: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
};

/* ─── Contenido centrado (nombre de categoría) ─── */
export const contentBox: SxProps<Theme> = {
  flexGrow: 1,
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/* ─── Título (nombre de categoría) ─── */
export const title: SxProps<Theme> = {
  fontFamily: `'Merriweather', serif`,
  fontWeight: 600,
  fontSize: {
    xs: '1.1rem',
    sm: '1.2rem',
    md: '1.3rem',
  },
  px: 1,
  textTransform: 'capitalize',
};
