// middleware/authAdmin.js
const jwt = require("jsonwebtoken");
const pool = require("../db/connection"); // tu conexión MySQL
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const verificarAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No se proporcionó token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar en la tabla usuarios si es admin
    const [rows] = await pool
      .promise()
      .query(
        "SELECT ID_usuario, Nombre, Correo_electronico, Tipo_documento, Numero_documento, Rol_usuario FROM usuarios WHERE ID_usuario = ? AND Rol_usuario = 'administrador'",
        [decoded.id]
      );

    if (rows.length === 0) {
      return res.status(403).json({ msg: "Acceso solo para administradores" });
    }

    // Guardar info del admin en req
    req.admin = rows[0];
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

module.exports = { verificarAdmin };
