"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const getAuditLogs = async (req, res) => {
    try {
        const { user, tabla, date, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (user)
            where.usuario = { nombre_usuario: { contains: user } };
        if (tabla)
            where.tabla = tabla;
        if (date) {
            const from = new Date(date);
            const to = new Date(date + 'T23:59:59.999Z');
            where.realizado_en = { gte: from, lte: to };
        }
        // Ahora incluimos todos los campos que quieres ver
        const [logs, total] = await Promise.all([
            prismaClient_1.default.auditoria.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { realizado_en: 'desc' },
                select: {
                    id: true,
                    usuario_id: true,
                    tabla: true,
                    operacion: true,
                    registro_id: true,
                    antes: true,
                    despues: true,
                    realizado_en: true,
                    usuario: { select: { nombre_usuario: true } },
                }
            }),
            prismaClient_1.default.auditoria.count({ where }),
        ]);
        // Mapeamos a un JSON plano
        const formattedLogs = logs.map(log => ({
            id: Number(log.id), // DataGrid exige number
            user: log.usuario?.nombre_usuario ?? 'Sistema',
            tabla: log.tabla,
            operacion: log.operacion,
            registroId: Number(log.registro_id),
            antes: log.antes ?? {},
            despues: log.despues ?? {},
            realizado_en: log.realizado_en.toISOString(),
        }));
        return res.status(200).json({ logs: formattedLogs, total });
    }
    catch (error) {
        console.error('Error fetching audit logs:', error);
        return res.status(500).json({ error: 'Error al obtener los registros de auditoría' });
    }
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=auditoria.controller.js.map