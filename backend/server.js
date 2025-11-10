// server.js
const express = require("express");
const cors = require("cors");
// const { verificarToken, verificarRol } = require("./middleware/auth"); // ⚠️ Comentado para entregas sin token

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------
// Middlewares globales
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// Importación de rutas
// ----------------------
const authRoutes = require("./routes/auth");

// Admin
const comprasRoutes = require("./routes/compras");
const entregasRoutes = require("./routes/entrega"); 
const instalacionesRoutes = require("./routes/instalacion");
const pagosRoutes = require("./routes/pago");
const productosRoutes = require("./routes/productos");
const proveedoresRoutes = require("./routes/proveedor");
const soportesRoutes = require("./routes/soporte_tecnico");
const usuariosRoutes = require("./routes/usuarios");

// Cliente y Domiciliario (temporal)
const pedidosRoutes = require("./routes/pedidos");

// Rutas específicas de usuario
const comprasUsuarioRoutes = require("./routes/comprasUsuario"); // ✅ nueva ruta

// ----------------------
// Rutas públicas
// ----------------------
app.use("/api/auth", authRoutes);

// 🔹 Ruta pública para productos (usuarios normales)
const publicProductosRoutes = require("./routes/publicProductos");
app.use("/api/productos", publicProductosRoutes);

// ----------------------
// Rutas protegidas por rol
// ----------------------

// 🟢 Solo Administrador
app.use(
  "/api/admin/compras",
  /*verificarToken, verificarRol("administrador"),*/ 
  comprasRoutes
);
app.use("/api/admin/entregas", entregasRoutes); // ⚡ Sin token ni rol
app.use(
  "/api/admin/instalaciones",
  /*verificarToken, verificarRol("administrador"),*/ 
  instalacionesRoutes
);
app.use(
  "/api/admin/pagos",
  /*verificarToken, verificarRol("administrador"),*/ 
  pagosRoutes
);
app.use(
  "/api/admin/productos",
  /*verificarToken, verificarRol("administrador"),*/ 
  productosRoutes
);
app.use(
  "/api/admin/proveedores",
  /*verificarToken, verificarRol("administrador"),*/ 
  proveedoresRoutes
);
app.use(
  "/api/admin/soportes",
  /*verificarToken, verificarRol("administrador"),*/ 
  soportesRoutes
);
app.use(
  "/api/admin/usuarios",
  /*verificarToken, verificarRol("administrador"),*/ 
  usuariosRoutes
);

// 🟡 Cliente y Domiciliario (temporal)
app.use(
  "/api/pedidos",
  /*verificarToken, verificarRol("cliente", "domiciliario"),*/ 
  pedidosRoutes
);

// ✅ Rutas de usuario normal
app.use("/api/compras/usuario", comprasUsuarioRoutes);

// ----------------------
// Manejo de rutas inexistentes
// ----------------------
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ----------------------
// Manejo global de errores
// ----------------------
app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ----------------------
// Inicio del servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  console.log("🟢 Rutas públicas: /api/auth y /api/productos");
  console.log("🟢 Rutas admin: /api/admin/... (entregas sin token)");
  console.log("🟢 Rutas Cliente/Domiciliario: /api/pedidos (temporal)");
  console.log("🟢 Rutas Usuario: /api/compras/usuario");
});
