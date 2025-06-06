"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
// backend/src/services/service.repository.ts
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
class ServiceRepository {
    static async list(filters) {
        const where = { activo: true };
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
        return prismaClient_1.default.servicio.findMany({
            where,
            orderBy: { creado_en: 'desc' },
        });
    }
    static async findById(id) {
        return prismaClient_1.default.servicio.findUnique({ where: { id } });
    }
    static async create(data) {
        return prismaClient_1.default.servicio.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                precio_base: data.precio_base,
                categoria_id: data.categoriaId ?? null,
            },
        });
    }
    static async update(id, data) {
        return prismaClient_1.default.servicio.update({
            where: { id },
            data: {
                ...(data.nombre !== undefined && { nombre: data.nombre }),
                ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
                ...(data.precio_base !== undefined && { precio_base: data.precio_base }),
                ...(data.categoriaId !== undefined && { categoria_id: data.categoriaId }),
            },
        });
    }
    static async inactivate(id) {
        return prismaClient_1.default.servicio.update({
            where: { id },
            data: { activo: false },
        });
    }
}
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=service.repository.js.map