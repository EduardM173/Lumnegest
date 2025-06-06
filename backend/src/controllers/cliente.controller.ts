// backend/src/controllers/cliente.controller.ts
import { RequestHandler } from 'express';
import prisma from '../config/prismaClient';
import bcrypt from 'bcrypt';

export const crearCliente: RequestHandler = async (req, res) => {
  const {
    nombre_usuario,
    email,
    password,
    nombres,
    apellidos,
    telefono,
    direccion,
  } = req.body;

  // 1) Campos obligatorios
  if (!nombre_usuario || !email || !password || !nombres || !apellidos) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    // 2) Verificar existencia de email o usuario
    const existe = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { nombre_usuario }] },
    });
    if (existe) {
      return res
        .status(409)
        .json({ error: 'Email o nombre de usuario ya registrados.' });
    }

    // 3) Hash de la contraseña
    const hash = await bcrypt.hash(password, 10);

    // 4) Crear usuario + perfil_cliente
    const usuario = await prisma.usuario.create({
      data: {
        nombre_usuario,
        email,
        password_hash: hash,
        rol: 'CLIENTE',
        perfil_cliente: {
          create: { nombres, apellidos, telefono, direccion },
        },
      },
      include: { perfil_cliente: true },
    });

    // 5) Extraer perfil y pasar todos los BigInt a string
    const perfil = usuario.perfil_cliente!;
    return res.status(201).json({
      message: 'Cliente creado',
      usuario: {
        id: usuario.id.toString(),
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
        perfil_cliente: {
          usuario_id: perfil.usuario_id.toString(),
          nombres: perfil.nombres,
          apellidos: perfil.apellidos,
          telefono: perfil.telefono,
          direccion: perfil.direccion,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: 'Error interno al registrar cliente.' });
  }
};
