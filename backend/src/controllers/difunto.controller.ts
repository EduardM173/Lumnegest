// backend/src/controllers/difunto.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Crea un nuevo registro de difunto asociado a una orden existente.
 * Se espera en el body:
 *  - orden_id (BigInt o number)
 *  - nombres (string)
 *  - fecha_fallecido (string|Date en formato ISO)
 *  - lugar_fallecimiento (string, opcional)
 *  - contacto_responsable (string, opcional)
 *  - relacion_solicitante (string, opcional)
 *  - notas (string, opcional)
 */
export const createDifunto = async (req: Request, res: Response) => {
  try {
    const {
      orden_id,
      nombres,
      fecha_fallecido,
      lugar_fallecimiento,
      contacto_responsable,
      relacion_solicitante,
      notas,
    } = req.body;

    // Validaciones básicas
    if (!orden_id || !nombres || !fecha_fallecido) {
      return res.status(400).json({
        error: 'orden_id, nombres y fecha_fallecido son campos obligatorios',
      });
    }

    // Crear el difunto en la base de datos
    const nuevoDifunto = await prisma.difunto.create({
      data: {
        orden_id: BigInt(orden_id),
        nombres,
        fecha_fallecido: new Date(fecha_fallecido),
        lugar_fallecimiento: lugar_fallecimiento || null,
        contacto_responsable: contacto_responsable || null,
        relacion_solicitante: relacion_solicitante || null,
        notas: notas || null,
      },
    });

    return res.status(201).json(nuevoDifunto);
  } catch (error: any) {
    console.error('Error creando difunto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene todos los difuntos asociados a una orden dada.
 * Ruta: GET /api/difuntos/orden/:ordenId
 */
export const getDifuntosByOrden = async (req: Request, res: Response) => {
  try {
    const { ordenId } = req.params;
    if (!ordenId) {
      return res.status(400).json({ error: 'ordenId es requerido' });
    }

    const difuntos = await prisma.difunto.findMany({
      where: { orden_id: BigInt(ordenId) },
    });

    return res.status(200).json(difuntos);
  } catch (error: any) {
    console.error('Error obteniendo difuntos por orden:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Actualiza un registro de difunto por su id.
 * Se espera en la URL: /api/difuntos/:id
 * En el body se pueden enviar los campos a modificar:
 *  - nombres, fecha_fallecido, lugar_fallecimiento, contacto_responsable,
 *    relacion_solicitante, notas
 */
export const updateDifunto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombres,
      fecha_fallecido,
      lugar_fallecimiento,
      contacto_responsable,
      relacion_solicitante,
      notas,
    } = req.body;

    // Verificar que exista el difunto
    const difuntoExistente = await prisma.difunto.findUnique({
      where: { id: BigInt(id) },
    });
    if (!difuntoExistente) {
      return res.status(404).json({ error: 'Difunto no encontrado' });
    }

    // Actualizar los campos que vengan en el body
    const difuntoActualizado = await prisma.difunto.update({
      where: { id: BigInt(id) },
      data: {
        nombres: nombres ?? difuntoExistente.nombres,
        fecha_fallecido: fecha_fallecido
          ? new Date(fecha_fallecido)
          : difuntoExistente.fecha_fallecido,
        lugar_fallecimiento:
          lugar_fallecimiento ?? difuntoExistente.lugar_fallecimiento,
        contacto_responsable:
          contacto_responsable ?? difuntoExistente.contacto_responsable,
        relacion_solicitante:
          relacion_solicitante ?? difuntoExistente.relacion_solicitante,
        notas: notas ?? difuntoExistente.notas,
      },
    });

    return res.status(200).json(difuntoActualizado);
  } catch (error: any) {
    console.error('Error actualizando difunto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina un registro de difunto por su id.
 * Ruta: DELETE /api/difuntos/:id
 */
export const deleteDifunto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Verificar que exista el difunto
    const difuntoExistente = await prisma.difunto.findUnique({
      where: { id: BigInt(id) },
    });
    if (!difuntoExistente) {
      return res.status(404).json({ error: 'Difunto no encontrado' });
    }

    await prisma.difunto.delete({
      where: { id: BigInt(id) },
    });

    return res.status(200).json({ message: 'Difunto eliminado correctamente' });
  } catch (error: any) {
    console.error('Error eliminando difunto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
