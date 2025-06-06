import { z } from 'zod';

// Base Metric Schema
const MetricSchema = z.object({
  month: z.string(),
  value: z.number(),
});

// Velatorios Metric Schemas
const VelatoriosMonthMetricSchema = z.object({
  month: z.string(),
  count: z.number(),
});

const VelatoriosDayMetricSchema = z.object({
  day: z.string(),
  count: z.number(),
});

// Inventario Metric Schemas
const InventarioMonthMetricSchema = z.object({
  month: z.string(),
  count: z.number(),
});

const InventarioWeekMetricSchema = z.object({
  week: z.string(),
  count: z.number(),
});

// Servicios Metric Schemas
const ServiciosMonthMetricSchema = z.object({
  month: z.string(),
  service: z.string(),
  count: z.number(),
});

const ServiciosWeekMetricSchema = z.object({
  week: z.string(),
  service: z.string(),
  count: z.number(),
});

// Usuario Metric Schema
const UsuarioMetricSchema = z.object({
  service: z.string(),
  count: z.number(),
});

// Reportes Service Schema
const ReportesServiceSchema = z.object({
  name: z.string(),
  count: z.number(),
  revenue: z.number(),
});

// DTOs
export const DashboardMetricsDto = z.object({
  activeServices: z.number(),
  monthlyRevenue: z.string(), // Matches dashboard.ts
  occupiedFunerals: z.string(),
  services: z.array(MetricSchema),
  revenue: z.array(MetricSchema),
  obituaries: z.array(MetricSchema),
});

export const VelatoriosMetricsDto = z.object({
  byMonth: z.array(VelatoriosMonthMetricSchema),
  byDay: z.array(VelatoriosDayMetricSchema),
});

export const InventarioMetricsDto = z.object({
  byMonth: z.array(InventarioMonthMetricSchema),
  byWeek: z.array(InventarioWeekMetricSchema),
});

export const ServiciosMetricsDto = z.object({
  byMonth: z.array(ServiciosMonthMetricSchema),
  byWeek: z.array(ServiciosWeekMetricSchema),
});

export const UsuarioMetricsDto = z.object({
  byService: z.array(UsuarioMetricSchema),
});

export const ReportesMetricsDto = z.object({
  services: z.array(ReportesServiceSchema),
});