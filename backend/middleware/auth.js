// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==================================================
// 🔧 Modo pruebas (desactiva tokens)
// ==================================================
const modoPruebas = false; // 👉 cambia a true para pruebas SIN autenticación

if (modoPruebas) {
  console.log("⚠️ MODO PRUEBAS ACTIVADO (Tokens deshabilitados)");

  module.exports = {
    verificarToken: (req, res, next) => next(),
    verificarRol: () => (req, res, next) => next(),
  };

  return;
}

// ==================================================
// 🔐 Verificar Token
// ==================================================
function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // ← id, email, rol

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
}

// ==================================================
// 🎭 Verificar Rol
// ==================================================
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const rolUsuario = req.user.rol;

      // Normalizamos para evitar errores
      const rolesNormalizados = rolesPermitidos.map((r) => r.toLowerCase());
      const rolNormalizado = rolUsuario?.toLowerCase();

      if (!rolesNormalizados.includes(rolNormalizado)) {
        return res.status(403).json({
          message: "Acceso denegado. No tienes permisos para esta acción.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error verificando permisos",
        error: error.message,
      });
    }
  };
}

module.exports = { verificarToken, verificarRol };
