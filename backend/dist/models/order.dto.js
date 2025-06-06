"use strict";
// backend/src/models/order.dto.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreateDto = exports.OrdenFastCreateDto = exports.ChangeStatusBodyDto = void 0;
const zod_1 = require("zod");
/**
 * DTO para cambiar estado (PATCH /ordenes/:id/estado)
 */
exports.ChangeStatusBodyDto = zod_1.z.object({
    estado: zod_1.z.enum(["PENDIENTE", "CONFIRMADO", "RECHAZO", "DEVOLUCION"]),
});
/**
 * DTO “rápido” para un solo servicio + difunto
 * (OrdenFastCreateDto)
 */
exports.OrdenFastCreateDto = zod_1.z.object({
    servicioId: zod_1.z.number(), // id del servicio que el usuario eligió
    clienteId: zod_1.z.number(), // id del cliente (usuario logueado)
    servicioPrecioBase: zod_1.z.number(), // precio_base que ya obtuviste en front
    difunto: zod_1.z.object({
        nombres: zod_1.z.string(),
        fecha_fallecido: zod_1.z.string(), // ISO string de fecha
        lugar_fallecimiento: zod_1.z.string().optional(),
        contacto_responsable: zod_1.z.string().optional(),
        relacion_solicitante: zod_1.z.string().optional(),
        notas: zod_1.z.string().optional(),
    }),
});
/**
 * DTO para creación de una orden con múltiples líneas (varios servicios) + difunto.
 *
 * Este es el objeto que espera el endpoint POST /ordenes:
 * {
 *   clienteId:    number,
 *   tipoServicio: string,
 *   total:        number,
 *   lineas: [
 *     { servicioId: number, cantidad: number },
 *     { servicioId: number, cantidad: number },
 *     …
 *   ],
 *   difunto: {
 *     nombres: string,
 *     fecha_fallecido: string,         // ISO String
 *     lugar_fallecimiento?: string,
 *     contacto_responsable?: string,
 *     relacion_solicitante?: string,
 *     notas?: string,
 *   }
 * }
 */
exports.OrderCreateDto = zod_1.z.object({
    clienteId: zod_1.z.number(),
    tipoServicio: zod_1.z.string(),
    total: zod_1.z.number(),
    // Arreglo de líneas (cada línea especifica un servicio y qué cantidad)
    lineas: zod_1.z
        .array(zod_1.z.object({
        servicioId: zod_1.z.number(),
        cantidad: zod_1.z.number().int().min(1),
    }))
        .min(1),
    // Objeto “difunto” (normalmente se crea sólo uno por orden)
    difunto: zod_1.z.object({
        nombres: zod_1.z.string(),
        fecha_fallecido: zod_1.z.string(),
        lugar_fallecimiento: zod_1.z.string().optional(),
        contacto_responsable: zod_1.z.string().optional(),
        relacion_solicitante: zod_1.z.string().optional(),
        notas: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=order.dto.js.map