"use strict";
// backend/src/routes/difunto.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const difunto_controller_1 = require("../controllers/difunto.controller");
const router = (0, express_1.Router)();
/**
 * POST   /api/difuntos
 *   Crea un nuevo difunto (espera los datos completos en el body).
 */
router.post('/', difunto_controller_1.createDifunto);
/**
 * GET    /api/difuntos/orden/:ordenId
 *   Obtiene todos los difuntos asociados a la orden con id = ordenId.
 */
router.get('/orden/:ordenId', difunto_controller_1.getDifuntosByOrden);
/**
 * PUT    /api/difuntos/:id
 *   Actualiza el difunto cuyo id es :id.
 */
router.put('/:id', difunto_controller_1.updateDifunto);
/**
 * DELETE /api/difuntos/:id
 *   Elimina el difunto cuyo id es :id.
 */
router.delete('/:id', difunto_controller_1.deleteDifunto);
exports.default = router;
//# sourceMappingURL=difunto.routes.js.map