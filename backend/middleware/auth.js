const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==================================================
//   Modo pruebas (desactiva autenticación)
// ==================================================
const modoPruebas = false; // ⚠️ SOLO desarrollo local

if (modoPruebas) {
  console.log("⚠️  MODO PRUEBAS ACTIVADO (Tokens deshabilitados)");

  module.exports = {
    verificarToken: (req, res, next) => {
      req.user = {
        id: 1,
        correo: "admin@pruebas.com",
        rol: "administrador",
      };
      next();
    },
    verificarRol: () => (req, res, next) => next(),
  };

  return;
}

// ==================================================
//   Verificar Token JWT
// ==================================================
function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      correo: decoded.correo,
      // ✅ normalizamos SIEMPRE el rol
      rol: String(decoded.rol).toLowerCase(),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
}

// ==================================================
//   Verificar Rol (uno o varios)
//   Uso: verificarRol(["administrador"])
// ==================================================
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    // ✅ Si no se especifican roles, permitir acceso
    if (rolesPermitidos.length === 0) {
      return next();
    }

    const rolUsuario = req.user.rol;

    // ✅ Normalizar roles permitidos
    const rolesNormalizados = rolesPermitidos.map((rol) =>
      String(rol).toLowerCase()
    );

    // 🔎 Log útil para depuración
    console.log("🔐 Rol usuario:", rolUsuario);
    console.log("✅ Roles permitidos:", rolesNormalizados);

    if (!rolesNormalizados.includes(rolUsuario)) {
      return res.status(403).json({
        message: "Acceso denegado: permisos insuficientes",
      });
    }

    next();
  };
}

module.exports = {
  verificarToken,
  verificarRol,
};
