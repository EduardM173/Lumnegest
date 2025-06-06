import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../api/axiosInstance';
import '../styles/forgot-password.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'sent'>('request');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/public/forgot-password', { email });
      setStep('sent');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al solicitar código');
    }
  };

  return (
    <Container className="forgot-page">
      <Box className="forgot-card">
        <Typography className="forgot-title">
          {step === 'request'
            ? 'Recuperar contraseña'
            : 'Código enviado'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 'request' ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              type="email"
              label="Tu correo electrónico"
              fullWidth
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit" fullWidth>
              Enviar código
            </Button>
          </Box>
        ) : (
          <Alert severity="success">
            Te hemos enviado un correo con un enlace para restablecer
            tu contraseña. Revisa tu bandeja y sigue las instrucciones.
          </Alert>
        )}
      </Box>
    </Container>
  );
}
