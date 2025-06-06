"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/public.routes.ts
const express_1 = require("express");
const public_controller_1 = require("../controllers/public.controller");
const password_controller_1 = require("../controllers/password.controller");
const router = (0, express_1.Router)();
// registro + verificación de cuenta
router.post('/register', public_controller_1.registerClient);
router.post('/verify', public_controller_1.verifyCode);
// recuperación de contraseña
router.post('/forgot-password', password_controller_1.forgotPassword);
router.post('/reset-password', password_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=public.routes.js.map