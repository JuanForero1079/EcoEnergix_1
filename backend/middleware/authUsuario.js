// middleware/authUsuario.js
const jwt = require("jsonwebtoken");
const pool = require("../db/connection");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const verificarUsuario = async (req, res, next) => {
  try {
    // =========================
    // Obtener header Authorization
    // =========================
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "No se proporcionó token" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Formato de token inválido" });
    }

    const token = parts[1];

    // =========================
    // Verificar JWT
    // =========================
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }

    // =========================
    // Buscar usuario en BD
    // (EL JWT GUARDA `id`)
    // =========================
    const [rows] = await pool.promise().query(
      `SELECT 
        ID_usuario,
        Nombre,
        Correo_electronico,
        Tipo_documento,
        Numero_documento,
        Rol_usuario,
        Foto_usuario
      FROM usuarios
      WHERE ID_usuario = ?
      LIMIT 1`,
      [decoded.id] //  CLAVE CORRECTA
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // =========================
    // Normalizar req.user
    // =========================
    req.user = {
      id: rows[0].ID_usuario,
      nombre: rows[0].Nombre,
      correo: rows[0].Correo_electronico,
      tipoDocumento: rows[0].Tipo_documento,
      numeroDocumento: rows[0].Numero_documento,
      rol: rows[0].Rol_usuario,
      foto: rows[0].Foto_usuario,
    };

    // Debug opcional
    console.log(
      "Usuario autenticado:",
      req.user.id,
      req.user.nombre
    );

    next();
  } catch (err) {
    console.error("Error en verificarUsuario:", err);
    return res.status(500).json({
      msg: "Error interno al verificar usuario",
    });
  }
};

module.exports = { verificarUsuario };
