import { RequestHandler } from 'express'
import prisma from '../config/prismaClient'
import { genCode, sendVerificationEmail } from '../services/mailer'
import bcrypt from 'bcrypt'

/**
 * Paso 1: Crear usuario INACTIVO + perfil_cliente + código + email_verificacion + envío de código
 */
export const registerClient: RequestHandler = async (req, res, next) => {
  try {
    const {
      nombre_usuario,
      email,
      password,
      nombres,
      apellidos,
      telefono,
      direccion,
    } = req.body

    // 1) Validar campos
    if (
      !nombre_usuario ||
      !email ||
      !password ||
      !nombres ||
      !apellidos
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' })
    }
    if (!/^[\w.@-]{3,32}$/.test(nombre_usuario)) {
      return res
        .status(400)
        .json({ error: 'Usuario inválido (3-32 caracteres, sin espacios).' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email no tiene formato válido.' })
    }

    // 2) Revisar duplicados
    const dup = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { nombre_usuario }] },
    })
    if (dup) {
      return res
        .status(409)
        .json({ error: 'Email o usuario ya registrados.' })
    }

    // 3) Hashear contraseña
    const hash = await bcrypt.hash(password, 10)

    // 4) Crear usuario INACTIVO + perfil_cliente
    const user = await prisma.usuario.create({
      data: {
        nombre_usuario,
        email,
        password_hash: hash,
        rol: 'CLIENTE',
        estado: 'INACTIVO',
        perfil_cliente: {
          create: { nombres, apellidos, telefono, direccion },
        },
      },
    })

    // 5) Generar y guardar código en email_verificacion con expiración a 24h
    const code = genCode()
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000)
    await prisma.email_verificacion.upsert({
      where: { usuario_id: user.id },
      update: { token: code, expiracion: expiresAt },
      create: { usuario_id: user.id, token: code, expiracion: expiresAt },
    })

    // 6) Enviar correo (no bloqueante si falla)
    sendVerificationEmail(email, code).catch((e) =>
      console.error('Error enviando email de verificación:', e)
    )

    return res
      .status(201)
      .json({ message: 'Usuario creado. Revisa tu correo para verificar.' })
  } catch (err) {
    next(err)
  }
}

/**
 * Paso 2: Verificar código y activar la cuenta
 */
export const verifyCode: RequestHandler = async (req, res, next) => {
  try {
    const { email, code } = req.body
    if (!email || !code) {
      return res
        .status(400)
        .json({ error: 'Email y código son requeridos.' })
    }

    // 1) Buscar usuario
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ error: 'Usuario no existe.' })
    }

    // 2) Buscar registro de verificación
    const rec = await prisma.email_verificacion.findUnique({
      where: { usuario_id: user.id },
    })
    if (!rec) {
      return res
        .status(400)
        .json({ error: 'No existe un código de verificación para este email.' })
    }
    if (rec.token !== code) {
      return res.status(400).json({ error: 'Código inválido.' })
    }
    if (rec.expiracion < new Date()) {
      return res.status(400).json({ error: 'Código expirado.' })
    }

    // 3) Activar usuario y eliminar el token en una transacción
    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: user.id },
        data: { estado: 'ACTIVO' },
      }),
      prisma.email_verificacion.delete({
        where: { usuario_id: user.id },
      }),
    ])

    return res.json({ message: 'Cuenta verificada. Ya puedes iniciar sesión.' })
  } catch (err) {
    next(err)
  }
}
