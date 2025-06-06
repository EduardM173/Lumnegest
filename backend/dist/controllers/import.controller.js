"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCsv = uploadCsv;
const import_service_1 = require("../services/import.service");
// Debe ser una función nombrada:
async function uploadCsv(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'Archivo requerido' });
    }
    const adminId = BigInt(req.user.id);
    const result = await (0, import_service_1.importCsv)(adminId, req.file.path);
    res.status(201).json(result);
}
//# sourceMappingURL=import.controller.js.map