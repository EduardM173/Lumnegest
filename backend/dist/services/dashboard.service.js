"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
class DashboardService {
    static async getMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            // Count active services
            const activeServices = await prisma.orden.count({
                where: {
                    estado: 'ACTIVO',
                    creado_en: { gte: startDate, lte: endDate },
                },
            });
            // Calculate total revenue
            const totalRevenue = await prisma.pago.aggregate({
                _sum: { monto: true },
                where: {
                    pagado_en: { gte: startDate, lte: endDate },
                    estado: 'COMPLETADO',
                },
            });
            // Group services by month
            const servicesByMonthRaw = await prisma.orden_detalle.findMany({
                select: { orden: { select: { creado_en: true } } },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                },
                orderBy: [{ orden: { creado_en: 'asc' } }],
            });
            const servicesByMonth = servicesByMonthRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const month = (0, date_fns_1.format)(item.orden.creado_en, 'MMM');
                    acc[month] = (acc[month] || 0) + 1;
                }
                return acc;
            }, {});
            // Group revenue by month
            const revenueByMonth = await prisma.pago.groupBy({
                by: ['pagado_en'],
                _sum: { monto: true },
                where: {
                    pagado_en: { gte: startDate, lte: endDate },
                    estado: 'COMPLETADO',
                },
                orderBy: [{ pagado_en: 'asc' }],
            });
            // Group obituaries by month
            const obituariesByMonth = await prisma.obituario.groupBy({
                by: ['creado_en'],
                _count: { id: true },
                where: {
                    creado_en: { gte: startDate, lte: endDate },
                    publicado: true,
                },
                orderBy: [{ creado_en: 'asc' }],
            });
            // Count occupied velatorios
            const occupiedFunerals = await prisma.orden_detalle.count({
                where: {
                    orden: {
                        estado: 'ACTIVO',
                        creado_en: { gte: startDate, lte: endDate },
                    },
                    servicio: {
                        categoria: { nombre: { contains: 'Velatorio', mode: 'insensitive' } },
                    },
                },
            });
            return {
                activeServices,
                monthlyRevenue: String(Number(totalRevenue._sum.monto) || 0),
                occupiedFunerals: String(occupiedFunerals),
                services: Object.entries(servicesByMonth).map(([month, value]) => ({
                    month,
                    value,
                })),
                revenue: revenueByMonth.map((item) => ({
                    month: item.pagado_en ? (0, date_fns_1.format)(item.pagado_en, 'MMM') : 'Unknown',
                    value: Number(item._sum.monto) || 0,
                })),
                obituaries: obituariesByMonth.map((item) => ({
                    month: item.creado_en ? (0, date_fns_1.format)(item.creado_en, 'MMM') : 'Unknown',
                    value: item._count?.id ?? 0,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            throw new Error('Failed to fetch dashboard metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    static async getVelatoriosMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            // By month
            const byMonthRaw = await prisma.orden_detalle.findMany({
                select: { orden: { select: { creado_en: true } } },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                    servicio: {
                        categoria: { nombre: { contains: 'Velatorio', mode: 'insensitive' } },
                    },
                },
                orderBy: [{ orden: { creado_en: 'asc' } }],
            });
            const byMonth = byMonthRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const month = (0, date_fns_1.format)(item.orden.creado_en, 'MMM');
                    acc[month] = (acc[month] || 0) + 1;
                }
                return acc;
            }, {});
            // By day
            const byDayRaw = await prisma.orden_detalle.findMany({
                select: { orden: { select: { creado_en: true } } },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                    servicio: {
                        categoria: { nombre: { contains: 'Velatorio', mode: 'insensitive' } },
                    },
                },
                orderBy: [{ orden: { creado_en: 'asc' } }],
            });
            const byDay = byDayRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const day = (0, date_fns_1.format)(item.orden.creado_en, 'EEEE');
                    acc[day] = (acc[day] || 0) + 1;
                }
                return acc;
            }, {});
            return {
                byMonth: Object.entries(byMonth).map(([month, count]) => ({
                    month,
                    count,
                })),
                byDay: Object.entries(byDay).map(([day, count]) => ({
                    day,
                    count,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching velatorios metrics:', error);
            throw new Error('Failed to fetch velatorios metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    static async getServiciosMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            // By month
            const byMonthRaw = await prisma.orden_detalle.findMany({
                select: {
                    servicio_id: true,
                    orden: { select: { creado_en: true } },
                },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                },
                orderBy: [
                    { orden: { creado_en: 'asc' } },
                    { servicio_id: 'asc' },
                ],
            });
            const byMonth = byMonthRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const month = (0, date_fns_1.format)(item.orden.creado_en, 'MMM');
                    const key = `${month}-${item.servicio_id}`;
                    acc[key] = (acc[key] || 0) + 1;
                }
                return acc;
            }, {});
            // By week
            const byWeekRaw = await prisma.orden_detalle.findMany({
                select: {
                    servicio_id: true,
                    orden: { select: { creado_en: true } },
                },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                },
                orderBy: [
                    { orden: { creado_en: 'asc' } },
                    { servicio_id: 'asc' },
                ],
            });
            const byWeek = byWeekRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const week = (0, date_fns_1.format)(item.orden.creado_en, "'Sem' I");
                    const key = `${week}-${item.servicio_id}`;
                    acc[key] = (acc[key] || 0) + 1;
                }
                return acc;
            }, {});
            // Fetch service names
            const serviceIds = [...new Set([
                    ...byMonthRaw.map((item) => item.servicio_id),
                    ...byWeekRaw.map((item) => item.servicio_id),
                ])];
            const services = await prisma.servicio.findMany({
                where: { id: { in: serviceIds } },
                select: { id: true, nombre: true },
            });
            const serviceMap = new Map(services.map((s) => [s.id, s.nombre]));
            return {
                byMonth: Object.entries(byMonth).map(([key, count]) => {
                    const [month, servicio_id] = key.split('-');
                    return {
                        month,
                        service: serviceMap.get(BigInt(servicio_id)) || 'Unknown',
                        count,
                    };
                }),
                byWeek: Object.entries(byWeek).map(([key, count]) => {
                    const [week, servicio_id] = key.split('-');
                    return {
                        week,
                        service: serviceMap.get(BigInt(servicio_id)) || 'Unknown',
                        count,
                    };
                }),
            };
        }
        catch (error) {
            console.error('Error fetching servicios metrics:', error);
            throw new Error('Failed to fetch servicios metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    static async getInventarioMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            // By month
            const byMonthRaw = await prisma.orden_detalle.findMany({
                select: { orden: { select: { creado_en: true } } },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                    servicio: {
                        categoria: { nombre: { contains: 'Inventario', mode: 'insensitive' } },
                    },
                },
                orderBy: [{ orden: { creado_en: 'asc' } }],
            });
            const byMonth = byMonthRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const month = (0, date_fns_1.format)(item.orden.creado_en, 'MMM');
                    acc[month] = (acc[month] || 0) + 1;
                }
                return acc;
            }, {});
            // By week
            const byWeekRaw = await prisma.orden_detalle.findMany({
                select: { orden: { select: { creado_en: true } } },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                    servicio: {
                        categoria: { nombre: { contains: 'Inventario', mode: 'insensitive' } },
                    },
                },
                orderBy: [{ orden: { creado_en: 'asc' } }],
            });
            const byWeek = byWeekRaw.reduce((acc, item) => {
                if (item.orden.creado_en) {
                    const week = (0, date_fns_1.format)(item.orden.creado_en, "'Sem' I");
                    acc[week] = (acc[week] || 0) + 1;
                }
                return acc;
            }, {});
            return {
                byMonth: Object.entries(byMonth).map(([month, count]) => ({
                    month,
                    count,
                })),
                byWeek: Object.entries(byWeek).map(([week, count]) => ({
                    week,
                    count,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching inventario metrics:', error);
            throw new Error('Failed to fetch inventario metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    static async getUsuarioMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            const byService = await prisma.orden_detalle.groupBy({
                by: ['servicio_id'],
                _count: { id: true },
                where: {
                    orden: {
                        creado_en: { gte: startDate, lte: endDate },
                        cliente_id: { not: undefined },
                    },
                },
                orderBy: [{ _count: { id: 'desc' } }],
            });
            const serviceIds = byService.map((item) => item.servicio_id);
            const services = await prisma.servicio.findMany({
                where: { id: { in: serviceIds } },
                select: { id: true, nombre: true },
            });
            const serviceMap = new Map(services.map((s) => [s.id, s.nombre]));
            return {
                byService: byService.map((item) => ({
                    service: serviceMap.get(item.servicio_id) || 'Unknown',
                    count: (item._count && typeof item._count === 'object' && 'id' in item._count) ? item._count.id ?? 0 : 0,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching usuario metrics:', error);
            throw new Error('Failed to fetch usuario metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    static async getReportesMetrics() {
        const year = 2025;
        const startDate = (0, date_fns_1.startOfYear)(new Date(year, 0, 1));
        const endDate = (0, date_fns_1.endOfYear)(new Date(year, 0));
        try {
            const services = await prisma.orden_detalle.groupBy({
                by: ['servicio_id'],
                _count: { id: true },
                _sum: { subtotal: true },
                where: {
                    orden: { creado_en: { gte: startDate, lte: endDate } },
                },
                orderBy: [{ _count: { id: 'desc' } }],
            });
            const serviceIds = services.map((item) => item.servicio_id);
            const serviceDetails = await prisma.servicio.findMany({
                where: { id: { in: serviceIds } },
                select: { id: true, nombre: true },
            });
            const serviceMap = new Map(serviceDetails.map((s) => [s.id, s.nombre]));
            return {
                services: services.map((item) => ({
                    name: serviceMap.get(item.servicio_id) || 'Unknown',
                    count: item._count?.id ?? 0,
                    revenue: Number(item._sum.subtotal) || 0,
                })),
            };
        }
        catch (error) {
            console.error('Error fetching reportes metrics:', error);
            throw new Error('Failed to fetch reportes metrics');
        }
        finally {
            await prisma.$disconnect();
        }
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map