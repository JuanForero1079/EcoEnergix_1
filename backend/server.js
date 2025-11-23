// server.js
const express = require("express");
const cors = require("cors");
// const { verificarToken, verificarRol } = require("./middleware/auth"); // Comentado para entregas sin token

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
const comprasUsuarioRoutes = require("./routes/comprasUsuario");

// Ruta pública para productos
const publicProductosRoutes = require("./routes/publicProductos");

// NUEVA RUTA PARA REPORTES
const reportesRoutes = require("./routes/reportes");

// ----------------------
// Rutas públicas
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/productos", publicProductosRoutes);

// ----------------------
// Rutas protegidas por rol (temporalmente sin token)
// ----------------------

// Solo Administrador
app.use("/api/admin/compras", comprasRoutes);
app.use("/api/admin/entregas", entregasRoutes); 
app.use("/api/admin/instalaciones", instalacionesRoutes);
app.use("/api/admin/pagos", pagosRoutes);
app.use("/api/admin/productos", productosRoutes);
app.use("/api/admin/proveedores", proveedoresRoutes);
app.use("/api/admin/soportes", soportesRoutes);
app.use("/api/admin/usuarios", usuariosRoutes);

// Reportes admin
app.use("/api/admin/reportes", reportesRoutes);

// Cliente y Domiciliario (temporal)
app.use("/api/pedidos", pedidosRoutes);

// Rutas de usuario normal
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
  res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

// ----------------------
// Inicio del servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log("Rutas públicas: /api/auth y /api/productos");
  console.log("Rutas admin: /api/admin/... (entregas sin token)");
  console.log("Rutas Cliente/Domiciliario: /api/pedidos (temporal)");
  console.log("Rutas Usuario: /api/compras/usuario");
  console.log("Reportes: /api/admin/reportes");
});
