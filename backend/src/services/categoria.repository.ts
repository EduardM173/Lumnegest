import prisma from '../config/prismaClient';
import { ICategoryCreate, ICategoryUpdate } from '../models/categoria.dto';

export class CategoriaRepository {
  static list() {
    return prisma.categoria.findMany();
  }
  static findById(id: number) {
    return prisma.categoria.findUnique({ where: { id } });
  }
  static create(data: ICategoryCreate) {
    return prisma.categoria.create({ data });
  }
  static update(id: number, data: ICategoryUpdate) {
    return prisma.categoria.update({ where: { id }, data });
  }
  static remove(id: number) {
    return prisma.categoria.delete({ where: { id } });
  }
}
