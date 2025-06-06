"use strict";
// backend/src/controllers/notification.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.listMyNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listMyNotifications = async (req, res) => {
    // “req.user” se setea en el authMiddleware
    const user = req.user;
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
    }
    catch (err) {
        console.error("listMyNotifications:", err);
        return res.status(500).json({ error: "Error interno al listar notificaciones" });
    }
};
exports.listMyNotifications = listMyNotifications;
const markNotificationAsRead = async (req, res) => {
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ error: "No autenticado." });
    }
    let notifId;
    try {
        notifId = BigInt(req.params.id);
    }
    catch {
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
    }
    catch (err) {
        console.error("markNotificationAsRead:", err);
        return res.status(500).json({ error: "Error interno al marcar notificación" });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
//# sourceMappingURL=notificacion.controller.js.map