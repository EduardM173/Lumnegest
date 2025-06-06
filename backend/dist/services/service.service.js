"use strict";
// backend/src/services/service.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ServiceService {
    /** Lista todos los servicios, opcionalmente filtrados por categoría */
    static async list(filter) {
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
    static async find(id) {
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
    static async create(dto) {
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
    static async update(id, dto) {
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
    static async inactivate(id) {
        // En lugar de borrarlo, ponemos activo = false:
        return prisma.servicio.update({
            where: { id },
            data: { activo: false },
        });
    }
}
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map