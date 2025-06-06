"use strict";
// backend/src/routes/service.routes.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ctrl = __importStar(require("../controllers/service.controller"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// ─── Configuración de Multer para “servicios” ──────────────────────────────
const uploadsDir = path_1.default.join(process.cwd(), 'backend', 'public', 'uploads', 'servicios');
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `serv-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (_req, file, cb) => {
        const allowedMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedMime.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten imágenes JPEG, PNG o WEBP'));
        }
    },
});
// ─── RUTAS PÚBLICAS ─────────────────────────────────────────────────────────
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
// ─── RUTAS PROTEGIDAS (solo ADMIN) ──────────────────────────────────────────
router.use(auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']));
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
// ─── NUEVA RUTA: subir/actualizar imagen de servicio ────────────────────────
router.patch('/:id/imagen', auth_1.authMiddleware, (0, auth_1.requireRol)(['ADMIN']), upload.single('imagen'), ctrl.subirImagenServicio);
exports.default = router;
//# sourceMappingURL=service.routes.js.map