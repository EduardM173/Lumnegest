// web/src/components/StepperEstado.tsx
import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { Estado } from '../api/orders';

const pasos: Estado[] = ['PENDIENTE', 'PROCESO', 'FINALIZADO'];

export default function StepperEstado({ estado }: { estado: Estado }) {
  const active = pasos.indexOf(estado);
  return (
    <Stepper activeStep={active} alternativeLabel sx={{ my: 2 }}>
      {pasos.map((p) => (
        <Step key={p}>
          <StepLabel>{p}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
