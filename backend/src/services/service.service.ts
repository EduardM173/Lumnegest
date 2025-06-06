// backend/src/services/service.service.ts

import { PrismaClient } from '@prisma/client';
import { ServiceCreateDtoType, ServiceUpdateDtoType, ServiceFilterDtoType } from '../models/service.dto';

const prisma = new PrismaClient();

export class ServiceService {
  /** Lista todos los servicios, opcionalmente filtrados por categoría */
  static async list(filter: ServiceFilterDtoType) {
    return prisma.servicio.findMany({
      where: {
        activo: true,
        ...(filter.categoriaId && { categoria_id: Number(filter.categoriaId) }),
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_base: true,
        activo: true,
        categoria_id: true,
        imagenUrl: true,
      },
    });
  }

  static async find(id: bigint) {
    return prisma.servicio.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_base: true,
        activo: true,
        categoria_id: true,
        imagenUrl: true,
      },
    });
  }

  static async create(dto: ServiceCreateDtoType) {
    return prisma.servicio.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio_base: dto.precio_base,
        categoria_id: dto.categoriaId ? Number(dto.categoriaId) : undefined,
        imagenUrl: dto.imagenUrl, // podrá venir undefined
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_base: true,
        activo: true,
        categoria_id: true,
        imagenUrl: true,
      },
    });
  }

  static async update(id: bigint, dto: ServiceUpdateDtoType) {
    return prisma.servicio.update({
      where: { id },
      data: {
        ...(dto.nombre !== undefined && { nombre: dto.nombre }),
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.precio_base !== undefined && { precio_base: dto.precio_base }),
        ...(dto.categoriaId !== undefined && { categoria_id: Number(dto.categoriaId) }),
        ...(dto.imagenUrl !== undefined && { imagenUrl: dto.imagenUrl }),
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_base: true,
        activo: true,
        categoria_id: true,
        imagenUrl: true,
      },
    });
  }

  static async inactivate(id: bigint) {
    // En lugar de borrarlo, ponemos activo = false:
    return prisma.servicio.update({
      where: { id },
      data: { activo: false },
    });
  }
}
