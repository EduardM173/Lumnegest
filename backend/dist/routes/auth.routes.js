"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Login
router.post('/login', auth_controller_1.login);
// Rehidratar sesión: devuelve datos de “me”
router.get('/me', auth_1.authMiddleware, auth_controller_1.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map