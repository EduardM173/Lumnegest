"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepository = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
class CategoriaRepository {
    static list() {
        return prismaClient_1.default.categoria.findMany();
    }
    static findById(id) {
        return prismaClient_1.default.categoria.findUnique({ where: { id } });
    }
    static create(data) {
        return prismaClient_1.default.categoria.create({ data });
    }
    static update(id, data) {
        return prismaClient_1.default.categoria.update({ where: { id }, data });
    }
    static remove(id) {
        return prismaClient_1.default.categoria.delete({ where: { id } });
    }
}
exports.CategoriaRepository = CategoriaRepository;
//# sourceMappingURL=categoria.repository.js.map