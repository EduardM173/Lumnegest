"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const app_1 = __importDefault(require("./app"));
/**
 * Render (y otras plataformas PaaS) inyectan la variable PORT en el entorno.
 * Si no existe, caerá a 3001 (útil para desarrollo local).
 */
const PORT = parseInt(process.env.PORT ?? '3001', 10);
console.log('🔍 RUTAS ACTIVAS:');
console.table((0, express_list_endpoints_1.default)(app_1.default));
/**
 * Al omitir el segundo parámetro (host), Express se enlaza por defecto a 0.0.0.0,
 * que es lo que Render necesita para exponer el puerto públicamente.
 */
app_1.default.listen(PORT, () => {
    console.log(`🚀 Backend escuchando en el puerto ${PORT}`);
});
//# sourceMappingURL=server.js.map