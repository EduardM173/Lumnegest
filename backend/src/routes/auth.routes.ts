import { Router } from 'express';
import { login, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Login
router.post('/login', login);

// Rehidratar sesión: devuelve datos de “me”
router.get('/me', authMiddleware, me);

export default router;
