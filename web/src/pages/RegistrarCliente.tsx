// web/src/pages/RegistrarCliente.tsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface FormState {
  nombre_usuario: string;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
}

export default function RegistrarCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    nombre_usuario: '',
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Regex: al menos una mayúscula y un dígito
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (!PASSWORD_REGEX.test(value)) {
        setPwdError('Debe tener ≥1 mayúscula y ≥1 número');
      } else {
        setPwdError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk(false);

    // validación antes de enviar
    if (!PASSWORD_REGEX.test(form.password)) {
      setPwdError('La contraseña debe tener al menos una mayúscula y un número');
      return;
    }

    try {
      await api.post('/clientes', form);
      setOk(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar cliente');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Registrar Cliente
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {ok && <Alert severity="success" sx={{ mb: 2 }}>¡Cliente creado!</Alert>}

        {[
          { name: 'nombre_usuario', label: 'Usuario *', required: true },
          { name: 'email',         label: 'Email *',    required: true },
          { 
            name: 'password',
            label: 'Contraseña *',
            type: showPassword ? 'text' : 'password',
            required: true,
            adornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
          { name: 'nombres',    label: 'Nombres *',  required: true },
          { name: 'apellidos',  label: 'Apellidos *',required: true },
          { name: 'telefono',   label: 'Teléfono',   required: false },
          { name: 'direccion',  label: 'Dirección',  required: false },
        ].map(field => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={(field as any).type || 'text'}
            value={(form as any)[field.name]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={field.required}
            error={field.name === 'password' ? Boolean(pwdError) : false}
            helperText={field.name === 'password' ? pwdError : ''}
            InputProps={{
              endAdornment: (field as any).adornment || null
            }}
          />
        ))}

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
        >
          Guardar
        </Button>
      </Box>
    </Container>
  );
}
