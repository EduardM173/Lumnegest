import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import '../styles/forgot-password.css';

export default function ResetPassword() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const token = search.get('token') || '';
  const email = search.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Enlace inválido');
    }
  }, [token, email]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 5) return 'Mínimo 5 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe tener mayúscula';
    if (!/[a-z]/.test(pwd)) return 'Debe tener minúscula';
    if (!/\d/.test(pwd)) return 'Debe tener número';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const pwdErr = validatePassword(password);
    if (pwdErr) return setError(pwdErr);
    if (password !== confirm) return setError('Las contraseñas no coinciden');

    try {
      await api.post('/public/reset-password', {
        email,
        token,
        newPassword: password,
      });
      setOk(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error restableciendo contraseña');
    }
  };

  return (
    <Container className="forgot-page">
      <Box className="forgot-card">
        <Typography className="forgot-title">
          {ok ? '¡Contraseña actualizada!' : 'Nuevo password'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {ok && <Alert severity="success">Redirigiendo al login…</Alert>}

        {!ok && !error.includes('inválido') && (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nueva contraseña"
              type={showPwd ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(v => !v)} edge="end">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar contraseña"
              type={showPwd ? 'text' : 'password'}
              fullWidth
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit" fullWidth>
              Cambiar contraseña
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
