// services/email.js
const nodemailer = require("nodemailer");

// Configuración del transporter
// ⚠️ En producción, usa variables de entorno para usuario y contraseña
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // o tu servidor SMTP
  port: 587,
  secure: false, // true para 465
  auth: {
    user: process.env.EMAIL_USER || "tucorreo@gmail.com",
    pass: process.env.EMAIL_PASS || "tucontraseña",
  },
});

// Función para enviar correo de verificación
async function sendVerificationEmail(to, nombre, token) {
  const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

  const mailOptions = {
    from: `"EcoEnergix" <${process.env.EMAIL_USER || "tucorreo@gmail.com"}>`,
    to,
    subject: "Verifica tu correo en EcoEnergix",
    html: `
      <h2>Hola ${nombre},</h2>
      <p>Gracias por registrarte en EcoEnergix.</p>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background:#5f54b3;color:#fff;border-radius:5px;text-decoration:none;">Verificar correo</a>
      <p>Si no creaste esta cuenta, ignora este correo.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error al enviar correo:", err);
    return false;
  }
}

module.exports = sendVerificationEmail;
