// web/src/routes.tsx

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Autoregistro from './pages/AutoRegistro';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import RegistrarCliente from './pages/RegistrarCliente';
import Usuarios from './pages/Usuarios';

import CategoriasLanding from './pages/Servicios/CategoriasLanding';
import CatalogoServicios from './pages/Servicios/CatalogoServicios';
import AdminCategorias from './pages/Servicios/AdminCategorias';
import FormServicio from './pages/Servicios/FormServicio';

// Checkout (carrito multi-servicio)
import Checkout from './pages/Checkout';

// Importación CSV
import ImportCsv from './pages/Importacion/ImportCsv';

// Nuevas páginas de Admin
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Auditorias from './pages/Auditorias';

// ==== Importamos nuestra OrderList (lista de órdenes) ====  
import OrderList from './pages/OrderList';

// ==== Importamos el componente de Pago Final ====  
import PagoFinal from './pages/PagoFinal';

function MainRoutes() {
  const location = useLocation();
  const isLogin = ['/login', '/autoregistro'].includes(location.pathname);

  useEffect(() => {
    if (isLogin) document.body.classList.add('login-body');
    else document.body.classList.remove('login-body');
  }, [isLogin]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isLogin && <Navbar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: !isLogin ? '64px' : 0,
          px: { xs: 2, md: 4 },
        }}
      >
        <Routes>
          {/* — Públicas — */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/autoregistro" element={<Autoregistro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* — Catálogo de Categorías & Servicios — */}
          <Route path="/servicios" element={<CategoriasLanding />} />
          <Route path="/servicios/cat/:id" element={<CatalogoServicios />} />

          {/* — ABM Servicios (ADMIN) — */}
          <Route
            path="/servicios/nuevo"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormServicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/servicios/editar/:id"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <FormServicio />
              </PrivateRoute>
            }
          />

          {/* — ABM Categorías (ADMIN) — */}
          <Route
            path="/servicios/categorias"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminCategorias />
              </PrivateRoute>
            }
          />

          {/* — Checkout Multicarrito (CLIENTE/OPERADOR) — */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* — Lista de Órdenes (CLIENTE/OPERADOR/ADMIN) — */}
          <Route
            path="/ordenes"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR', 'ADMIN']}>
                <OrderList />
              </PrivateRoute>
            }
          />

          {/* — Pago Final (CLIENTE solamente, y la ruta es /ordenes/:id/pagar) — */}
          <Route
            path="/ordenes/:id/pagar"
            element={
              <PrivateRoute roles={['CLIENTE']}>
                <PagoFinal />
              </PrivateRoute>
            }
          />

          {/* — Seguimiento de una orden individual (CLIENTE/OPERADOR) — */}
          <Route
            path="/ordenes/seguimiento/:id"
            element={
              <PrivateRoute roles={['CLIENTE', 'OPERADOR']}>
                <Navigate to="/ordenes" replace />
                {/**
                  Si más adelante deseas un componente distinto para seguimiento (en vez de redirigir),
                  reemplaza la línea anterior por: <SeguimientoOrden />
                */}
              </PrivateRoute>
            }
          />

          {/* — Gestión de clientes (OPERADOR / ADMIN) — */}
          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />

          {/* — Gestión de usuarios (ADMIN) — */}
          <Route
            path="/Usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* — Panel de administración y dashboards — */}
          <Route
            path="/AdminPanel"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['ADMIN', 'OPERADOR']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/Auditoria"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Auditorias />
              </PrivateRoute>
            }
          />

          {/* — Importación CSV (ADMIN) — */}
          <Route
            path="/importar"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <ImportCsv />
              </PrivateRoute>
            }
          />

          {/* — Catch-all — */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {!isLogin && <Footer />}
    </Box>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}
