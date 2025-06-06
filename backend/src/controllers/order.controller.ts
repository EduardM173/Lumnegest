import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  OrderCreateDto,
  ChangeStatusBodyDto,
  OrdenFastCreateDto,
} from "../models/order.dto";

import { OrderService } from "../services/order.service";
import { sendOrderConfirmation } from "../services/mailer";

const prisma = new PrismaClient();

/* ------------------------- helpers ------------------------- */
function buildFullImageUrl(req: Request, relativePath: string): string {
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

/* Métodos permitidos según la constraint de la BD */
const ALLOWED_METHODS = ["Tarjeta", "Transferencia", "Efectivo", "Billetera"];

/**
 * Normaliza el método recibido desde frontend:
 * - Si viene “Tarjeta”, se devuelve “Tarjeta”.
 * - Si viene alguno de los otros permitidos, se devuelve tal cual.
 * - Si no es válido o falta, devuelve “Tarjeta” por defecto.
 */
function resolveMetodoPago(raw?: unknown): string {
  if (typeof raw !== "string") return "Tarjeta";
  const clean = raw.trim();
  const found = ALLOWED_METHODS.find((m) => m.toLowerCase() === clean.toLowerCase());
  return found ?? "Tarjeta";
}

/* ------------------- 1) Orden rápida ---------------------- */
export const createFast = async (req: Request, res: Response) => {
  const parsed = OrdenFastCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const payload = {
      clienteId: parsed.data.clienteId,
      tipoServicio: "ENTIERRO",
      total: parsed.data.servicioPrecioBase,
      lineas: [{ servicioId: parsed.data.servicioId, cantidad: 1 }],
      difunto: parsed.data.difunto,
    };

    const nuevaOrden = await OrderService.create(payload);

    /* correo de confirmación (best-effort) */
    let previewUrl: string | null = null;
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: BigInt(parsed.data.clienteId) },
        select: { email: true },
      });
      if (usuario?.email) {
        previewUrl = await sendOrderConfirmation(usuario.email, nuevaOrden.id);
      }
    } catch (mailErr) {
      console.warn("⚠️  Mailer:", mailErr);
    }

    // Devolvemos id + previewUrl
    return res.status(201).json({ id: nuevaOrden.id, previewUrl });
  } catch (err) {
    console.error("createFast:", err);
    return res.status(500).json({ error: "Error interno al crear la orden rápida" });
  }
};

/* ------------------- 2) Orden con varias líneas ---------- */
export const create = async (req: Request, res: Response) => {
  // ** Console.log de diagnóstico **
  console.log("▶️ POST /api/ordenes – body recibido:", JSON.stringify(req.body));

  const parsed = OrderCreateDto.safeParse(req.body);
  if (!parsed.success) {
    console.warn("❌ Validación Zod falló:", parsed.error.format());
    return res.status(400).json(parsed.error);
  }

  try {
    const order = await OrderService.create(parsed.data);

    /* correo de confirmación (best-effort) */
    let previewUrl: string | null = null;
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: BigInt(parsed.data.clienteId) },
        select: { email: true },
      });
      if (usuario?.email) {
        previewUrl = await sendOrderConfirmation(usuario.email, order.id);
      }
    } catch (mailErr) {
      console.warn("⚠️  Mailer:", mailErr);
    }

    // Devolvemos id y previewUrl
    return res.status(201).json({ id: order.id, previewUrl });
  } catch (err: any) {
    // Detectar si es un error P2000 (cadena demasiado larga para la columna)
    if (err.code === "P2000") {
      console.error("❌ Prueba de longitud de columna excedida:", err.meta);
      return res
        .status(400)
        .json({ error: "Uno de los campos del difunto excede la longitud permitida." });
    }
    console.error("❌ create:", err);
    return res.status(500).json({ error: "Error interno al crear la orden" });
  }
};

/* ------------------- 3) Detalle de orden ------------------ */
export const get = async (req: Request, res: Response) => {
  let id: bigint;
  try {
    id = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const order = await prisma.orden.findUnique({
      where: { id },
      include: {
        orden_detalle: { include: { servicio: true } },
        difunto: true,
        usuario_orden_cliente_idTousuario: {
          select: {
            id: true,
            nombre_usuario: true,
            email: true,
            perfil_cliente: { select: { nombres: true, apellidos: true } },
          },
        },
      },
    });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    if (!order.orden_detalle.length) return res.status(404).json({ error: "Sin servicios" });
    if (!order.difunto.length) return res.status(404).json({ error: "Sin difunto" });

    const servicios = order.orden_detalle.map((l) => ({
      id: l.servicio.id,
      nombre: l.servicio.nombre,
      precio_base: Number(l.servicio.precio_base),
      cantidad: l.cantidad,
      subtotal: Number(l.subtotal),
      imagenUrl: l.servicio.imagenUrl
        ? buildFullImageUrl(req, l.servicio.imagenUrl)
        : null,
    }));

    const d = order.difunto[0];
    const difuntoObj = {
      nombres: d.nombres,
      fecha_fallecido: d.fecha_fallecido.toISOString(),
      lugar_fallecimiento: d.lugar_fallecimiento ?? null,
      contacto_responsable: d.contacto_responsable ?? null,
      relacion_solicitante: d.relacion_solicitante ?? null,
      notas_adicionales: d.notas ?? null,
    };

    const u = order.usuario_orden_cliente_idTousuario;
    const clienteObj = {
      id: u.id,
      nombres: u.perfil_cliente
        ? `${u.perfil_cliente.nombres} ${u.perfil_cliente.apellidos}`
        : u.nombre_usuario,
      email: u.email,
    };

    return res.json({
      id: order.id,
      fecha_creacion: order.creado_en.toISOString(),
      estado: order.estado,
      servicios,
      cliente: clienteObj,
      difunto: difuntoObj,
      total: Number(order.total),
      notas_internas: order.motivo_rechazo ?? "",
    });
  } catch (err) {
    console.error("get:", err);
    return res.status(500).json({ error: "Error interno al buscar orden" });
  }
};

/* ------------------- 4) Órdenes del cliente -------------- */
export const listMine = async (req: Request, res: Response) => {
  try {
    const userId = BigInt((req as any).user.id);
    const raw = await OrderService.listByUser(userId);
    return res.json(
      raw.map((o) => ({
        id: o.id,
        estado: o.estado,
        fecha_creacion: o.creado_en.toISOString(),
      }))
    );
  } catch (err) {
    console.error("listMine:", err);
    return res.status(500).json({ error: "Error interno al listar órdenes" });
  }
};

/* ------------------- 5) Cambiar estado ------------------- */
export const changeStatus = async (req: Request, res: Response) => {
  const parsed = ChangeStatusBodyDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  let orderId: bigint;
  try {
    orderId = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "ID de orden inválido." });
  }

  try {
    // 1) Cambiar estado en la base de datos
    const updatedOrder = await OrderService.changeStatus(orderId, parsed.data.estado);

    // 2) Obtener el cliente (y opcionalmente el operador) asociado
    const orderConCliente = await prisma.orden.findUnique({
      where: { id: orderId },
      select: {
        cliente_id: true,
        operador_id: true,
      },
    });

    if (orderConCliente) {
      const destinatarioClienteId = orderConCliente.cliente_id;
      const asunto = `Orden #${orderId.toString()} actualizada`;
      const cuerpo = `El estado de tu orden #${orderId.toString()} ha cambiado a "${parsed.data.estado}".`;

      // 3) Crear fila en `notificacion` para el cliente
      await prisma.notificacion.create({
        data: {
          usuario_id: destinatarioClienteId,
          asunto,
          cuerpo,
          // `leida` = false, `enviado_en` = ahora, por defecto
        },
      });

      // ←— Si deseas notificar al operador, descomenta esto:
      // if (orderConCliente.operador_id) {
      //   await prisma.notificacion.create({
      //     data: {
      //       usuario_id: orderConCliente.operador_id!,
      //       asunto: `Has actualizado Orden #${orderId.toString()}`,
      //       cuerpo: `Has cambiado el estado de la orden #${orderId.toString()} a "${parsed.data.estado}".`,
      //     },
      //   });
      // }
    }

    return res.json({ success: true, updated: updatedOrder });
  } catch (err) {
    console.error("changeStatus:", err);
    return res.status(500).json({ error: "Error interno al cambiar estado" });
  }
};

/* ------------------- 6) Lista global --------------------- */
export const listAll = async (_req: Request, res: Response) => {
  try {
    const raw = await OrderService.listAll();
    return res.json(
      raw.map((o) => ({
        id: o.id,
        estado: o.estado,
        fecha_creacion: o.creado_en.toISOString(),
      }))
    );
  } catch (err) {
    console.error("listAll:", err);
    return res.status(500).json({ error: "Error interno al listar órdenes" });
  }
};

/* ------------------- 7) Pago (mock) ---------------------- */
export const pagarOrden = async (req: Request, res: Response) => {
  // 0) validar path param
  let ordenId: bigint;
  try {
    ordenId = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "ID de orden inválido." });
  }

  // 1) Verificar que la orden exista y esté en estado CONFIRMADO
  const orden = await prisma.orden.findUnique({
    where: { id: ordenId },
    select: { estado: true, total: true },
  });
  if (!orden) return res.status(404).json({ error: "Orden no encontrada." });
  if (orden.estado !== "CONFIRMADO")
    return res.status(400).json({ error: "La orden no está en estado CONFIRMADO." });

  // 2) Determinar método de pago recibido
  const metodo = resolveMetodoPago(req.body?.metodo);

  // 3) Registrar el pago como CONFIRMADO de inmediato (mock)
  try {
    await prisma.$transaction(async (tx) => {
      // 3.1) Crear registro en 'pago'
      await tx.pago.create({
        data: {
          orden_id: ordenId,
          monto: orden.total,
          metodo,
          estado: "CONFIRMADO",
          referencia: `MOCK-${Date.now()}`,
          detalles_gateway: null,
        },
      });

      // 3.2) Actualizar la orden a "PAGADO"
      await tx.orden.update({
        where: { id: ordenId },
        data: {
          estado: "PAGADO",
          pagado_en: new Date(),
        },
      });
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("pagarOrden:", err);
    return res
      .status(500)
      .json({ error: "Error interno al procesar el pago." });
  }
};
