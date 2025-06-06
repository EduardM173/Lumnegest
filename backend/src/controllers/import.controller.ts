// backend/src/controllers/import.controller.ts
import { Request, Response } from 'express';
import { importCsv } from '../services/import.service';

// Debe ser una función nombrada:
export async function uploadCsv(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'Archivo requerido' });
  }
  const adminId = BigInt((req as any).user.id);
  const result = await importCsv(adminId, req.file.path);
  res.status(201).json(result);
}
