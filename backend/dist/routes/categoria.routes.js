"use strict";
// backend/src/routes/categoria.routes.ts
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
const CategoriaController = __importStar(require("../controllers/categoria.controller"));
const router = (0, express_1.Router)();
// ─── Carpeta absoluta donde guardaremos imágenes ────────────────────────────
const uploadsDir = path_1.default.join(process.cwd(), 'backend', 'public', 'uploads', 'categorias');
// ─── Configuración de multer (creando directorio si no existe) ─────────────
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
        cb(null, `cat-${uniqueSuffix}${ext}`);
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
// ─── RUTAS DE CATEGORÍAS ─────────────────────────────────────────────────────
// GET /api/categorias
router.get('/', CategoriaController.listCategorias);
// GET /api/categorias/:id
router.get('/:id', CategoriaController.getCategoria);
// POST /api/categorias
router.post('/', CategoriaController.createCategoria);
// PUT /api/categorias/:id
router.put('/:id', CategoriaController.updateCategoria);
// DELETE /api/categorias/:id
router.delete('/:id', CategoriaController.deleteCategoria);
// GET /api/categorias/:id/servicios
router.get('/:id/servicios', CategoriaController.listServiciosPorCategoria);
// PATCH /api/categorias/:id/imagen
router.patch('/:id/imagen', upload.single('imagen'), // “imagen” será el campo form-data
CategoriaController.subirImagenCategoria);
exports.default = router;
//# sourceMappingURL=categoria.routes.js.map