// backend/src/services/service.repository.ts
import prisma from '../config/prismaClient';
import type { IServiceCreate, IServiceUpdate, IServiceFilter } from './service.dto';

export class ServiceRepository {
  static async list(filters: IServiceFilter) {
    const where: any = { activo: true };

    if (filters.nombre) {
      where.nombre = { contains: filters.nombre, mode: 'insensitive' };
    }
    if (filters.minPrecio !== undefined) {
      where.precio_base = { ...(where.precio_base ?? {}), gte: filters.minPrecio };
    }
    if (filters.maxPrecio !== undefined) {
      where.precio_base = { ...(where.precio_base ?? {}), lte: filters.maxPrecio };
    }
    if (filters.categoriaId) {
      // Filtra por la clave foránea `categoria_id`
      where.categoria_id = Number(filters.categoriaId);
    }

    return prisma.servicio.findMany({
      where,
      orderBy: { creado_en: 'desc' },
    });
  }

  static async findById(id: bigint) {
    return prisma.servicio.findUnique({ where: { id } });
  }

  static async create(data: IServiceCreate) {
    return prisma.servicio.create({
      data: {
        nombre:       data.nombre,
        descripcion:  data.descripcion ?? null,
        precio_base:  data.precio_base,
        categoria_id: data.categoriaId ?? null,
      },
    });
  }

  static async update(id: bigint, data: IServiceUpdate) {
    return prisma.servicio.update({
      where: { id },
      data: {
        ...(data.nombre      !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.precio_base !== undefined && { precio_base: data.precio_base }),
        ...(data.categoriaId  !== undefined && { categoria_id: data.categoriaId }),
      },
    });
  }

  static async inactivate(id: bigint) {
    return prisma.servicio.update({
      where: { id },
      data: { activo: false },
    });
  }
}
