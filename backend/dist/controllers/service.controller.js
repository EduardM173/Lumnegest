"use strict";
// backend/src/controllers/service.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.subirImagenServicio = exports.remove = exports.update = exports.create = exports.getOne = exports.list = void 0;
const service_dto_1 = require("../models/service.dto");
const service_service_1 = require("../services/service.service");
function buildFullImageUrl(req, relativePath) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}${relativePath}`;
}
const list = async (req, res) => {
    const parsed = service_dto_1.ServiceFilterDto.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json(parsed.error);
    }
    const items = await service_service_1.ServiceService.list(parsed.data);
    // Convertir imagenUrl a URL absoluta
    const itemsWithFullUrl = items.map((s) => {
        if (s.imagenUrl) {
            return { ...s, imagenUrl: buildFullImageUrl(req, s.imagenUrl) };
        }
        return s;
    });
    res.json(itemsWithFullUrl);
};
exports.list = list;
const getOne = async (req, res) => {
    const item = await service_service_1.ServiceService.find(BigInt(req.params.id));
    if (!item)
        return res.status(404).json({ error: 'No existe servicio' });
    if (item.imagenUrl) {
        item.imagenUrl = buildFullImageUrl(req, item.imagenUrl);
    }
    res.json(item);
};
exports.getOne = getOne;
const create = async (req, res) => {
    const parsed = service_dto_1.ServiceCreateDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    try {
        const newItem = await service_service_1.ServiceService.create(parsed.data);
        res.status(201).json(newItem);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const parsed = service_dto_1.ServiceUpdateDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    try {
        const updated = await service_service_1.ServiceService.update(BigInt(req.params.id), parsed.data);
        res.json(updated);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    await service_service_1.ServiceService.inactivate(BigInt(req.params.id));
    res.status(204).send();
};
exports.remove = remove;
// ─── Nuevo: subirImagenServicio ────────────────────────────────────────────
// Recibe Multer en `req.file` y actualiza `imagenUrl`
const subirImagenServicio = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        // 1) Verificar que exista el servicio
        const servExistente = await service_service_1.ServiceService.find(id);
        if (!servExistente) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        // 2) Verificar que Multer haya cargado un archivo
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }
        // 3) Construir ruta relativa a guardar en BD
        const nombreArchivo = req.file.filename;
        const urlRelativa = `/uploads/servicios/${nombreArchivo}`;
        // Ejemplo: "/uploads/servicios/serv-123456.png"
        // 4) Actualizar el servicio con la nueva imagenUrl
        const servicioActualizado = await service_service_1.ServiceService.update(id, {
            imagenUrl: urlRelativa,
        });
        // 5) Convertir a URL absoluta
        const fullImageUrl = buildFullImageUrl(req, urlRelativa);
        return res.json({
            message: 'Imagen de servicio actualizada',
            servicio: {
                ...servicioActualizado,
                imagenUrl: fullImageUrl,
            },
        });
    }
    catch (error) {
        console.error('Error al subir imagen de servicio:', error);
        return res.status(500).json({ error: 'Error al subir la imagen' });
    }
};
exports.subirImagenServicio = subirImagenServicio;
//# sourceMappingURL=service.controller.js.map