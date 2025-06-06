"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRol = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* ───────── Verifica token y adjunta req.user ───────── */
const authMiddleware = (req, res, next) => {
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido.' });
    }
    try {
        const token = header.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Adjuntar el usuario decodificado al objeto req
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};
exports.authMiddleware = authMiddleware;
/* ───────── Solo permite ciertos roles ───────── */
const requireRol = (roles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'No autenticado.' });
    }
    if (!roles.includes(user.rol)) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }
    next();
};
exports.requireRol = requireRol;
//# sourceMappingURL=auth.js.map