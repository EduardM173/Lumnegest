// web/src/api/orders.ts
import api from "./axiosInstance";

export type Estado = "PENDIENTE" | "PROCESO" | "FINALIZADO";

export interface Difunto {
  nombres: string;
  fecha_fallecido: string; // ISO YYYY-MM-DD
}

export interface Orden {
  id: string;
  estado: Estado;
  total: number;
  // Agrega más campos si los necesitas (difunto, servicio, etc.)
}

/**
 * Ahora la ruta “rápida” es POST /api/ordenes/contratar
 * payload = { servicioId, clienteId, difunto: { nombres, fecha_fallecido } }
 */
export const contratarServicio = (body: {
  servicioId: number;
  clienteId: number;
  difunto: Difunto;
}) => api.post<Orden>("/ordenes/contratar", body).then((r) => r.data);

export const misOrdenes = () =>
  api.get<Orden[]>("/ordenes/mias").then((r) => r.data);

export const seguimientoOrden = (id: string) =>
  api.get<Orden>(`/ordenes/${id}`).then((r) => r.data);
