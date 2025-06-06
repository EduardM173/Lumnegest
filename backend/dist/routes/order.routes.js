"use strict";
// backend/src/routes/order.routes.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl = __importStar(require("../controllers/order.controller"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Todas las rutas de ordenes requieren estar autenticado
router.use(auth_1.authMiddleware);
// ‣ Crear orden rápida (11): solo un servicio + difunto
router.post("/contratar", (0, auth_1.requireRol)(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.createFast);
// ‣ Crear orden múltiple (◆): varios servicios + difunto
router.post("/", (0, auth_1.requireRol)(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.create);
// ‣ Listar mis órdenes (cliente)
router.get("/mias", (0, auth_1.requireRol)(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.listMine);
// ‣ Obtener detalle completo de una orden
router.get("/:id", (0, auth_1.requireRol)(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.get);
// ‣ Cambiar estado (solo OPERADOR/ADMIN)
router.patch("/:id/estado", (0, auth_1.requireRol)(["OPERADOR", "ADMIN"]), ctrl.changeStatus);
// ‣ Listar todas las órdenes (solo OPERADOR/ADMIN)
router.get("/", (0, auth_1.requireRol)(["OPERADOR", "ADMIN"]), ctrl.listAll);
// ── NUEVA RUTA: Pagar una orden (mock) ─────────────────────────────────────
//    POST /api/ordenes/:id/pagar
router.post("/:id/pagar", (0, auth_1.requireRol)(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.pagarOrden);
exports.default = router;
//# sourceMappingURL=order.routes.js.map