import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditoria.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, requireRol(['ADMIN']), getAuditLogs);

export default router;