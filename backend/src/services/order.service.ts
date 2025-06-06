// backend/src/services/order.service.ts
import { PrismaClient, orden } from "@prisma/client";
import { OrderCreateDtoType, OrdenFastCreateDtoType } from "../models/order.dto";

const prisma = new PrismaClient();

export class OrderService {
  /**
   * Crea una orden “rápida” con un solo servicio y un difunto.
   * (Reenvía a create() con un arreglo “lineas” de tamaño 1.)
   */
  public static async createFast(
    data: OrdenFastCreateDtoType
  ): Promise<orden> {
    const { servicioId, clienteId, difunto } = data;

    // Buscar precio del servicio
    const servicio = await prisma.servicio.findUnique({
      where: { id: BigInt(servicioId) },
      select: { precio_base: true },
    });
    if (!servicio) {
      throw new Error(`Servicio con id=${servicioId} no existe`);
    }
    const precioBase = Number(servicio.precio_base);

    // Reenvío a create() con un solo elemento en “lineas”
    const payload = {
      clienteId: clienteId,
      tipoServicio: "ENTIERRO",
      total: precioBase,
      lineas: [
        {
          servicioId: servicioId,
          cantidad: 1,
        },
      ],
      difunto: difunto,
    };

    return this.create(payload);
  }

  /**
   * Crea una orden con múltiples líneas + difunto.
   */
  public static async create(
    data: OrderCreateDtoType
  ): Promise<orden> {
    const { clienteId, tipoServicio, total, lineas, difunto } = data;

    // 1) Creo la orden principal
    const nuevaOrden = await prisma.orden.create({
      data: {
        cliente_id: BigInt(clienteId),
        tipo_servicio: tipoServicio,
        total,
        estado: "PENDIENTE",
      },
    });

    // 2) Por cada línea del carrito, insertar en orden_detalle
    const detallePromises = lineas.map(async (linea) => {
      const servicio = await prisma.servicio.findUnique({
        where: { id: BigInt(linea.servicioId) },
        select: { precio_base: true },
      });
      if (!servicio) {
        throw new Error(`Servicio con id=${linea.servicioId} no existe`);
      }
      const precioUnit = Number(servicio.precio_base);
      const subTotal = precioUnit * linea.cantidad;

      return prisma.orden_detalle.create({
        data: {
          orden_id: nuevaOrden.id,
          servicio_id: BigInt(linea.servicioId),
          cantidad: linea.cantidad,
          precio_unitario: precioUnit,
          subtotal: subTotal,
          // descuento: 0 por defecto
        },
      });
    });
    await Promise.all(detallePromises);

    // 3) Insertar registro de difunto (solo uno)
    await prisma.difunto.create({
      data: {
        orden_id: nuevaOrden.id,
        nombres: difunto.nombres,
        fecha_fallecido: new Date(difunto.fecha_fallecido),
        lugar_fallecimiento: difunto.lugar_fallecimiento || null,
        contacto_responsable: difunto.contacto_responsable || null,
        relacion_solicitante: difunto.relacion_solicitante || null,
        notas: difunto.notas || null,
      },
    });

    return nuevaOrden;
  }

  public static async listByUser(userId: bigint): Promise<orden[]> {
    return prisma.orden.findMany({
      where: { cliente_id: userId },
      include: {
        orden_detalle: true,
        difunto: true,
      },
      orderBy: {
        creado_en: "desc",
      },
    });
  }

  public static async changeStatus(
    id: bigint,
    nuevoEstado: string
  ): Promise<orden> {
    return prisma.orden.update({
      where: { id },
      data: { estado: nuevoEstado },
    });
  }

  public static async listAll(): Promise<
    { id: bigint; estado: string; creado_en: Date }[]
  > {
    return prisma.orden.findMany({
      select: {
        id: true,
        estado: true,
        creado_en: true,
      },
      orderBy: {
        creado_en: "desc",
      },
    });
  }

  public static async get(id: bigint): Promise<orden | null> {
    return prisma.orden.findUnique({
      where: { id },
      include: {
        orden_detalle: true,
        difunto: true,
        pago: true,
      },
    });
  }
}
