"use strict";
// backend/src/services/mailer.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmation = sendOrderConfirmation;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
let transporter;
async function getTransporter() {
    if (transporter)
        return transporter;
    const host = process.env.SMTP_HOST || undefined;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && port && user && pass) {
        transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }
    else {
        // Ethereal para desarrollo
        const test = await nodemailer_1.default.createTestAccount();
        transporter = nodemailer_1.default.createTransport({
            host: test.smtp.host,
            port: test.smtp.port,
            secure: test.smtp.secure,
            auth: { user: test.user, pass: test.pass },
        });
        console.log("✉️ Ethereal credentials:", test.user, test.pass);
    }
    return transporter;
}
/**
 * Envía un correo de confirmación de nueva orden y retorna la URL de vista previa en Ethereal.
 */
async function sendOrderConfirmation(toEmail, orderId) {
    const tr = await getTransporter();
    // Formateamos fecha legible
    const fecha = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #3A4A58;">¡Gracias por confiar en LumenGest!</h2>
      <p>Estimado cliente,</p>
      <p>Nos complace informarle que su <strong>Orden de Servicio Funerario</strong> ha sido creada exitosamente.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>ID de orden:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">#${orderId.toString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fecha de creación:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${fecha}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Estado actual:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #B59F6B;"><strong>PENDIENTE</strong></td>
        </tr>
      </table>
      <p style="margin-top: 1.5rem;">
        A continuación encontrará un breve resumen de los siguientes pasos:
      </p>
      <ol style="margin-left: 1.2rem;">
        <li>Revisaremos los datos de su solicitud y documentos adjuntos.</li>
        <li>En las próximas 24-48 horas, recibirá otra notificación por correo cuando su trámite avance a <strong>"CONFIRMADO"</strong> o si requieren información adicional.</li>
        <li>
          En caso de consultas o cambios de último momento, puede contactarnos directamente al <a href="tel:+59171234567" style="color: #3A4A58;">+591 7 1234567</a> o al correo 
          <a href="mailto:soporte@lumengest.com" style="color: #3A4A58;">soporte@lumengest.com</a>.
        </li>
      </ol>
      <p style="margin-top: 1.5rem;">
        Gracias por permitirnos acompañarlo en este momento tan delicado. Quedamos a su disposición para cualquier otra consulta.
      </p>
      <hr style="margin: 2rem 0; border-color: #ddd;" />
      <footer style="font-size: 0.9rem; color: #777;">
        <p><strong>LumenGest Servicios Funerarios</strong></p>
        <p>Dirección: Av. Siempreviva 123, La Paz, Bolivia</p>
        <p>Teléfono: +591 7 1234567 | Email: soporte@lumengest.com</p>
      </footer>
    </div>
  `;
    const info = await tr.sendMail({
        from: `"LumenGest" <${process.env.SMTP_USER || "no-reply@lumengest.com"}>`,
        to: toEmail,
        subject: "LumenGest · Confirmación de su Orden de Servicio Funerario",
        html: htmlContent,
    });
    const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
    console.log("✉️ Order confirmation Preview URL:", previewUrl);
    return previewUrl;
}
//# sourceMappingURL=mailer.js.map