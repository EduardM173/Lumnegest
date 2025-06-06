"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUpdateDto = exports.CategoryCreateDto = void 0;
const zod_1 = require("zod");
exports.CategoryCreateDto = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(100),
    icono: zod_1.z.string().optional(),
});
exports.CategoryUpdateDto = exports.CategoryCreateDto.partial();
//# sourceMappingURL=categoria.dto.js.map