import { Router } from 'express';
import { crearCliente } from '../controllers/cliente.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

/*  /api/clientes  */
router.post('/', authMiddleware, requireRol(['OPERADOR', 'ADMIN']), crearCliente);

export default router;
