// backend/src/app.ts

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import { bigintReplacer } from './utils/bigintSerializer';

// Importación de rutas existentes
import authRoutes from './routes/auth.routes';
import clienteRoutes from './routes/cliente.routes';
import publicRoutes from './routes/public.routes';
import passwordRoutes from './routes/password.routes';
import usuarioRoutes from './routes/usuario.routes';
import auditoriaRoutes from './routes/auditoria.routes';
import serviceRoutes from './routes/service.routes';
import orderRoutes from './routes/order.routes';
import importRoutes from './routes/import.routes';
import categoriaRoutes from './routes/categoria.routes';
import difuntoRoutes from './routes/difunto.routes'; 
import dashboardRoutes from './routes/dashboard.routes';
import pagoRoutes from './routes/pago.routes';

// ← Aquí importa las notificaciones
import notificationRoutes from './routes/notification.routes';

const app = express();

// ─── 1) CORS y configuración JSON ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.set('json replacer', bigintReplacer);

console.log('🔍 Endpoints ANTES de montar rutas:');
console.table(listEndpoints(app));

// ─── 2) Logger de petición ─────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`→ Recibido ${req.method} ${req.path}`);
  next();
});

// ─── 3) Servir estáticos de “uploads” (imágenes subidas) ────────────────────
import path from 'path';
const uploadsPath = path.join(process.cwd(), 'backend', 'public', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ─── 4) Montaje de rutas ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/servicios', serviceRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/ordenes', orderRoutes);
app.use('/api/importaciones', importRoutes);
app.use('/api/difuntos', difuntoRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/pagos', pagoRoutes);

// ← Monta aquí la ruta de notificaciones
app.use('/api/notificaciones', notificationRoutes);

// Ruta pública para el equipo móvil
app.use('/api/public', publicRoutes);

console.log('✅ Endpoints DESPUÉS de montar rutas:');
console.table(listEndpoints(app));

// ─── 5) Manejo de rutas no encontradas y errores ────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ error: 'Ruta no encontrada.' })
);

app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor.' });
});

export default app;
