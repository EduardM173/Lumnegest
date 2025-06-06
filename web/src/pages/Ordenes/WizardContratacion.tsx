// web/src/pages/Ordenes/WizardContratacion.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServicios, Servicio } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

export default function WizardContratacion() {
  const { id } = useParams<{ id: string }>();
  // 1) Cargar el servicio al montar (solo una vez)
  const { data: servicios = [], run: loadServicios } = useAsync(getServicios);
  const [servicio, setServicio] = useState<Servicio | null>(null);

  // 2) Traer el servicio específico al inicio
  useEffect(() => {
    loadServicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- vacía: no dependencias

  // 3) Cuando lleguen los servicios, buscar el nuestro
  useEffect(() => {
    if (id && servicios.length) {
      const found = servicios.find((s) => s.id === id);
      if (found) setServicio(found);
    }
  }, [id, servicios]);

  // 4) paso del wizard
  const [step, setStep] = useState(0);

  if (!servicio) return <Typography>Cargando servicio…</Typography>;

  // Asegurarnos que precio_base es número
  const precioNum =
    typeof servicio.precio_base === 'string'
      ? parseFloat(servicio.precio_base)
      : servicio.precio_base;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        Contratar: {servicio.nombre}
      </Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {['Detalles', 'Revisión', 'Pago'].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Nombre del difunto"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fecha de fallecimiento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => setStep(1)}>
            Siguiente
          </Button>
        </Box>
      )}

      {step === 1 && (
        <Box>
          <Typography>Servicio: {servicio.nombre}</Typography>
          <Typography>Precio base: Bs {precioNum.toFixed(2)}</Typography>
          <Button sx={{ mt: 2, mr: 1 }} onClick={() => setStep(0)}>
            Atrás
          </Button>
          <Button variant="contained" onClick={() => setStep(2)}>
            Siguiente
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography>Escoge método de pago</Typography>
          <Button sx={{ mt: 2, mr: 1 }} onClick={() => setStep(1)}>
            Atrás
          </Button>
          <Button variant="contained">Confirmar y pagar</Button>
        </Box>
      )}
    </Box>
  );
}
