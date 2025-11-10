const express = require("express");
const jwt = require("jsonwebtoken");
const DB = require("../db/connection");
const router = express.Router();
const nodemailer = require("nodemailer");

const JWT_SECRET = "clave_secreta_super_segura"; // ⚠️ En producción usar variable de entorno
const EMAIL_USER = "tucorreo@gmail.com"; // correo desde el que se enviará
const EMAIL_PASS = "tu_password"; // contraseña o app password

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ----------------------
// Registro de usuario con verificación por correo
// ----------------------
router.post("/register", (req, res) => {
  const { Nombre, Correo_electronico, Tipo_documento, Numero_documento, Contraseña } = req.body;

  if (!Nombre || !Correo_electronico || !Contraseña) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Revisar si el correo ya existe
  DB.query("SELECT * FROM usuarios WHERE Correo_electronico = ?", [Correo_electronico], (err, result) => {
    if (err) return res.status(500).json({ message: "Error en la BD", details: err });
    if (result.length > 0) return res.status(400).json({ message: "Correo ya registrado" });

    const Rol_usuario = "cliente"; // rol fijo cliente
    const Activo = 0; // usuario inactivo hasta verificar correo

    // Insertar usuario
    DB.query(
      `INSERT INTO usuarios (Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Contraseña, Activo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Nombre, Correo_electronico, Rol_usuario, Tipo_documento || "", Numero_documento || "", Contraseña, Activo],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error al registrar usuario", details: err });

        // Crear token de verificación (expira en 24h)
        const emailToken = jwt.sign(
          { id: result.insertId, correo: Correo_electronico },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        const url = `http://localhost:5173/verify-email?token=${emailToken}`; // URL de frontend para activar cuenta

        // Enviar correo
        transporter.sendMail({
          from: `"Energía Solar" <${EMAIL_USER}>`,
          to: Correo_electronico,
          subject: "Verifica tu correo",
          html: `<p>Hola ${Nombre},</p>
                 <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
                 <a href="${url}">Verificar Correo</a>
                 <p>Este enlace expira en 24 horas.</p>`
        });

        res.status(201).json({
          message: "✅ Registro exitoso. Revisa tu correo para activar la cuenta.",
          usuario: {
            ID_usuario: result.insertId,
            Nombre,
            Correo_electronico,
            Rol_usuario,
          },
        });
      }
    );
  });
});

// ----------------------
// Activación de usuario
// ----------------------
router.get("/verify-email", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id } = decoded;

    // Actualizar usuario a activo
    DB.query("UPDATE usuarios SET Activo = 1 WHERE ID_usuario = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Error al activar usuario", details: err });
      res.send("✅ Cuenta verificada correctamente. Ahora puedes iniciar sesión.");
    });
  } catch (err) {
    return res.status(400).json({ message: "Token inválido o expirado" });
  }
});

// ----------------------
// Login de usuario (solo activo)
// ----------------------
router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Datos de sesión incompletos." });
  }

  DB.query("SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1", [correo], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la BD", details: err });
    if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const user = results[0];

    if (!user.Activo) return res.status(401).json({ message: "Usuario no verificado. Revisa tu correo." });

    if (contraseña !== user.Contraseña) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const rolNormalizado = user.Rol_usuario ? user.Rol_usuario.toLowerCase().trim() : "cliente";

    const payload = { id: user.ID_usuario, correo: user.Correo_electronico, rol: rolNormalizado };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

    res.json({
      token,
      usuario: { id: user.ID_usuario, nombre: user.Nombre, correo: user.Correo_electronico, rol: rolNormalizado },
    });
  });
});

module.exports = router;
