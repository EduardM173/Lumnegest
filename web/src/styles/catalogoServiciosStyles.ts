//web/src/styles/catalogoServiciosStyles.ts
import { SxProps, Theme } from '@mui/material';

/* ----------- GRID CONTENEDOR ----------------------------------------- */
export const gridContainer: SxProps<Theme> = {
  mt:   4,
  display: 'grid',
  gap:      2,                                // <— MÁS JUNTO (theme.spacing(2) = 16 px)
  gridTemplateColumns: {
    xs: '1fr',                // 1 col    ≤ 600 px
    sm: 'repeat(2, 1fr)',     // 2 col   600-899
    md: 'repeat(3, 1fr)',     // 3 col   ≥ 900
  },
};

/* ----------- TARJETA -------------------------------------------------- */
export const cardRoot: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

/* ----------- CONTENIDO que puede crecer ------------------------------ */
export const cardContent: SxProps<Theme> = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

/* ----------- TÍTULO — tamaño fluido ---------------------------------- */
export const cardHeader: SxProps<Theme> = {
  fontFamily: `'Playfair Display', serif`,
  fontWeight: 700,
  lineHeight: 1.2,
  mb: .5,
  fontSize: {
    xs: '1.4rem',
    sm: '1.6rem',
    md: '1.8rem',
  },
};

/* ----------- DESCRIPCIÓN máx 3 líneas -------------------------------- */
export const cardDescription: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  mb: 1,
};

/* ----------- STACK de botones ---------------------------------------- */
export const actionStack: SxProps<Theme> = { p: 2 };
