import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import '../styles/register.css'

export default function AutoRegistro() {
  const navigate = useNavigate()

  // Paso: 'form' → muestra form, 'verify' → muestra input de código
  const [step, setStep] = useState<'form' | 'verify'>('form')

  // Datos de form
  const [form, setForm] = useState({
    nombre_usuario: '',
    email: '',
    password: '',
    confirm: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
  })

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const validatePassword = (pwd: string) => {
    if (pwd.length < 5) return 'Mínimo 5 caracteres'
    if (!/[A-Z]/.test(pwd)) return 'Al menos una mayúscula'
    if (!/[a-z]/.test(pwd)) return 'Al menos una minúscula'
    if (!/\d/.test(pwd)) return 'Al menos un número'
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 1) Enviar registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar password & confirm
    const pwdErr = validatePassword(form.password)
    if (pwdErr) {
      setError(pwdErr)
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await api.post('/public/register', {
        nombre_usuario: form.nombre_usuario,
        email: form.email,
        password: form.password,
        nombres: form.nombres,
        apellidos: form.apellidos,
        telefono: form.telefono,
        direccion: form.direccion,
      })
      setStep('verify')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error registrando')
    }
  }

  // 2) Verificar código
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/public/verify', {
        email: form.email,
        code,
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Código inválido')
    }
  }

  // Validación en tiempo real
  const pwdError = validatePassword(form.password)
  const confirmError =
    form.confirm && form.confirm !== form.password ? 'No coincide' : ''

  return (
    <Container className="register-page">
      <Box className="register-card">
        <Typography className="register-title">
          Regístrate
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 'form' ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {[
              { name: 'nombre_usuario', label: 'Usuario *' },
              { name: 'email', label: 'Correo *', type: 'email' },
              {
                name: 'password',
                label: 'Contraseña *',
                type: showPwd ? 'text' : 'password',
                error: !!pwdError,
                helperText: pwdError,
              },
              {
                name: 'confirm',
                label: 'Confirmar *',
                type: showPwd ? 'text' : 'password',
                error: !!confirmError,
                helperText: confirmError,
              },
              { name: 'nombres', label: 'Nombres *' },
              { name: 'apellidos', label: 'Apellidos *' },
              { name: 'telefono', label: 'Teléfono' },
              { name: 'direccion', label: 'Dirección' },
            ].map((f) => (
              <TextField
                key={f.name}
                name={f.name}
                label={f.label}
                type={(f as any).type || 'text'}
                value={(form as any)[f.name]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={f.label.endsWith('*')}
                error={!!(f as any).error}
                helperText={(f as any).helperText}
                InputProps={
                  f.name === 'password' || f.name === 'confirm'
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPwd((v) => !v)}
                              edge="end"
                            >
                              {showPwd ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
              />
            ))}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Enviar código
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerify} noValidate>
            <Typography sx={{ mb: 1 }}>
              Revisa tu correo ({form.email}) e ingresa el código
            </Typography>
            <TextField
              label="Código *"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Verificar cuenta
            </Button>
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </Typography>
      </Box>
    </Container>
  )
}
