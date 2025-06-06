// src/pages/Login.tsx
import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/login.css';

export default function Login() {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  if (!auth) return <div>Contexto no disponible</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', {
        login: loginField,
        password,
      });
      auth.login(data.usuario, data.token);

      // Redirige al path guardado o al home
      const redirect = localStorage.getItem('afterLogin');
      if (redirect) {
        localStorage.removeItem('afterLogin');
        navigate(redirect);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="sm">
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#6C4F4B',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="login-card" noValidate>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email / Usuario"
            fullWidth
            required
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Contraseña"
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" fullWidth disableElevation>
            Entrar
          </Button>

          <Box mt={2} display="flex" justifyContent="space-between" className="login-footer">
            <MuiLink component={RouterLink} to="/forgot-password" underline="hover">
              Olvidé mi contraseña
            </MuiLink>
            <MuiLink component={RouterLink} to="/autoregistro" underline="hover">
              Registrarse
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
