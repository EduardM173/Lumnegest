// backend/src/routes/order.routes.ts

import { Router } from "express";
import * as ctrl from "../controllers/order.controller";
import { authMiddleware, requireRol } from "../middlewares/auth";

const router = Router();

// Todas las rutas de ordenes requieren estar autenticado
router.use(authMiddleware);

// ‣ Crear orden rápida (11): solo un servicio + difunto
router.post(
  "/contratar",
  requireRol(["CLIENTE", "OPERADOR", "ADMIN"]),
  ctrl.createFast
);

// ‣ Crear orden múltiple (◆): varios servicios + difunto
router.post("/", requireRol(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.create);

// ‣ Listar mis órdenes (cliente)
router.get("/mias", requireRol(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.listMine);

// ‣ Obtener detalle completo de una orden
router.get("/:id", requireRol(["CLIENTE", "OPERADOR", "ADMIN"]), ctrl.get);

// ‣ Cambiar estado (solo OPERADOR/ADMIN)
router.patch(
  "/:id/estado",
  requireRol(["OPERADOR", "ADMIN"]),
  ctrl.changeStatus
);

// ‣ Listar todas las órdenes (solo OPERADOR/ADMIN)
router.get("/", requireRol(["OPERADOR", "ADMIN"]), ctrl.listAll);

// ── NUEVA RUTA: Pagar una orden (mock) ─────────────────────────────────────
//    POST /api/ordenes/:id/pagar
router.post(
  "/:id/pagar",
  requireRol(["CLIENTE", "OPERADOR", "ADMIN"]),
  ctrl.pagarOrden
);

export default router;
