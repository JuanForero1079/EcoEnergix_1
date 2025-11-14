// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const DB = require("../db/connection");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ----------------------
// VARIABLES DE ENTORNO
// ----------------------
const JWT_SECRET = process.env.JWT_SECRET;
const SERVER_URL = process.env.SERVER_URL;

// ----------------------
// CONFIGURAR ENVÍO DE CORREOS
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ----------------------
//   POST /register
// ----------------------
router.post("/register", (req, res) => {
  const {
    Nombre,
    Correo_electronico,
    Contraseña,
    Tipo_documento,
    Numero_documento,
  } = req.body;

  if (
    !Nombre ||
    !Correo_electronico ||
    !Contraseña ||
    !Tipo_documento ||
    !Numero_documento
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const checkQuery = "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1";

  DB.query(checkQuery, [Correo_electronico], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    const tokenVerificacion = crypto.randomBytes(40).toString("hex");

    const insertQuery = `
      INSERT INTO usuarios 
      (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario, verificado, token_verificacion)
      VALUES (?, ?, ?, ?, ?, 'cliente', 0, ?)
    `;

    DB.query(
      insertQuery,
      [
        Nombre,
        Correo_electronico,
        Contraseña,
        Tipo_documento,
        Numero_documento,
        tokenVerificacion,
      ],
      async (err2) => {
        if (err2) return res.status(500).json({ message: "Error al crear usuario" });

        const link = `${SERVER_URL}/api/auth/verificar/${tokenVerificacion}`;

        // ----------------------
        //   ENVIAR CORREO
        // ----------------------
        await transporter.sendMail({
          from: `"EcoSolar" <${process.env.EMAIL_USER}>`,
          to: Correo_electronico,
          subject: "Verifica tu correo ✔",
          html: `
            <h2>Hola ${Nombre}, ¡bienvenido a Ecoenergix! 🌞</h2>
            <p>Haz clic en el siguiente enlace para activar tu cuenta:</p><br>
            <a href="${link}" style="color:green; font-weight:bold; font-size:18px;">
              ➤ Verificar mi cuenta
            </a>
          `,
        });

        res.status(201).json({
          message: "Registro exitoso. Revisa tu correo para activar tu cuenta.",
        });
      }
    );
  });
});

// ----------------------
//   GET /verificar/:token
// ----------------------
router.get("/verificar/:token", (req, res) => {
  const token = req.params.token;

  const sql = `
    UPDATE usuarios 
    SET verificado = 1, token_verificacion = NULL
    WHERE token_verificacion = ?
  `;

  DB.query(sql, [token], (err, result) => {
    if (err) return res.status(500).json({ message: "Error verificando usuario" });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    res.json({ message: "Correo verificado. Ya puedes iniciar sesión." });
  });
});

// ----------------------
//   POST /login
// ----------------------
router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Datos de sesión incompletos." });
  }

  const query = "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1";

  DB.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];

    if (contraseña !== user.Contraseña) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (user.verificado === 0) {
      return res.status(401).json({
        message: "Debes verificar tu correo antes de iniciar sesión.",
      });
    }

    if (user.Rol_usuario.toLowerCase().trim() !== "cliente") {
      return res.status(403).json({
        message: "Este tipo de usuario no tiene permiso para iniciar sesión.",
      });
    }

    const payload = {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: "cliente",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

    res.json({
      token,
      usuario: {
        id: user.ID_usuario,
        nombre: user.Nombre,
        correo: user.Correo_electronico,
        rol: "cliente",
      },
    });
  });
});

module.exports = router;
