"use strict";
// backend/src/controllers/pago.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPayment = exports.createPaymentIntent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * 1) Crear Payment Intent (mock) y registro preliminar en 'pago'
 *
 * En lugar de llamar a Stripe, este método simplemente:
 *  - Recibe { ordenId } en el body
 *  - Verifica que la orden exista y esté en estado CONFIRMADO
 *  - Inserta un registro en la tabla 'pago' con estado = "PENDIENTE"
 *  - Devuelve un "clientSecret" ficticio para que el frontend lo use (puede ser cualquier cadena)
 */
const createPaymentIntent = async (req, res) => {
    const { ordenId } = req.body;
    if (!ordenId) {
        return res.status(400).json({ error: 'Falta ordenId' });
    }
    // 1.1 Verificar que exista la orden y que esté en estado CONFIRMADO
    let idNum;
    try {
        idNum = BigInt(ordenId);
    }
    catch {
        return res.status(400).json({ error: 'ordenId inválido' });
    }
    const orden = await prisma.orden.findUnique({
        where: { id: idNum },
        select: { id: true, total: true, estado: true },
    });
    if (!orden) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (orden.estado !== 'CONFIRMADO') {
        return res.status(400).json({ error: 'La orden no está en estado CONFIRMADO' });
    }
    // 1.2 Registrar el pago preliminar en la BD con estado PENDIENTE
    try {
        await prisma.pago.create({
            data: {
                orden_id: orden.id,
                monto: orden.total,
                metodo: 'Tarjeta', // como es mock, asumimos siempre "Tarjeta"
                estado: 'PENDIENTE',
                referencia: `MOCK-${Date.now()}`,
                detalles_gateway: null,
            },
        });
        // 1.3 Devolver un "clientSecret" ficticio
        //     El frontend lo usará como si fuera válido, luego llamará a confirmPayment
        return res.json({
            clientSecret: `mock_client_secret_${Date.now()}`,
        });
    }
    catch (err) {
        console.error('Error mock creando PaymentIntent:', err);
        return res.status(500).json({ error: 'Error interno al crear el PaymentIntent' });
    }
};
exports.createPaymentIntent = createPaymentIntent;
/**
 * 2) Confirmar el pago (mock)
 *
 * En lugar de consultar Stripe, este método:
 *  - Recibe { paymentIntentId, ordenId } en el body
 *  - Marca el registro de pago asociado a esa orden como CONFIRMADO
 *  - Actualiza la orden a estado PAGADO (o CONFIRMADO, según tu esquema)
 */
const confirmPayment = async (req, res) => {
    const { paymentIntentId, ordenId } = req.body;
    if (!paymentIntentId || !ordenId) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    // 2.1 Convertimos ordenId a BigInt
    let idNum;
    try {
        idNum = BigInt(ordenId);
    }
    catch {
        return res.status(400).json({ error: 'ordenId inválido' });
    }
    // 2.2 Buscamos el pago que registramos antes (estado = PENDIENTE)
    try {
        // Intentamos actualizar todos los pagos PENDIENTES para esta ordenId y la referencia mock
        const updateResult = await prisma.pago.updateMany({
            where: {
                orden_id: idNum,
                estado: 'PENDIENTE',
                referencia: { contains: 'MOCK-' }, // coincidencia aproximada
            },
            data: {
                estado: 'CONFIRMADO',
                detalles_gateway: {
                    stripe: {
                        id: paymentIntentId,
                        status: 'succeeded',
                        mockConfirmedAt: new Date().toISOString(),
                    },
                },
                pagado_en: new Date(), // fechamos ahora
            },
        });
        // Si no se actualizó ningún registro, devolvemos error
        if (updateResult.count === 0) {
            return res
                .status(404)
                .json({ error: 'No se encontró pago pendiente para confirmar.' });
        }
        // 2.3 Actualizar el estado de la orden a PAGADO (o CONFIRMADO)
        await prisma.orden.update({
            where: { id: idNum },
            data: {
                estado: 'CONFIRMADO',
                pagado_en: new Date(),
            },
        });
        return res.json({ success: true });
    }
    catch (err) {
        console.error('Error mock confirmando PaymentIntent:', err);
        return res.status(500).json({ error: 'Error interno al confirmar el pago' });
    }
};
exports.confirmPayment = confirmPayment;
//# sourceMappingURL=pago.controller.js.map