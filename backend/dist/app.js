"use strict";
// backend/src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const bigintSerializer_1 = require("./utils/bigintSerializer");
// Importación de rutas existentes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const password_routes_1 = __importDefault(require("./routes/password.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const auditoria_routes_1 = __importDefault(require("./routes/auditoria.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const import_routes_1 = __importDefault(require("./routes/import.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const difunto_routes_1 = __importDefault(require("./routes/difunto.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const pago_routes_1 = __importDefault(require("./routes/pago.routes"));
// ← Aquí importa las notificaciones
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const app = (0, express_1.default)();
// ─── 1) CORS y configuración JSON ──────────────────────────────────────────
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.set('json replacer', bigintSerializer_1.bigintReplacer);
console.log('🔍 Endpoints ANTES de montar rutas:');
console.table((0, express_list_endpoints_1.default)(app));
// ─── 2) Logger de petición ─────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`→ Recibido ${req.method} ${req.path}`);
    next();
});
// ─── 3) Servir estáticos de “uploads” (imágenes subidas) ────────────────────
const path_1 = __importDefault(require("path"));
const uploadsPath = path_1.default.join(process.cwd(), 'backend', 'public', 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// ─── 4) Montaje de rutas ────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/clientes', cliente_routes_1.default);
app.use('/api/password', password_routes_1.default);
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/auditoria', auditoria_routes_1.default);
app.use('/api/servicios', service_routes_1.default);
app.use('/api/categorias', categoria_routes_1.default);
app.use('/api/ordenes', order_routes_1.default);
app.use('/api/importaciones', import_routes_1.default);
app.use('/api/difuntos', difunto_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/pagos', pago_routes_1.default);
// ← Monta aquí la ruta de notificaciones
app.use('/api/notificaciones', notification_routes_1.default);
// Ruta pública para el equipo móvil
app.use('/api/public', public_routes_1.default);
console.log('✅ Endpoints DESPUÉS de montar rutas:');
console.table((0, express_list_endpoints_1.default)(app));
// ─── 5) Manejo de rutas no encontradas y errores ────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use((err, _req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor.' });
});
exports.default = app;
//# sourceMappingURL=app.js.map