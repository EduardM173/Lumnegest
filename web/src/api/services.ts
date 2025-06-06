// web/src/api/services.ts

import api from './axiosInstance';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Categoria {
  id: string;
  nombre: string;
  imagenUrl?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  activo: boolean;
  categoriaId?: string;
  imagenUrl?: string;
}

// ── Categorías ───────────────────────────────────────────────────────────────

export const getCategorias = () =>
  api.get<Categoria[]>('/categorias').then(r => r.data);

export const getCategoriaById = (id: string) =>
  api.get<Categoria>(`/categorias/${id}`).then(r => r.data);

export const createCategoria = (d: Omit<Categoria, 'id'>) =>
  api.post<Categoria>('/categorias', d).then(r => r.data);

export const updateCategoria = (id: string, d: Partial<Categoria>) =>
  api.put<Categoria>(`/categorias/${id}`, d).then(r => r.data);

export const deleteCategoria = (id: string) =>
  api.delete(`/categorias/${id}`);

export const uploadCategoriaImage = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('imagen', file);
  return api
    .patch<Categoria>(`/categorias/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(r => r.data);
};

// ── Servicios ────────────────────────────────────────────────────────────────

export const getServicios = (categoriaId?: string) =>
  api
    .get<Servicio[]>('/servicios', {
      params: categoriaId ? { categoriaId } : {},
    })
    .then(r => r.data);

export const getServicioById = (id: string) =>
  api.get<Servicio>(`/servicios/${id}`).then(r => r.data);

export const createServicio = (d: Omit<Servicio, 'id' | 'activo' | 'imagenUrl'>) =>
  api.post<Servicio>('/servicios', d).then(r => r.data);

export const updateServicio = (id: string, d: Partial<Servicio>) =>
  api.patch<Servicio>(`/servicios/${id}`, d).then(r => r.data);

export const deleteServicio = (id: string) =>
  api.delete(`/servicios/${id}`);

// Subir o actualizar la imagen de un servicio existente
export const uploadServicioImage = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('imagen', file);
  return api
    .patch<Servicio>(`/servicios/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(r => r.data);
};
