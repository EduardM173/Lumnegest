"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesMetricsDto = exports.UsuarioMetricsDto = exports.ServiciosMetricsDto = exports.InventarioMetricsDto = exports.VelatoriosMetricsDto = exports.DashboardMetricsDto = void 0;
const zod_1 = require("zod");
// Base Metric Schema
const MetricSchema = zod_1.z.object({
    month: zod_1.z.string(),
    value: zod_1.z.number(),
});
// Velatorios Metric Schemas
const VelatoriosMonthMetricSchema = zod_1.z.object({
    month: zod_1.z.string(),
    count: zod_1.z.number(),
});
const VelatoriosDayMetricSchema = zod_1.z.object({
    day: zod_1.z.string(),
    count: zod_1.z.number(),
});
// Inventario Metric Schemas
const InventarioMonthMetricSchema = zod_1.z.object({
    month: zod_1.z.string(),
    count: zod_1.z.number(),
});
const InventarioWeekMetricSchema = zod_1.z.object({
    week: zod_1.z.string(),
    count: zod_1.z.number(),
});
// Servicios Metric Schemas
const ServiciosMonthMetricSchema = zod_1.z.object({
    month: zod_1.z.string(),
    service: zod_1.z.string(),
    count: zod_1.z.number(),
});
const ServiciosWeekMetricSchema = zod_1.z.object({
    week: zod_1.z.string(),
    service: zod_1.z.string(),
    count: zod_1.z.number(),
});
// Usuario Metric Schema
const UsuarioMetricSchema = zod_1.z.object({
    service: zod_1.z.string(),
    count: zod_1.z.number(),
});
// Reportes Service Schema
const ReportesServiceSchema = zod_1.z.object({
    name: zod_1.z.string(),
    count: zod_1.z.number(),
    revenue: zod_1.z.number(),
});
// DTOs
exports.DashboardMetricsDto = zod_1.z.object({
    activeServices: zod_1.z.number(),
    monthlyRevenue: zod_1.z.string(), // Matches dashboard.ts
    occupiedFunerals: zod_1.z.string(),
    services: zod_1.z.array(MetricSchema),
    revenue: zod_1.z.array(MetricSchema),
    obituaries: zod_1.z.array(MetricSchema),
});
exports.VelatoriosMetricsDto = zod_1.z.object({
    byMonth: zod_1.z.array(VelatoriosMonthMetricSchema),
    byDay: zod_1.z.array(VelatoriosDayMetricSchema),
});
exports.InventarioMetricsDto = zod_1.z.object({
    byMonth: zod_1.z.array(InventarioMonthMetricSchema),
    byWeek: zod_1.z.array(InventarioWeekMetricSchema),
});
exports.ServiciosMetricsDto = zod_1.z.object({
    byMonth: zod_1.z.array(ServiciosMonthMetricSchema),
    byWeek: zod_1.z.array(ServiciosWeekMetricSchema),
});
exports.UsuarioMetricsDto = zod_1.z.object({
    byService: zod_1.z.array(UsuarioMetricSchema),
});
exports.ReportesMetricsDto = zod_1.z.object({
    services: zod_1.z.array(ReportesServiceSchema),
});
//# sourceMappingURL=dashboard.dto.js.map