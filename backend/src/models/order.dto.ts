// backend/src/models/order.dto.ts

import { z } from "zod";

/**
 * DTO para cambiar estado (PATCH /ordenes/:id/estado)
 */
export const ChangeStatusBodyDto = z.object({
  estado: z.enum(["PENDIENTE", "CONFIRMADO", "RECHAZO", "DEVOLUCION"]),
});
export type ChangeStatusBodyDtoType = z.infer<typeof ChangeStatusBodyDto>;

/**
 * DTO “rápido” para un solo servicio + difunto
 * (OrdenFastCreateDto)
 */
export const OrdenFastCreateDto = z.object({
  servicioId: z.number(),            // id del servicio que el usuario eligió
  clienteId: z.number(),             // id del cliente (usuario logueado)
  servicioPrecioBase: z.number(),    // precio_base que ya obtuviste en front
  difunto: z.object({
    nombres: z.string(),
    fecha_fallecido: z.string(),     // ISO string de fecha
    lugar_fallecimiento: z.string().optional(),
    contacto_responsable: z.string().optional(),
    relacion_solicitante: z.string().optional(),
    notas: z.string().optional(),
  }),
});
export type OrdenFastCreateDtoType = z.infer<typeof OrdenFastCreateDto>;

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
export const OrderCreateDto = z.object({
  clienteId: z.number(),
  tipoServicio: z.string(),
  total: z.number(),

  // Arreglo de líneas (cada línea especifica un servicio y qué cantidad)
  lineas: z
    .array(
      z.object({
        servicioId: z.number(),
        cantidad: z.number().int().min(1),
      })
    )
    .min(1),

  // Objeto “difunto” (normalmente se crea sólo uno por orden)
  difunto: z.object({
    nombres: z.string(),
    fecha_fallecido: z.string(),
    lugar_fallecimiento: z.string().optional(),
    contacto_responsable: z.string().optional(),
    relacion_solicitante: z.string().optional(),
    notas: z.string().optional(),
  }),
});
export type OrderCreateDtoType = z.infer<typeof OrderCreateDto>;
