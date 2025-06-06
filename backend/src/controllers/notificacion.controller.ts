// backend/src/controllers/notification.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listMyNotifications = async (req: Request, res: Response) => {
  // “req.user” se setea en el authMiddleware
  const user = (req as any).user;
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado." });
  }

  try {
    // Buscar todas las notificaciones de este usuario, ordenadas por fecha
    const notifs = await prisma.notificacion.findMany({
      where: { usuario_id: BigInt(user.id) },
      orderBy: { enviado_en: "desc" },
    });

    // Mapeamos a un JSON simple
    const result = notifs.map((n) => ({
      id: n.id.toString(),
      asunto: n.asunto,
      cuerpo: n.cuerpo,
      leida: n.leida,
      enviado_en: n.enviado_en.toISOString(),
    }));

    return res.json(result);
  } catch (err) {
    console.error("listMyNotifications:", err);
    return res.status(500).json({ error: "Error interno al listar notificaciones" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado." });
  }

  let notifId: bigint;
  try {
    notifId = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "ID de notificación inválido." });
  }

  try {
    // Verificar que la notificación pertenezca al usuario
    const existing = await prisma.notificacion.findUnique({
      where: { id: notifId },
    });
    if (!existing || existing.usuario_id !== BigInt(user.id)) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }

    await prisma.notificacion.update({
      where: { id: notifId },
      data: { leida: true },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("markNotificationAsRead:", err);
    return res.status(500).json({ error: "Error interno al marcar notificación" });
  }
};
