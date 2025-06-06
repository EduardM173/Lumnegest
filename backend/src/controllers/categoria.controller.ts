// backend/src/controllers/categoria.controller.ts

import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { CategoryCreateDto, CategoryUpdateDto } from '../models/categoria.dto';
import path from 'path';

function buildFullImageUrl(req: Request, relativePath: string): string {
  const protocol = req.protocol;
  const host = req.get('host'); // incluye puerto
  return `${protocol}://${host}${relativePath}`;
}

export const listCategorias = async (req: Request, res: Response) => {
  const cats = await CategoriaService.list();

  // Mapear `imagenUrl` relativo a URL absoluta
  const catsConFullUrl = cats.map((c) => {
    if (c.imagenUrl) {
      return {
        ...c,
        imagenUrl: buildFullImageUrl(req, c.imagenUrl),
      };
    }
    return c;
  });

  res.json(catsConFullUrl);
};

export const getCategoria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cat = await CategoriaService.getById(id);
  if (!cat) return res.status(404).json({ error: 'No existe' });

  if (cat.imagenUrl) {
    cat.imagenUrl = buildFullImageUrl(req, cat.imagenUrl);
  }

  res.json(cat);
};

export const createCategoria = async (req: Request, res: Response) => {
  const parsed = CategoryCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const nuevaCat = await CategoriaService.create(parsed.data);
  res.status(201).json(nuevaCat);
};

export const updateCategoria = async (req: Request, res: Response) => {
  const parsed = CategoryUpdateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const id = Number(req.params.id);
  const catActualizada = await CategoriaService.update(id, parsed.data);
  res.json(catActualizada);
};

export const deleteCategoria = async (req: Request, res: Response) => {
  await CategoriaService.delete(Number(req.params.id));
  res.status(204).send();
};

export const listServiciosPorCategoria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const servicios = await CategoriaService.getServicios(id);
  res.json(servicios);
};

export const subirImagenCategoria = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    // 1) Verificar que exista la categoría
    const catExistente = await CategoriaService.getById(id);
    if (!catExistente) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // 2) Verificar que Multer haya cargado un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    // 3) Construir la URL relativa que guardaremos en BD
    const nombreArchivo = req.file.filename;
    const urlRelativa = `/uploads/categorias/${nombreArchivo}`;

    // 4) Actualizar la categoría con la nueva URL relativa de la imagen
    const categoriaActualizada = await CategoriaService.update(id, {
      imagenUrl: urlRelativa,
    });

    // 5) Construir URL absoluta para devolver al cliente
    const fullImageUrl = buildFullImageUrl(req, urlRelativa);

    return res.json({
      message: 'Imagen de categoría actualizada',
      categoria: {
        ...categoriaActualizada,
        imagenUrl: fullImageUrl,
      },
    });
  } catch (error: any) {
    console.error('Error al subir imagen de categoría:', error);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
};
