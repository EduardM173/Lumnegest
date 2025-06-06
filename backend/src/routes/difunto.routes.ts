// backend/src/routes/difunto.routes.ts

import { Router } from 'express';
import {
  createDifunto,
  getDifuntosByOrden,
  updateDifunto,
  deleteDifunto,
} from '../controllers/difunto.controller';

const router = Router();

/**
 * POST   /api/difuntos
 *   Crea un nuevo difunto (espera los datos completos en el body).
 */
router.post('/', createDifunto);

/**
 * GET    /api/difuntos/orden/:ordenId
 *   Obtiene todos los difuntos asociados a la orden con id = ordenId.
 */
router.get('/orden/:ordenId', getDifuntosByOrden);

/**
 * PUT    /api/difuntos/:id
 *   Actualiza el difunto cuyo id es :id.
 */
router.put('/:id', updateDifunto);

/**
 * DELETE /api/difuntos/:id
 *   Elimina el difunto cuyo id es :id.
 */
router.delete('/:id', deleteDifunto);

export default router;
