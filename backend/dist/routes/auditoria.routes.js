"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditoria_controller_1 = require("../controllers/auditoria.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), auditoria_controller_1.getAuditLogs);
exports.default = router;
//# sourceMappingURL=auditoria.routes.js.map