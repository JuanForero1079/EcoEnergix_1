const jwt = require("jsonwebtoken");

// ⚠️ En producción usa una variable de entorno (ej: process.env.JWT_SECRET)
const JWT_SECRET = "clave_secreta_super_segura";

// ==============================
// 🔹 Middleware: Verificar Token
// ==============================
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  console.log("🔹 Header recibido:", authHeader); // 👈 LOG 1

  if (!authHeader) {
    console.warn("⚠️ No se recibió encabezado Authorization");
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  // El token viene con el formato: "Bearer token_aqui"
  const partes = authHeader.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    console.warn("⚠️ Formato de token inválido");
    return res.status(400).json({ message: "Formato de token inválido" });
  }

  const token = partes[1];
  console.log("🔹 Token recibido:", token ? token.slice(0, 30) + "..." : "NULO"); // 👈 LOG 2

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Error al verificar token:", err.message); // 👈 LOG 3
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    console.log("✅ Token válido. Usuario decodificado:", decoded); // 👈 LOG 4
    req.user = decoded; // ⚙️ Guardamos datos del usuario (id, rol, etc.)
    next();
  });
}

// =============================================
// 🔹 Middleware: Verificar Rol
// =============================================
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      console.warn("⚠️ Intento de acceso sin autenticación");
      return res.status(401).json({ message: "No autenticado" });
    }

    // Aseguramos el nombre del rol
    const rolUsuario = req.user.Rol_usuario?.toLowerCase().trim() || req.user.rol?.toLowerCase().trim();
    const rolesValidos = rolesPermitidos.map((r) => r.toLowerCase().trim());

    console.log("🟢 Verificando rol:", rolUsuario, "=> Permitidos:", rolesValidos); // 👈 LOG 5

    if (!rolesValidos.includes(rolUsuario)) {
      console.warn("🚫 Rol no permitido:", rolUsuario);
      return res.status(403).json({
        message: "🚫 No tienes permisos para acceder a este recurso",
      });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRol };
