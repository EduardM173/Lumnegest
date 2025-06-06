"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportesMetrics = exports.getUsuarioMetrics = exports.getServiciosMetrics = exports.getInventarioMetrics = exports.getVelatoriosMetrics = exports.getMetrics = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const dashboard_dto_1 = require("../models/dashboard.dto");
const getMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getMetrics();
        const validatedMetrics = dashboard_dto_1.DashboardMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving dashboard metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas del dashboard' });
    }
};
exports.getMetrics = getMetrics;
const getVelatoriosMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getVelatoriosMetrics();
        const validatedMetrics = dashboard_dto_1.VelatoriosMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving velatorios metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas de velatorios' });
    }
};
exports.getVelatoriosMetrics = getVelatoriosMetrics;
const getInventarioMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getInventarioMetrics();
        const validatedMetrics = dashboard_dto_1.InventarioMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving inventario metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas de inventario' });
    }
};
exports.getInventarioMetrics = getInventarioMetrics;
const getServiciosMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getServiciosMetrics();
        const validatedMetrics = dashboard_dto_1.ServiciosMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving servicios metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas de servicios' });
    }
};
exports.getServiciosMetrics = getServiciosMetrics;
const getUsuarioMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getUsuarioMetrics();
        const validatedMetrics = dashboard_dto_1.UsuarioMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving usuario metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas de usuarios' });
    }
};
exports.getUsuarioMetrics = getUsuarioMetrics;
const getReportesMetrics = async (req, res) => {
    try {
        const metrics = await dashboard_service_1.DashboardService.getReportesMetrics();
        const validatedMetrics = dashboard_dto_1.ReportesMetricsDto.parse(metrics);
        res.json({ data: validatedMetrics });
    }
    catch (err) {
        console.error('Error retrieving reportes metrics:', err);
        res.status(500).json({ error: err.message || 'Error al obtener métricas de reportes' });
    }
};
exports.getReportesMetrics = getReportesMetrics;
//# sourceMappingURL=dashboard.controller.js.map