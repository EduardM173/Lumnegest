// backend/src/routes/import.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, requireRol } from '../middlewares/auth';
import * as ctrl from '../controllers/import.controller';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// POST /api/importaciones/
// Sólo ADMIN puede importar datos históricos
router.post(
  '/',
  authMiddleware,
  requireRol(['ADMIN']),
  upload.single('file'),
  ctrl.uploadCsv
);

// Aquí está la clave: export default
export default router;
