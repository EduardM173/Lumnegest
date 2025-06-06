"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_controller_1 = require("../controllers/cliente.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/*  /api/clientes  */
router.post('/', auth_1.authMiddleware, (0, auth_1.requireRol)(['OPERADOR', 'ADMIN']), cliente_controller_1.crearCliente);
exports.default = router;
//# sourceMappingURL=cliente.routes.js.map