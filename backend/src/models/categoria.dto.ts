import { z } from 'zod';

export const CategoryCreateDto = z.object({
  nombre: z.string().min(1).max(100),
  icono: z.string().optional(),
});
export const CategoryUpdateDto = CategoryCreateDto.partial();

export type ICategoryCreate = z.infer<typeof CategoryCreateDto>;
export type ICategoryUpdate = z.infer<typeof CategoryUpdateDto>;
