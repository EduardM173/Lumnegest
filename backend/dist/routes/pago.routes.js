"use strict";
// backend/src/routes/pago.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pago_controller_1 = require("../controllers/pago.controller");
const router = (0, express_1.Router)();
// POST /pagos/create-payment-intent
router.post('/create-payment-intent', pago_controller_1.createPaymentIntent);
// POST /pagos/confirm-payment
router.post('/confirm-payment', pago_controller_1.confirmPayment);
exports.default = router;
//# sourceMappingURL=pago.routes.js.map