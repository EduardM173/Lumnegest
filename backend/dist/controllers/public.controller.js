"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.registerClient = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const mailer_1 = require("../services/mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Paso 1: Crear usuario INACTIVO + perfil_cliente + código + email_verificacion + envío de código
 */
const registerClient = async (req, res, next) => {
    try {
        const { nombre_usuario, email, password, nombres, apellidos, telefono, direccion, } = req.body;
        // 1) Validar campos
        if (!nombre_usuario ||
            !email ||
            !password ||
            !nombres ||
            !apellidos) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }
        if (!/^[\w.@-]{3,32}$/.test(nombre_usuario)) {
            return res
                .status(400)
                .json({ error: 'Usuario inválido (3-32 caracteres, sin espacios).' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email no tiene formato válido.' });
        }
        // 2) Revisar duplicados
        const dup = await prismaClient_1.default.usuario.findFirst({
            where: { OR: [{ email }, { nombre_usuario }] },
        });
        if (dup) {
            return res
                .status(409)
                .json({ error: 'Email o usuario ya registrados.' });
        }
        // 3) Hashear contraseña
        const hash = await bcrypt_1.default.hash(password, 10);
        // 4) Crear usuario INACTIVO + perfil_cliente
        const user = await prismaClient_1.default.usuario.create({
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
        });
        // 5) Generar y guardar código en email_verificacion con expiración a 24h
        const code = (0, mailer_1.genCode)();
        const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
        await prismaClient_1.default.email_verificacion.upsert({
            where: { usuario_id: user.id },
            update: { token: code, expiracion: expiresAt },
            create: { usuario_id: user.id, token: code, expiracion: expiresAt },
        });
        // 6) Enviar correo (no bloqueante si falla)
        (0, mailer_1.sendVerificationEmail)(email, code).catch((e) => console.error('Error enviando email de verificación:', e));
        return res
            .status(201)
            .json({ message: 'Usuario creado. Revisa tu correo para verificar.' });
    }
    catch (err) {
        next(err);
    }
};
exports.registerClient = registerClient;
/**
 * Paso 2: Verificar código y activar la cuenta
 */
const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res
                .status(400)
                .json({ error: 'Email y código son requeridos.' });
        }
        // 1) Buscar usuario
        const user = await prismaClient_1.default.usuario.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no existe.' });
        }
        // 2) Buscar registro de verificación
        const rec = await prismaClient_1.default.email_verificacion.findUnique({
            where: { usuario_id: user.id },
        });
        if (!rec) {
            return res
                .status(400)
                .json({ error: 'No existe un código de verificación para este email.' });
        }
        if (rec.token !== code) {
            return res.status(400).json({ error: 'Código inválido.' });
        }
        if (rec.expiracion < new Date()) {
            return res.status(400).json({ error: 'Código expirado.' });
        }
        // 3) Activar usuario y eliminar el token en una transacción
        await prismaClient_1.default.$transaction([
            prismaClient_1.default.usuario.update({
                where: { id: user.id },
                data: { estado: 'ACTIVO' },
            }),
            prismaClient_1.default.email_verificacion.delete({
                where: { usuario_id: user.id },
            }),
        ]);
        return res.json({ message: 'Cuenta verificada. Ya puedes iniciar sesión.' });
    }
    catch (err) {
        next(err);
    }
};
exports.verifyCode = verifyCode;
//# sourceMappingURL=public.controller.js.map