"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Todas protegidas y solo ADMIN puede usarlas
router.get('/', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), usuario_controller_1.obtenerUsuarios);
router.post('/', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), usuario_controller_1.crearUsuario);
router.patch('/:id', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), usuario_controller_1.cambiarEstadoUsuario);
router.delete('/:id', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), usuario_controller_1.eliminarUsuario);
exports.default = router;
//# sourceMappingURL=usuario.routes.js.map