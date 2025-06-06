import { Router } from 'express';
import {
  getMetrics,
  getVelatoriosMetrics,
  getInventarioMetrics,
  getServiciosMetrics,
  getUsuarioMetrics,
  getReportesMetrics,
} from '../controllers/dashboard.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

router.get('/metrics', authMiddleware, requireRol(['ADMIN']), getMetrics);
router.get('/velatorios', authMiddleware, requireRol(['ADMIN']), getVelatoriosMetrics);
router.get('/inventario', authMiddleware, requireRol(['ADMIN']), getInventarioMetrics);
router.get('/servicios', authMiddleware, requireRol(['ADMIN']), getServiciosMetrics);
router.get('/usuario', authMiddleware, requireRol(['ADMIN']), getUsuarioMetrics);
router.get('/reportes', authMiddleware, requireRol(['ADMIN']), getReportesMetrics);

export default router;