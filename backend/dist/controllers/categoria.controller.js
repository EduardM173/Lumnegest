"use strict";
// backend/src/controllers/categoria.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.subirImagenCategoria = exports.listServiciosPorCategoria = exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getCategoria = exports.listCategorias = void 0;
const categoria_service_1 = require("../services/categoria.service");
const categoria_dto_1 = require("../models/categoria.dto");
function buildFullImageUrl(req, relativePath) {
    const protocol = req.protocol;
    const host = req.get('host'); // incluye puerto
    return `${protocol}://${host}${relativePath}`;
}
const listCategorias = async (req, res) => {
    const cats = await categoria_service_1.CategoriaService.list();
    // Mapear `imagenUrl` relativo a URL absoluta
    const catsConFullUrl = cats.map((c) => {
        if (c.imagenUrl) {
            return {
                ...c,
                imagenUrl: buildFullImageUrl(req, c.imagenUrl),
            };
        }
        return c;
    });
    res.json(catsConFullUrl);
};
exports.listCategorias = listCategorias;
const getCategoria = async (req, res) => {
    const id = Number(req.params.id);
    const cat = await categoria_service_1.CategoriaService.getById(id);
    if (!cat)
        return res.status(404).json({ error: 'No existe' });
    if (cat.imagenUrl) {
        cat.imagenUrl = buildFullImageUrl(req, cat.imagenUrl);
    }
    res.json(cat);
};
exports.getCategoria = getCategoria;
const createCategoria = async (req, res) => {
    const parsed = categoria_dto_1.CategoryCreateDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const nuevaCat = await categoria_service_1.CategoriaService.create(parsed.data);
    res.status(201).json(nuevaCat);
};
exports.createCategoria = createCategoria;
const updateCategoria = async (req, res) => {
    const parsed = categoria_dto_1.CategoryUpdateDto.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const id = Number(req.params.id);
    const catActualizada = await categoria_service_1.CategoriaService.update(id, parsed.data);
    res.json(catActualizada);
};
exports.updateCategoria = updateCategoria;
const deleteCategoria = async (req, res) => {
    await categoria_service_1.CategoriaService.delete(Number(req.params.id));
    res.status(204).send();
};
exports.deleteCategoria = deleteCategoria;
const listServiciosPorCategoria = async (req, res) => {
    const id = Number(req.params.id);
    const servicios = await categoria_service_1.CategoriaService.getServicios(id);
    res.json(servicios);
};
exports.listServiciosPorCategoria = listServiciosPorCategoria;
const subirImagenCategoria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        // 1) Verificar que exista la categoría
        const catExistente = await categoria_service_1.CategoriaService.getById(id);
        if (!catExistente) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        // 2) Verificar que Multer haya cargado un archivo
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }
        // 3) Construir la URL relativa que guardaremos en BD
        const nombreArchivo = req.file.filename;
        const urlRelativa = `/uploads/categorias/${nombreArchivo}`;
        // 4) Actualizar la categoría con la nueva URL relativa de la imagen
        const categoriaActualizada = await categoria_service_1.CategoriaService.update(id, {
            imagenUrl: urlRelativa,
        });
        // 5) Construir URL absoluta para devolver al cliente
        const fullImageUrl = buildFullImageUrl(req, urlRelativa);
        return res.json({
            message: 'Imagen de categoría actualizada',
            categoria: {
                ...categoriaActualizada,
                imagenUrl: fullImageUrl,
            },
        });
    }
    catch (error) {
        console.error('Error al subir imagen de categoría:', error);
        return res.status(500).json({ error: 'Error al subir la imagen' });
    }
};
exports.subirImagenCategoria = subirImagenCategoria;
//# sourceMappingURL=categoria.controller.js.map