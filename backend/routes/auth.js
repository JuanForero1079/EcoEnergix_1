const express = require("express");
const jwt = require("jsonwebtoken");
const DB = require("../db/connection");
const router = express.Router();

const JWT_SECRET = "clave_secreta_super_segura"; // ⚠️ Usa variable de entorno en producción

// ----------------------
// 🔹 Ruta POST /login
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
      return res.status(500).json({ message: "Error en la BD" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];

    if (contraseña !== user.Contraseña) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Normalizamos el rol
    const rolNormalizado = user.Rol_usuario
      ? user.Rol_usuario.toLowerCase().trim()
      : "cliente";

    // Datos que se incluirán en el token
    const payload = {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: rolNormalizado, // 🔹 normalizado
    };

    // Generamos token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

    // Enviamos respuesta
    res.json({
      token,
      usuario: { ...user, Rol_usuario: rolNormalizado }, // 🔹 también lo normalizamos en la respuesta
    });
  });
});

module.exports = router;
