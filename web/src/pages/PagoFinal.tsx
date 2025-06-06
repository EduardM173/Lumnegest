// web/src/pages/PagoFinal.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Avatar,
} from '@mui/material';
import { CreditCard, AccountBalance, AttachMoney, AccountBalanceWallet } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/pagoFinal.css';

interface ServicioResumen {
  id: number;
  nombre: string;
  precio_base: number;
  cantidad: number;
  subtotal: number;
  imagenUrl: string | null;
}

interface DetalleOrden {
  id: number | string;
  estado: string;
  total: number;
  cliente: { id: number | string; nombres: string; email: string };
  servicios: ServicioResumen[];
}

const METODOS = ['Tarjeta', 'Transferencia', 'Efectivo', 'Billetera'] as const;
type MetodoTipo = (typeof METODOS)[number];

export default function PagoFinal() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const nav = useNavigate();
  const authCtx = useContext(AuthContext);

  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [mensajePago, setMensajePago] = useState<string | null>(null);

  const [metodo, setMetodo] = useState<MetodoTipo>('Tarjeta');

  // Campos tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Errores
  const [errorCardNumber, setErrorCardNumber] = useState<string | null>(null);
  const [errorExpiry, setErrorExpiry] = useState<string | null>(null);
  const [errorCvc, setErrorCvc] = useState<string | null>(null);
  const [errorCardHolder, setErrorCardHolder] = useState<string | null>(null);

  const detectCardType = (num: string) => {
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'MasterCard';
    return '';
  };

  // Cargar detalle de la orden
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await api.get<DetalleOrden>(`/ordenes/${orderId}`);
        setDetalle(resp.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error ?? 'No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  // Permisos
  const userRole = (authCtx?.user?.rol ?? '').toString().toUpperCase().trim();
  const userId = authCtx?.user?.id ? Number(authCtx.user.id) : null;
  const userEsCliente =
    userRole === 'CLIENTE' &&
    userId !== null &&
    detalle &&
    String(detalle.cliente.id) === String(userId);
  const puedePagar = userEsCliente && detalle?.estado === 'CONFIRMADO';

  // Validaciones
  const validarCardNumber = (num: string) => {
    const onlyDigits = num.replace(/\D/g, '');
    if (onlyDigits.length !== 16) {
      setErrorCardNumber('Debe tener 16 dígitos.');
      return false;
    }
    const type = detectCardType(onlyDigits);
    if (type !== 'Visa' && type !== 'MasterCard') {
      setErrorCardNumber('Solo Visa o MasterCard.');
      return false;
    }
    setErrorCardNumber(null);
    return true;
  };

  const validarExpiry = (exp: string) => {
    const match = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      setErrorExpiry('Formato MM/AA.');
      return false;
    }
    const mes = Number(match[1]);
    const año = Number(match[2]) + 2000;
    if (mes < 1 || mes > 12) {
      setErrorExpiry('Mes inválido.');
      return false;
    }
    const ahora = new Date();
    const añoActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1;
    if (año < añoActual || (año === añoActual && mes < mesActual)) {
      setErrorExpiry('Vencida.');
      return false;
    }
    setErrorExpiry(null);
    return true;
  };

  const validarCvc = (cv: string) => {
    const onlyDigits = cv.replace(/\D/g, '');
    if (onlyDigits.length !== 3) {
      setErrorCvc('3 dígitos.');
      return false;
    }
    setErrorCvc(null);
    return true;
  };

  const validarCardHolder = (name: string) => {
    if (name.trim().length < 3) {
      setErrorCardHolder('Nombre inválido.');
      return false;
    }
    setErrorCardHolder(null);
    return true;
  };

  const tarjetaValida = () => {
    return (
      cardNumber.length === 16 &&
      !errorCardNumber &&
      expiry.length === 5 &&
      !errorExpiry &&
      cvc.length === 3 &&
      !errorCvc &&
      cardHolder.trim().length >= 3 &&
      !errorCardHolder
    );
  };

  const handleProcesarPago = async () => {
    if (!detalle) return;
    setProcesandoPago(true);
    setMensajePago(null);
    try {
      await api.post(`/ordenes/${orderId}/pagar`, { metodo });
      setMensajePago('Pago registrado con éxito.');
      setTimeout(() => nav('/ordenes'), 1500);
    } catch (err: any) {
      console.error(err);
      setMensajePago(err.response?.data?.error ?? 'Error al procesar pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!detalle || !puedePagar) {
    return (
      <Box m={2}>
        <Alert severity="warning">No tienes permisos para pagar esta orden.</Alert>
      </Box>
    );
  }

  return (
    <Box
      maxWidth={1000}
      mx="auto"
      p={{ xs: 2, md: 4 }}
      fontFamily="'Source Sans Pro', sans-serif"
      color="var(--color-dark-blue)"
    >
      {/* Título */}
      <Typography
        variant="h4"
        fontFamily="'Playfair Display', serif"
        fontWeight={700}
        color="var(--color-gold)"
        mb={1}
      >
        Pago de Orden #{detalle.id}
      </Typography>
      <Typography
        fontFamily="'Merriweather', serif"
        fontWeight={600}
        color="var(--color-brown)"
        mb={2}
      >
        Cliente: {detalle.cliente.nombres} ({detalle.cliente.email})
      </Typography>
      <Typography mb={3}>
        Total a pagar: <strong>{detalle.total.toFixed(2)} Bs</strong>
      </Typography>

      <Grid container spacing={4}>
        {/* --------- IZQUIERDA: Métodos + Formulario --------- */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid var(--color-light-gray)',
            }}
          >
            {/* ToggleButtonGroup para métodos */}
            <ToggleButtonGroup
              value={metodo}
              exclusive
              onChange={(_, val) => {
                if (val && !procesandoPago) {
                  setMetodo(val);
                  setMensajePago(null);
                }
              }}
              aria-label="método de pago"
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mb: 3,
              }}
            >
              {METODOS.map((m) => {
                // Icono según método
                let Icono = CreditCard;
                if (m === 'Transferencia') Icono = AccountBalance;
                if (m === 'Efectivo') Icono = AttachMoney;
                if (m === 'Billetera') Icono = AccountBalanceWallet;

                return (
                  <ToggleButton
                    key={m}
                    value={m}
                    aria-label={m}
                    sx={{
                      flex: '1 1 45%',
                      borderRadius: 2,
                      border: '2px solid var(--color-dark-blue)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--color-selected-bg)',
                        borderColor: 'var(--color-gold)',
                        color: 'var(--color-off-white)',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icono fontSize="medium" />
                      <Typography fontFamily="'Merriweather', serif" fontWeight={600}>
                        {m}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>

            {/* Formulario solo si Tarjeta */}
            {metodo === 'Tarjeta' && (
              <Box component="form" mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Número de tarjeta"
                      variant="outlined"
                      value={cardNumber}
                      onChange={(e) => {
                        const soloDig = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCardNumber(soloDig);
                        if (errorCardNumber && soloDig.length === 16) {
                          validarCardNumber(soloDig);
                        }
                      }}
                      onBlur={() => validarCardNumber(cardNumber)}
                      helperText={errorCardNumber || detectCardType(cardNumber)}
                      error={!!errorCardNumber}
                      inputProps={{ maxLength: 16 }}
                      placeholder="Ej: 4123 4567 8901 2345"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="MM/AA"
                      variant="outlined"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                        setExpiry(val);
                        if (errorExpiry && val.length === 5) validarExpiry(val);
                      }}
                      onBlur={() => validarExpiry(expiry)}
                      helperText={errorExpiry || ''}
                      error={!!errorExpiry}
                      placeholder="MM/AA"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVC"
                      variant="outlined"
                      value={cvc}
                      onChange={(e) => {
                        const soloDig = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setCvc(soloDig);
                        if (errorCvc && soloDig.length === 3) validarCvc(soloDig);
                      }}
                      onBlur={() => validarCvc(cvc)}
                      helperText={errorCvc || ''}
                      error={!!errorCvc}
                      placeholder="Ej: 123"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Titular de la tarjeta"
                      variant="outlined"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value);
                        if (errorCardHolder && e.target.value.trim().length >= 3) {
                          validarCardHolder(e.target.value);
                        }
                      }}
                      onBlur={() => validarCardHolder(cardHolder)}
                      helperText={errorCardHolder || ''}
                      error={!!errorCardHolder}
                      placeholder="Nombre tal como aparece"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Acciones */}
            <Stack direction="row" spacing={2} mt={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'var(--color-gold)',
                  color: 'var(--color-off-white)',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#d0ba82' },
                }}
                onClick={handleProcesarPago}
                disabled={procesandoPago || (metodo === 'Tarjeta' && !tarjetaValida())}
              >
                {procesandoPago ? 'Procesando…' : 'Confirmar Pago'}
              </Button>
              <Button onClick={() => nav('/ordenes')} disabled={procesandoPago}>
                Volver a mis órdenes
              </Button>
            </Stack>

            {mensajePago && (
              <Alert
                severity={mensajePago.includes('éxito') ? 'success' : 'error'}
                sx={{ mt: 2 }}
              >
                {mensajePago}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* --------- DERECHA: Resumen de servicios --------- */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid var(--color-light-gray)',
              backgroundColor: '#fff',
            }}
          >
            <Typography
              variant="h6"
              fontFamily="'Merriweather', serif"
              fontWeight={600}
              mb={1}
            >
              Resumen de tu compra
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {detalle.servicios.map((srv) => (
                <Paper
                  key={srv.id}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 'transparent',
                  }}
                >
                  {srv.imagenUrl && (
                    <Avatar
                      variant="rounded"
                      src={srv.imagenUrl}
                      alt={srv.nombre}
                      sx={{
                        width: { xs: 48, md: 64 },
                        height: { xs: 48, md: 64 },
                        mr: 2,
                      }}
                    />
                  )}
                  <Box>
                    <Typography
                      fontFamily="'Merriweather', serif"
                      fontSize="1rem"
                      fontWeight={600}
                    >
                      {srv.nombre}
                    </Typography>
                    <Typography fontSize="0.9rem" color="var(--color-dark-blue)">
                      {srv.cantidad} × {srv.precio_base.toFixed(2)} Bs ={' '}
                      <strong>{srv.subtotal.toFixed(2)} Bs</strong>
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Total: {detalle.total.toFixed(2)} Bs
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
