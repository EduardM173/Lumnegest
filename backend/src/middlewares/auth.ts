//backend/src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  id: string; // ID como string, evitando problemas con BigInt
  rol: 'CLIENTE' | 'OPERADOR' | 'ADMIN';
}

/* ───────── Verifica token y adjunta req.user ───────── */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido.' });
  }

  try {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Adjuntar el usuario decodificado al objeto req
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

/* ───────── Solo permite ciertos roles ───────── */
export const requireRol =
  (roles: JwtPayload['rol'][]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;

    if (!user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    if (!roles.includes(user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }

    next();
  };
