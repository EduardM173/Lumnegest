"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/metrics', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getMetrics);
router.get('/velatorios', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getVelatoriosMetrics);
router.get('/inventario', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getInventarioMetrics);
router.get('/servicios', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getServiciosMetrics);
router.get('/usuario', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getUsuarioMetrics);
router.get('/reportes', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), dashboard_controller_1.getReportesMetrics);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map