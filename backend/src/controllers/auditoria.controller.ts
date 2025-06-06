// src/controllers/auditoria.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { user, tabla, date, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (user)  where.usuario = { nombre_usuario: { contains: user as string } };
    if (tabla) where.tabla   = tabla as string;
    if (date) {
      const from = new Date(date as string);
      const to   = new Date((date as string) + 'T23:59:59.999Z');
      where.realizado_en = { gte: from, lte: to };
    }

    // Ahora incluimos todos los campos que quieres ver
    const [logs, total] = await Promise.all([
      prisma.auditoria.findMany({
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
      prisma.auditoria.count({ where }),
    ]);

    // Mapeamos a un JSON plano
    const formattedLogs = logs.map(log => ({
      id:          Number(log.id),                         // DataGrid exige number
      user:        log.usuario?.nombre_usuario ?? 'Sistema',
      tabla:       log.tabla,
      operacion:   log.operacion,
      registroId:  Number(log.registro_id),
      antes:       log.antes   ?? {},
      despues:     log.despues ?? {},
      realizado_en: log.realizado_en.toISOString(),
    }));

    return res.status(200).json({ logs: formattedLogs, total });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ error: 'Error al obtener los registros de auditoría' });
  }
};
