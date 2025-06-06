"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
// backend/src/services/order.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrderService {
    /**
     * Crea una orden “rápida” con un solo servicio y un difunto.
     * (Reenvía a create() con un arreglo “lineas” de tamaño 1.)
     */
    static async createFast(data) {
        const { servicioId, clienteId, difunto } = data;
        // Buscar precio del servicio
        const servicio = await prisma.servicio.findUnique({
            where: { id: BigInt(servicioId) },
            select: { precio_base: true },
        });
        if (!servicio) {
            throw new Error(`Servicio con id=${servicioId} no existe`);
        }
        const precioBase = Number(servicio.precio_base);
        // Reenvío a create() con un solo elemento en “lineas”
        const payload = {
            clienteId: clienteId,
            tipoServicio: "ENTIERRO",
            total: precioBase,
            lineas: [
                {
                    servicioId: servicioId,
                    cantidad: 1,
                },
            ],
            difunto: difunto,
        };
        return this.create(payload);
    }
    /**
     * Crea una orden con múltiples líneas + difunto.
     */
    static async create(data) {
        const { clienteId, tipoServicio, total, lineas, difunto } = data;
        // 1) Creo la orden principal
        const nuevaOrden = await prisma.orden.create({
            data: {
                cliente_id: BigInt(clienteId),
                tipo_servicio: tipoServicio,
                total,
                estado: "PENDIENTE",
            },
        });
        // 2) Por cada línea del carrito, insertar en orden_detalle
        const detallePromises = lineas.map(async (linea) => {
            const servicio = await prisma.servicio.findUnique({
                where: { id: BigInt(linea.servicioId) },
                select: { precio_base: true },
            });
            if (!servicio) {
                throw new Error(`Servicio con id=${linea.servicioId} no existe`);
            }
            const precioUnit = Number(servicio.precio_base);
            const subTotal = precioUnit * linea.cantidad;
            return prisma.orden_detalle.create({
                data: {
                    orden_id: nuevaOrden.id,
                    servicio_id: BigInt(linea.servicioId),
                    cantidad: linea.cantidad,
                    precio_unitario: precioUnit,
                    subtotal: subTotal,
                    // descuento: 0 por defecto
                },
            });
        });
        await Promise.all(detallePromises);
        // 3) Insertar registro de difunto (solo uno)
        await prisma.difunto.create({
            data: {
                orden_id: nuevaOrden.id,
                nombres: difunto.nombres,
                fecha_fallecido: new Date(difunto.fecha_fallecido),
                lugar_fallecimiento: difunto.lugar_fallecimiento || null,
                contacto_responsable: difunto.contacto_responsable || null,
                relacion_solicitante: difunto.relacion_solicitante || null,
                notas: difunto.notas || null,
            },
        });
        return nuevaOrden;
    }
    static async listByUser(userId) {
        return prisma.orden.findMany({
            where: { cliente_id: userId },
            include: {
                orden_detalle: true,
                difunto: true,
            },
            orderBy: {
                creado_en: "desc",
            },
        });
    }
    static async changeStatus(id, nuevoEstado) {
        return prisma.orden.update({
            where: { id },
            data: { estado: nuevoEstado },
        });
    }
    static async listAll() {
        return prisma.orden.findMany({
            select: {
                id: true,
                estado: true,
                creado_en: true,
            },
            orderBy: {
                creado_en: "desc",
            },
        });
    }
    static async get(id) {
        return prisma.orden.findUnique({
            where: { id },
            include: {
                orden_detalle: true,
                difunto: true,
                pago: true,
            },
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map