"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_controller_1 = require("../controllers/password.controller");
const router = (0, express_1.Router)();
// No requiere auth
router.post('/forgot', password_controller_1.forgotPassword);
router.post('/reset', password_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=password.routes.js.map