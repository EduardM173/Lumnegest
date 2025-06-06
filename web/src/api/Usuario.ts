import axios from './axiosInstance';

export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: 'USUARIO' | 'ADMIN';
  estado: 'ACTIVO' | 'INACTIVO';
}

/** Obtiene todos los usuarios (GET /usuarios) */
export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    const response = await axios.get<Usuario[]>('/usuarios', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener usuarios');
  }
}

/** Obtiene un usuario por ID (GET /usuarios/:id) */
export async function getUsuarioById(id: number): Promise<Usuario> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    const response = await axios.get<Usuario>(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw new Error(error.response?.data?.error || `Error al obtener usuario ${id}`);
  }
}

/** Crea un nuevo usuario (POST /usuarios) */
export async function crearUsuario(usuario: {
  nombre_usuario: string;
  email: string;
  password: string;
  rol: 'USUARIO' | 'ADMIN';
  estado: 'ACTIVO' | 'INACTIVO';
}): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    await axios.post('/usuarios', usuario, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    throw new Error(error.response?.data?.error || 'Error al crear usuario');
  }
}

/** Actualiza un usuario por ID (PATCH /usuarios/:id) */
export async function actualizarUsuario(id: number, datos: { rol: string; estado: string }): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    await axios.patch(`/usuarios/${id}`, datos, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    throw new Error(error.response?.data?.error || `Error al actualizar usuario ${id}`);
  }
}

/** Elimina un usuario por ID (DELETE /usuarios/:id) */
export async function eliminarUsuario(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    await axios.delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw new Error(error.response?.data?.error || `Error al eliminar usuario ${id}`);
  }
}

/** Cambia el estado de un usuario por ID (PUT /usuarios/:id/estado) */
export async function cambiarEstadoUsuario(id: number, estado: 'ACTIVO' | 'INACTIVO'): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    await axios.put(`/usuarios/${id}/estado`, { estado }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error(`Error al cambiar estado del usuario ${id}:`, error);
    throw new Error(error.response?.data?.error || `Error al cambiar estado del usuario ${id}`);
  }
}