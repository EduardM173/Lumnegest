// backend/src/controllers/service.controller.ts

import { Request, Response } from 'express';
import {
  ServiceCreateDto,
  ServiceUpdateDto,
  ServiceFilterDto
} from '../models/service.dto';
import { ServiceService } from '../services/service.service';
import path from 'path';

function buildFullImageUrl(req: Request, relativePath: string): string {
  const protocol = req.protocol;
  const host = req.get('host')!;
  return `${protocol}://${host}${relativePath}`;
}

export const list = async (req: Request, res: Response) => {
  const parsed = ServiceFilterDto.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const items = await ServiceService.list(parsed.data);
  // Convertir imagenUrl a URL absoluta
  const itemsWithFullUrl = items.map((s) => {
    if (s.imagenUrl) {
      return { ...s, imagenUrl: buildFullImageUrl(req, s.imagenUrl) };
    }
    return s;
  });
  res.json(itemsWithFullUrl);
};

export const getOne = async (req: Request, res: Response) => {
  const item = await ServiceService.find(BigInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'No existe servicio' });
  if (item.imagenUrl) {
    item.imagenUrl = buildFullImageUrl(req, item.imagenUrl);
  }
  res.json(item);
};

export const create = async (req: Request, res: Response) => {
  const parsed = ServiceCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const newItem = await ServiceService.create(parsed.data);
    res.status(201).json(newItem);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = ServiceUpdateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const updated = await ServiceService.update(BigInt(req.params.id), parsed.data);
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  await ServiceService.inactivate(BigInt(req.params.id));
  res.status(204).send();
};

// ─── Nuevo: subirImagenServicio ────────────────────────────────────────────
// Recibe Multer en `req.file` y actualiza `imagenUrl`
export const subirImagenServicio = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    const id = BigInt(req.params.id);

    // 1) Verificar que exista el servicio
    const servExistente = await ServiceService.find(id);
    if (!servExistente) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // 2) Verificar que Multer haya cargado un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    // 3) Construir ruta relativa a guardar en BD
    const nombreArchivo = req.file.filename;
    const urlRelativa = `/uploads/servicios/${nombreArchivo}`; 
    // Ejemplo: "/uploads/servicios/serv-123456.png"

    // 4) Actualizar el servicio con la nueva imagenUrl
    const servicioActualizado = await ServiceService.update(id, {
      imagenUrl: urlRelativa,
    });

    // 5) Convertir a URL absoluta
    const fullImageUrl = buildFullImageUrl(req, urlRelativa);

    return res.json({
      message: 'Imagen de servicio actualizada',
      servicio: {
        ...servicioActualizado,
        imagenUrl: fullImageUrl,
      },
    });
  } catch (error: any) {
    console.error('Error al subir imagen de servicio:', error);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
};
