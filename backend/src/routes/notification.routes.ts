import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth"; // ← Importamos nuestro authMiddleware

const prisma = new PrismaClient();
const router = Router();

// ─── 1) APLICAR middleware de autenticación a todas estas rutas ─────────────
router.use(authMiddleware);

/**
 * GET /api/notificaciones
 *   - Lista todas las notificaciones del usuario autenticado (ordenadas por fecha).
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Gracias a authMiddleware, req.user está poblado
    const userId = BigInt((req as any).user.id);

    const notificaciones = await prisma.notificacion.findMany({
      where: { usuario_id: userId },
      orderBy: { enviado_en: "desc" },
      select: {
        id: true,
        asunto: true,
        cuerpo: true,
        leida: true,
        enviado_en: true,
      },
    });

    return res.json(notificaciones);
  } catch (err) {
    console.error("Error en GET /api/notificaciones:", err);
    return res.status(500).json({ error: "Error interno al listar notificaciones" });
  }
});

/**
 * PATCH /api/notificaciones/:id/leer
 *   - Marca una notificación como leída (leida = true).
 */
router.patch("/:id/leer", async (req: Request, res: Response) => {
  let notifId: bigint;
  try {
    notifId = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "ID de notificación inválido." });
  }

  try {
    // Verificar que la notificación exista y pertenezca al usuario
    const existing = await prisma.notificacion.findUnique({
      where: { id: notifId },
      select: { usuario_id: true },
    });
    if (!existing) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }

    // Solo el dueño puede marcarla como leída
    if (existing.usuario_id !== BigInt((req as any).user.id)) {
      return res.status(403).json({ error: "No tienes permiso para modificar esta notificación." });
    }

    const updated = await prisma.notificacion.update({
      where: { id: notifId },
      data: { leida: true },
      select: {
        id: true,
        asunto: true,
        cuerpo: true,
        leida: true,
        enviado_en: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error("Error en PATCH /api/notificaciones/:id/leer:", err);
    return res.status(500).json({ error: "Error interno al marcar notificación" });
  }
});

export default router;
