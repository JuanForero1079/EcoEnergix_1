// middleware/authUsuario.js
const jwt = require("jsonwebtoken");
const pool = require("../db/connection"); // Conexión MySQL
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const verificarUsuario = async (req, res, next) => {
  try {
    // Obtener token de headers Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No se proporcionó token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token mal formateado" });

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Token inválido:", error.message);
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }

    // Buscar usuario en la base de datos
    const [rows] = await pool
      .promise()
      .query(
        `SELECT ID_usuario, Nombre, Correo_electronico, Tipo_documento, Numero_documento, Rol_usuario, Foto_usuario 
         FROM usuarios 
         WHERE ID_usuario = ? LIMIT 1`,
        [decoded.id]
      );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Guardar info del usuario en req
    req.user = rows[0];

    // Depuración opcional
    console.log("Usuario autenticado:", req.user.ID_usuario, req.user.Nombre);

    next();
  } catch (err) {
    console.error("Error en verificarUsuario:", err);
    return res.status(500).json({ msg: "Error interno al verificar usuario" });
  }
};

module.exports = { verificarUsuario };
