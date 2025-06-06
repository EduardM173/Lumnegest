"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("../services/mailer");
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: 'Email requerido.' });
        const user = await prismaClient_1.default.usuario.findUnique({ where: { email } });
        if (!user || user.estado !== 'ACTIVO') {
            return res.json({ message: 'Si el email existe, se enviará un código.' });
        }
        // invalidar viejos y crear uno nuevo
        const code = (0, mailer_1.genCode)();
        const expiracion = new Date(Date.now() + 60 * 60 * 1000);
        await prismaClient_1.default.password_reset.deleteMany({ where: { usuario_id: user.id } });
        await prismaClient_1.default.password_reset.create({
            data: { usuario_id: user.id, token: code, expiracion }
        });
        // enviar correo (no bloqueante)
        (0, mailer_1.sendPasswordResetEmail)(email, code).catch(console.error);
        return res.json({ message: 'Código enviado. Revisa tu correo.' });
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ error: 'Datos incompletos.' });
        }
        // validaciones…
        const user = await prismaClient_1.default.usuario.findUnique({ where: { email } });
        const rec = user && await prismaClient_1.default.password_reset.findFirst({
            where: { usuario_id: user.id, token }
        });
        if (!user || !rec || rec.expiracion < new Date()) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await prismaClient_1.default.usuario.update({
            where: { id: user.id },
            data: { password_hash: hash }
        });
        await prismaClient_1.default.password_reset.delete({ where: { id: rec.id } });
        return res.json({ message: 'Contraseña restablecida.' });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=password.controller.js.map