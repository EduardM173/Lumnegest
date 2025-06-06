import { Router } from 'express';
import {
  obtenerUsuarios,
  crearUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario,
} from '../controllers/usuario.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// Todas protegidas y solo ADMIN puede usarlas
router.get('/',        authMiddleware, requireRol(['ADMIN']), obtenerUsuarios);
router.post('/',       authMiddleware, requireRol(['ADMIN']), crearUsuario);
router.patch('/:id',   authMiddleware, requireRol(['ADMIN']), cambiarEstadoUsuario);
router.delete('/:id',  authMiddleware, requireRol(['ADMIN']), eliminarUsuario);

export default router;
