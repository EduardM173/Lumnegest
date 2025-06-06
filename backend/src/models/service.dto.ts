import { z } from 'zod';

/**
 * DTO para creación de un servicio.
 */
export const ServiceCreateDto = z.object({
  nombre:       z.string().min(3).max(100),
  descripcion:  z.string().optional(),
  precio_base:  z.coerce.number().nonnegative(),
  categoriaId:  z.coerce.number().int().positive().optional(),
});

/**
 * DTO para actualización parcial de un servicio.
 */
export const ServiceUpdateDto = ServiceCreateDto.partial();

/**
 * DTO para filtrar la lista de servicios.
 */
export const ServiceFilterDto = z.object({
  nombre:      z.string().optional(),
  minPrecio:   z.coerce.number().nonnegative().optional(),
  maxPrecio:   z.coerce.number().nonnegative().optional(),
  categoriaId: z.coerce.number().int().positive().optional(),
});

export type IServiceCreate = z.infer<typeof ServiceCreateDto>;
export type IServiceUpdate = z.infer<typeof ServiceUpdateDto>;
export type IServiceFilter = z.infer<typeof ServiceFilterDto>;
