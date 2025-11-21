const express = require("express");
const jwt = require("jsonwebtoken");
const DB = require("../db/connection");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

// -----------------------------
// VARIABLES DE ENTORNO
// -----------------------------
const JWT_SECRET = process.env.JWT_SECRET;
const SERVER_URL = process.env.SERVER_URL;

// -----------------------------
// CONFIGURACIÓN DE NODEMAILER
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =========================================================
// POST /register  (REGISTRO + HASH + TOKEN 1 HORA)
// =========================================================
router.post("/register", async (req, res) => {
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

  DB.query(
    "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
    [Correo_electronico],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });

      if (results.length > 0) {
        return res.status(400).json({ message: "Correo ya registrado" });
      }

      const tokenVerificacion = crypto.randomBytes(40).toString("hex");
      const expiraEn = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      // HASHEAR CONTRASEÑA
      const contraseñaHasheada = await bcrypt.hash(Contraseña, 10);

      const insertQuery = `
        INSERT INTO usuarios 
        (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario, verificado, token_verificacion, token_expira_en)
        VALUES (?, ?, ?, ?, ?, 'cliente', 0, ?, ?)
      `;

      DB.query(
        insertQuery,
        [
          Nombre,
          Correo_electronico,
          contraseñaHasheada,
          Tipo_documento,
          Numero_documento,
          tokenVerificacion,
          expiraEn,
        ],
        async (err2) => {
          if (err2) return res.status(500).json({ message: "Error al crear usuario" });

          const link = `${SERVER_URL}/api/auth/verificar/${tokenVerificacion}`;

          await transporter.sendMail({
            from: `"Ecoenergix" <${process.env.EMAIL_USER}>`,
            to: Correo_electronico,
            subject: "Verifica tu correo ✔",
            html: `
              <h2>Hola ${Nombre}, ¡bienvenido a Ecoenergix! 🌞</h2>
              <p>Tu enlace es válido durante <strong>1 hora</strong>.</p>
              <a href="${link}" 
                style="color:#008f39; font-weight:bold; font-size:18px; text-decoration:none;">
                ✔ Verificar mi cuenta
              </a>
            `,
          });

          res.status(201).json({
            message:
              "Registro exitoso. Revisa tu correo y verifica tu cuenta antes de iniciar sesión.",
          });
        }
      );
    }
  );
});

// =========================================================
// GET /verificar/:token
// =========================================================
router.get("/verificar/:token", (req, res) => {
  const token = req.params.token;

  DB.query(
    "SELECT * FROM usuarios WHERE token_verificacion = ? LIMIT 1",
    [token],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });

      if (results.length === 0) {
        return res.status(400).json({ message: "Token inválido" });
      }

      const user = results[0];

      const ahora = new Date();
      const expira = new Date(user.token_expira_en);

      if (ahora > expira) {
        return res.status(400).json({
          message: "El enlace de verificación expiró. Regístrate nuevamente.",
        });
      }

      DB.query(
        `
        UPDATE usuarios
        SET verificado = 1, token_verificacion = NULL, token_expira_en = NULL
        WHERE ID_usuario = ?
      `,
        [user.ID_usuario],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: "Error verificando usuario" });

          res.json({
            message: "Correo verificado correctamente. Ya puedes iniciar sesión.",
          });
        }
      );
    }
  );
});

// =========================================================
// POST /login  (TODOS LOS ROLES + CONTRASEÑA HASH + SOPORTE LEGADO)
// =========================================================
router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  DB.query(
    "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
    [correo],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const user = results[0];

      // --------- DETECTAR SI LA CONTRASEÑA ESTÁ EN TEXTO PLANO (LEGADO) ----------
      let passwordCorrecta = false;

      const esHash = user.Contraseña.startsWith("$2b$");

      if (esHash) {
        // Comparar con bcrypt
        passwordCorrecta = await bcrypt.compare(contraseña, user.Contraseña);
      } else {
        // Comparar texto plano
        passwordCorrecta = contraseña === user.Contraseña;

        if (passwordCorrecta) {
          // ⚡ ACTUALIZAR AUTOMÁTICAMENTE LA CONTRASEÑA A HASH
          const hashNuevo = await bcrypt.hash(contraseña, 10);

          DB.query(
            "UPDATE usuarios SET Contraseña = ? WHERE ID_usuario = ?",
            [hashNuevo, user.ID_usuario]
          );
        }
      }

      if (!passwordCorrecta) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      if (user.verificado === 0) {
        return res.status(401).json({
          message: "Debes verificar tu correo antes de iniciar sesión.",
        });
      }

      // 🔥 YA NO BLOQUEA POR ROL — PERMITE TODOS
      const token = jwt.sign(
        {
          id: user.ID_usuario,
          correo: user.Correo_electronico,
          rol: user.Rol_usuario, // << ROL REAL
        },
        JWT_SECRET,
        { expiresIn: "4h" }
      );

      res.json({
        token,
        usuario: {
          id: user.ID_usuario,
          nombre: user.Nombre,
          correo: user.Correo_electronico,
          rol: user.Rol_usuario,
        },
      });
    }
  );
});

module.exports = router;
