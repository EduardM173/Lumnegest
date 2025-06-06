import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { seguimientoOrden } from '../../api/orders';
import { useAsync } from '../../hooks/useAsync';
import StepperEstado from '../../components/StepperEstado';

export default function SeguimientoOrden() {
  const { id } = useParams();
  const { data: orden, loading, run } = useAsync(() => seguimientoOrden(id!));

  useEffect(run, [run]);

  if (loading || !orden) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h1">Seguimiento Orden #{orden.id}</Typography>
      <StepperEstado estado={orden.estado} />
      <Typography variant="h2">Servicio: {orden.servicio.nombre}</Typography>
      <Typography>Total: Bs {orden.total.toFixed(2)}</Typography>
      <Typography sx={{ mt: 2 }}>
        Difunto: {orden.difunto.nombres} – {orden.difunto.fecha_fallecido}
      </Typography>
    </Box>
  );
}
