// backend/src/routes/service.routes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as ctrl from '../controllers/service.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// ─── Configuración de Multer para “servicios” ──────────────────────────────
const uploadsDir = path.join(process.cwd(), 'backend', 'public', 'uploads', 'servicios');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `serv-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPEG, PNG o WEBP'));
    }
  },
});

// ─── RUTAS PÚBLICAS ─────────────────────────────────────────────────────────
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// ─── RUTAS PROTEGIDAS (solo ADMIN) ──────────────────────────────────────────
router.use(authMiddleware, requireRol(['ADMIN']));
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// ─── NUEVA RUTA: subir/actualizar imagen de servicio ────────────────────────
router.patch(
  '/:id/imagen',
  authMiddleware,
  requireRol(['ADMIN']),
  upload.single('imagen'),
  ctrl.subirImagenServicio
);

export default router;
