"use strict";
// backend/src/services/categoria.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CategoriaService {
    /** Devuelve todas las categorías, incluyendo imagenUrl */
    static async list() {
        return prisma.categoria.findMany({
            select: {
                id: true,
                nombre: true,
                imagenUrl: true,
            },
        });
    }
    /** Devuelve una categoría por ID, junto con sus servicios */
    static async getById(id) {
        return prisma.categoria.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                imagenUrl: true,
                servicio: true, // incluye los servicios relacionados
            },
        });
    }
    /** Crea una nueva categoría, recibiendo nombre e imagenUrl (opcional),
     *  y devuelve solo id, nombre e imagenUrl */
    static async create(dto) {
        const nuevaCat = await prisma.categoria.create({
            data: {
                nombre: dto.nombre,
                imagenUrl: dto.imagenUrl, // puede venir undefined
            },
            select: {
                id: true,
                nombre: true,
                imagenUrl: true,
            },
        });
        return nuevaCat;
    }
    /** Actualiza nombre e imagenUrl de una categoría existente,
     *  y devuelve solo id, nombre e imagenUrl */
    static async update(id, dto) {
        const catActualizada = await prisma.categoria.update({
            where: { id },
            data: {
                ...(dto.nombre !== undefined && { nombre: dto.nombre }),
                ...(dto.imagenUrl !== undefined && { imagenUrl: dto.imagenUrl }),
            },
            select: {
                id: true,
                nombre: true,
                imagenUrl: true,
            },
        });
        return catActualizada;
    }
    /** Elimina una categoría por ID */
    static async delete(id) {
        return prisma.categoria.delete({
            where: { id },
        });
    }
    /** Lista todos los servicios que pertenezcan a cierta categoría */
    static async getServicios(id) {
        return prisma.servicio.findMany({
            where: { categoriaId: id },
            select: {
                id: true,
                nombre: true,
                precio: true,
                // …otros campos que necesites
            },
        });
    }
}
exports.CategoriaService = CategoriaService;
//# sourceMappingURL=categoria.service.js.map