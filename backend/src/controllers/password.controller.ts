// src/controllers/password.controller.ts
import { RequestHandler } from 'express'
import prisma              from '../config/prismaClient'
import bcrypt              from 'bcrypt'
import { genCode,
         sendPasswordResetEmail } from '../services/mailer'

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email requerido.' })

    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user || user.estado !== 'ACTIVO') {
      return res.json({ message: 'Si el email existe, se enviará un código.' })
    }

    // invalidar viejos y crear uno nuevo
    const code       = genCode()
    const expiracion = new Date(Date.now() + 60 * 60 * 1000)
    await prisma.password_reset.deleteMany({ where: { usuario_id: user.id } })
    await prisma.password_reset.create({
      data: { usuario_id: user.id, token: code, expiracion }
    })

    // enviar correo (no bloqueante)
    sendPasswordResetEmail(email, code).catch(console.error)

    return res.json({ message: 'Código enviado. Revisa tu correo.' })
  } catch (err) {
    next(err)
  }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Datos incompletos.' })
    }
    // validaciones…
    const user = await prisma.usuario.findUnique({ where: { email } })
    const rec  = user && await prisma.password_reset.findFirst({
      where: { usuario_id: user.id, token }
    })
    if (!user || !rec || rec.expiracion < new Date()) {
      return res.status(400).json({ error: 'Token inválido o expirado.' })
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.usuario.update({
      where: { id: user.id },
      data: { password_hash: hash }
    })
    await prisma.password_reset.delete({ where: { id: rec.id } })

    return res.json({ message: 'Contraseña restablecida.' })
  } catch (err) {
    next(err)
  }
}
