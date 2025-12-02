const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==================================================
//   Modo pruebas (desactiva tokens)
// ==================================================
const modoPruebas = false; //   cambia a true para pruebas SIN autenticación

if (modoPruebas) {
  console.log("  MODO PRUEBAS ACTIVADO (Tokens deshabilitados)");

  module.exports = {
    verificarToken: (req, res, next) => next(),
    verificarRol: () => (req, res, next) => next(),
  };

  return;
}

// ==================================================
//   Verificar Token
// ==================================================
function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { id, correo, rol }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
}

// ==================================================
//   Verificar Rol (Administrador)
// ==================================================
function verificarRol() {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
      }

      //   Log de depuración
      console.log("  ROL DEL TOKEN:", req.user.rol);

      const rol = String(req.user.rol).toLowerCase();

      //   Roles permitidos
      const rolesPermitidos = ["administrador", "admin"];

      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({
          message: "Acceso denegado. Solo administradores pueden acceder.",
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
