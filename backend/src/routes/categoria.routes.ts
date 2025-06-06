// backend/src/routes/categoria.routes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as CategoriaController from '../controllers/categoria.controller';

const router = Router();

// ─── Carpeta absoluta donde guardaremos imágenes ────────────────────────────
const uploadsDir = path.join(process.cwd(), 'backend', 'public', 'uploads', 'categorias');

// ─── Configuración de multer (creando directorio si no existe) ─────────────
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
    cb(null, `cat-${uniqueSuffix}${ext}`);
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

// ─── RUTAS DE CATEGORÍAS ─────────────────────────────────────────────────────

// GET /api/categorias
router.get('/', CategoriaController.listCategorias);

// GET /api/categorias/:id
router.get('/:id', CategoriaController.getCategoria);

// POST /api/categorias
router.post('/', CategoriaController.createCategoria);

// PUT /api/categorias/:id
router.put('/:id', CategoriaController.updateCategoria);

// DELETE /api/categorias/:id
router.delete('/:id', CategoriaController.deleteCategoria);

// GET /api/categorias/:id/servicios
router.get('/:id/servicios', CategoriaController.listServiciosPorCategoria);

// PATCH /api/categorias/:id/imagen
router.patch(
  '/:id/imagen',
  upload.single('imagen'), // “imagen” será el campo form-data
  CategoriaController.subirImagenCategoria
);

export default router;
