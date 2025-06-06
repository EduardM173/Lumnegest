"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Permite iniciar sesión con email **o** nombre_usuario.
 * Body esperado: { login: string, password: string }
 */
const login = async (req, res) => {
    const { login: loginField, password } = req.body;
    if (!loginField || !password) {
        res.status(400).json({ error: 'Usuario/Email y contraseña son requeridos.' });
        return;
    }
    try {
        const usuario = await prismaClient_1.default.usuario.findFirst({
            where: {
                OR: [{ email: loginField }, { nombre_usuario: loginField }],
            },
        });
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado.' });
            return;
        }
        const ok = await bcrypt_1.default.compare(password, usuario.password_hash);
        if (!ok) {
            res.status(401).json({ error: 'Credenciales inválidas.' });
            return;
        }
        // Coerción de BigInt a string
        const payload = {
            id: usuario.id.toString(),
            rol: usuario.rol,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            usuario: {
                id: usuario.id.toString(),
                nombre_usuario: usuario.nombre_usuario,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno.' });
    }
};
exports.login = login;
/**
 * Devuelve los datos del usuario ya autenticado,
 * tomando el payload de JWT que dejó authMiddleware en req.user
 */
const me = async (req, res) => {
    const payload = req.user;
    if (!payload) {
        res.status(401).json({ error: 'No autenticado.' });
        return;
    }
    try {
        const usuario = await prismaClient_1.default.usuario.findUnique({
            where: { id: BigInt(payload.id) },
            select: {
                id: true,
                nombre_usuario: true,
                email: true,
                rol: true,
            },
        });
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado.' });
            return;
        }
        res.json({
            id: usuario.id.toString(),
            nombre_usuario: usuario.nombre_usuario,
            email: usuario.email,
            rol: usuario.rol,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno.' });
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map