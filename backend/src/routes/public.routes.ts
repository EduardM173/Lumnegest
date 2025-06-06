// src/routes/public.routes.ts
import { Router } from 'express'
import {
  registerClient,
  verifyCode
} from '../controllers/public.controller'
import {
  forgotPassword,
  resetPassword
} from '../controllers/password.controller'

const router = Router()

// registro + verificación de cuenta
router.post('/register', registerClient)
router.post('/verify',   verifyCode)

// recuperación de contraseña
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

export default router
