import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import bcrypt from 'bcrypt';

// GET /api/usuarios — Obtener todos los usuarios formateados para el frontend
export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuariosRaw = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre_usuario: true,
        email: true,
        rol: true,
        estado: true,
      },
    });

    const usuarios = usuariosRaw.map(u => ({
      id: typeof u.id === 'bigint' ? Number(u.id) : u.id,
      nombre: u.nombre_usuario,
      correo: u.email,
      rol: u.rol,
      estado: u.estado,
    }));

    console.log('Usuarios fetched (formateados):', usuarios);
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// POST /api/usuarios — Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response) => {
  const { nombre_usuario, email, password, rol, estado } = req.body;

  if (!nombre_usuario || !email || !password || !rol || !estado) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  if (!['USUARIO', 'ADMIN'].includes(rol) || !['ACTIVO', 'INACTIVO'].includes(estado)) {
    return res.status(400).json({ error: 'Rol o estado inválido' });
  }

  try {
    const existingUser = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { nombre_usuario }] },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'El email o nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre_usuario,
        email,
        password_hash: hashedPassword,
        rol,
        estado,
      },
      select: {
        id: true,
        nombre_usuario: true,
        email: true,
        rol: true,
        estado: true,
      },
    });

    const respuesta = {
      id: typeof usuario.id === 'bigint' ? Number(usuario.id) : usuario.id,
      nombre: usuario.nombre_usuario,
      correo: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
    };

    console.log('Usuario creado:', usuario);
    return res.status(201).json({ message: 'Usuario creado', usuario: respuesta });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// PATCH /api/usuarios/:id — Actualizar rol y estado del usuario
export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rol, estado } = req.body;

  // ahora permitimos todos los roles existentes
  const allowedRoles = ['USUARIO', 'ADMIN', 'CLIENTE', 'OPERADOR'];
  const allowedEstados = ['ACTIVO', 'INACTIVO'];

  if (
    !id ||
    !rol ||
    !estado ||
    !allowedRoles.includes(rol) ||
    !allowedEstados.includes(estado)
  ) {
    return res.status(400).json({ error: 'ID, rol o estado inválido' });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id, 10) },
      data: { rol, estado },
      select: {
        id: true,
        nombre_usuario: true,
        email: true,
        rol: true,
        estado: true,
      },
    });

    const respuesta = {
      id: typeof usuarioActualizado.id === 'bigint'
        ? Number(usuarioActualizado.id)
        : usuarioActualizado.id,
      nombre: usuarioActualizado.nombre_usuario,
      correo: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
      estado: usuarioActualizado.estado,
    };

    console.log('Usuario actualizado:', usuarioActualizado);
    return res.status(200).json({ message: 'Usuario actualizado', usuario: respuesta });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// DELETE /api/usuarios/:id — Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.usuario.delete({
      where: { id: parseInt(id, 10) },
    });

    console.log('Usuario eliminado:', id);
    return res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
