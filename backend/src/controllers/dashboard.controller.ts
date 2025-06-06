import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import {
  DashboardMetricsDto,
  VelatoriosMetricsDto,
  InventarioMetricsDto,
  ServiciosMetricsDto,
  UsuarioMetricsDto,
  ReportesMetricsDto,
} from '../models/dashboard.dto';

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getMetrics();
    const validatedMetrics = DashboardMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving dashboard metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas del dashboard' });
  }
};

export const getVelatoriosMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getVelatoriosMetrics();
    const validatedMetrics = VelatoriosMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving velatorios metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas de velatorios' });
  }
};

export const getInventarioMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getInventarioMetrics();
    const validatedMetrics = InventarioMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving inventario metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas de inventario' });
  }
};

export const getServiciosMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getServiciosMetrics();
    const validatedMetrics = ServiciosMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving servicios metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas de servicios' });
  }
};

export const getUsuarioMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getUsuarioMetrics();
    const validatedMetrics = UsuarioMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving usuario metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas de usuarios' });
  }
};

export const getReportesMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await DashboardService.getReportesMetrics();
    const validatedMetrics = ReportesMetricsDto.parse(metrics);
    res.json({ data: validatedMetrics });
  } catch (err: any) {
    console.error('Error retrieving reportes metrics:', err);
    res.status(500).json({ error: err.message || 'Error al obtener métricas de reportes' });
  }
};