const jwt = require("jsonwebtoken");

// ⚠️ Mejor usa una variable de entorno en producción
const JWT_SECRET = "clave_secreta_super_segura";

// Middleware: verifica que el token sea válido
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  // El token viene en formato "Bearer token123..."
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Guardamos los datos del token para usarlos en la ruta
    req.user = decoded;
    next();
  });
}

// Middleware: verifica que el rol del usuario esté permitido
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRol };
