// backend/src/routes/pago.routes.ts

import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
} from '../controllers/pago.controller';

const router = Router();

// POST /pagos/create-payment-intent
router.post('/create-payment-intent', createPaymentIntent);

// POST /pagos/confirm-payment
router.post('/confirm-payment', confirmPayment);

export default router;
