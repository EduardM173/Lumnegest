"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFilterDto = exports.ServiceUpdateDto = exports.ServiceCreateDto = void 0;
const zod_1 = require("zod");
/**
 * DTO para creación de un servicio.
 */
exports.ServiceCreateDto = zod_1.z.object({
    nombre: zod_1.z.string().min(3).max(100),
    descripcion: zod_1.z.string().optional(),
    precio_base: zod_1.z.coerce.number().nonnegative(),
    categoriaId: zod_1.z.coerce.number().int().positive().optional(),
});
/**
 * DTO para actualización parcial de un servicio.
 */
exports.ServiceUpdateDto = exports.ServiceCreateDto.partial();
/**
 * DTO para filtrar la lista de servicios.
 */
exports.ServiceFilterDto = zod_1.z.object({
    nombre: zod_1.z.string().optional(),
    minPrecio: zod_1.z.coerce.number().nonnegative().optional(),
    maxPrecio: zod_1.z.coerce.number().nonnegative().optional(),
    categoriaId: zod_1.z.coerce.number().int().positive().optional(),
});
//# sourceMappingURL=service.dto.js.map