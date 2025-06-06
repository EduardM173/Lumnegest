import axios from './axiosInstance';

export interface User {
  id: number;
  nombre_usuario: string;
}

export interface AuditLog {
  id: number;
  user: string;
  tabla: string;
  operacion: string;
  realizado_en: string;
}

interface AuditResponse {
  logs: AuditLog[];
  total: number;
}

/** Obtiene todos los usuarios (GET /usuarios) */
export async function getUsuarios(): Promise<User[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    const response = await axios.get<User[]>('/usuarios', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    const errMsg = error.response?.data?.error || 'Error al cargar los usuarios';
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Sesión no autorizada');
    }
    throw new Error(errMsg);
  }
}

/** Obtiene los registros de auditoría con filtros y paginación (GET /auditoria) */
export async function getAuditLogs(params: {
  page: number;
  limit: number;
  user?: string;
  tabla?: string;
  date?: string;
}): Promise<AuditResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    const response = await axios.get<AuditResponse>('/auditoria', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener registros de auditoría:', error);
    const errMsg = error.response?.data?.error || 'Error al cargar los registros de auditoría';
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Sesión no autorizada');
    }
    throw new Error(errMsg);
  }
}