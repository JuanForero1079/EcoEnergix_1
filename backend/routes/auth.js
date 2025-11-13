// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const DB = require("../db/connection");
const router = express.Router();

const JWT_SECRET = "clave_secreta_super_segura"; //   En producción usar variable de entorno

// ----------------------
//   Ruta POST /register
// ----------------------
router.post("/register", (req, res) => {
  const { Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento } = req.body;

  if (!Nombre || !Correo_electronico || !Contraseña || !Tipo_documento || !Numero_documento) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Verificamos si el correo ya existe
  const checkQuery = "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1";
  DB.query(checkQuery, [Correo_electronico], (err, results) => {
    if (err) {
      console.error("Error en la BD:", err);
      return res.status(500).json({ message: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    // Insertamos el usuario sin encriptar la contraseña
    const insertQuery = `
      INSERT INTO usuarios (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario)
      VALUES (?, ?, ?, ?, ?, 'cliente')
    `;
    DB.query(
      insertQuery,
      [Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento],
      (err2) => {
        if (err2) {
          console.error("Error al insertar usuario:", err2);
          return res.status(500).json({ message: "Error al crear usuario" });
        }

        res.status(201).json({ message: "Usuario registrado exitosamente" });
      }
    );
  });
});

// ----------------------
//   Ruta POST /login
// ----------------------
router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Datos de sesión incompletos." });
  }

  const query = "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1";

  DB.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error en la BD:", err);
      return res.status(500).json({ message: "Error en la base de datos" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];

    // Comparación simple de contraseña (sin encriptado)
    if (contraseña !== user.Contraseña) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Normalizamos el rol
    const rolNormalizado = user.Rol_usuario
      ? user.Rol_usuario.toLowerCase().trim()
      : "cliente";

    // Datos para token
    const payload = {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: rolNormalizado,
    };

    // Generamos token JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

    res.json({
      token,
      usuario: {
        id: user.ID_usuario,
        nombre: user.Nombre,
        correo: user.Correo_electronico,
        rol: rolNormalizado,
      },
    });
  });
});

module.exports = router;
