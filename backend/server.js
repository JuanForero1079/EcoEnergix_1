// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3001;

// ======================
// Middlewares globales
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Carpeta pública para uploads
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// Swagger
// ======================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// Importación de rutas
// ======================

// Auth
const authRoutes = require("./routes/auth");

// Usuario normal
const userRoutes = require("./routes/userRoutes"); // nuevas rutas de perfil usuario
const comprasUsuarioRoutes = require("./routes/comprasUsuario");

// Admin CRUD
const comprasRoutes = require("./routes/compras");
const entregasRoutes = require("./routes/entrega");
const instalacionesRoutes = require("./routes/instalacion");
const pagosRoutes = require("./routes/pago");
const productosRoutes = require("./routes/productos");
const proveedoresRoutes = require("./routes/proveedor");
const soportesRoutes = require("./routes/soporte_tecnico");
const usuariosRoutes = require("./routes/usuarios");
const reportesRoutes = require("./routes/reportes");
const adminRoutes = require("./routes/admin");

// Público
const publicProductosRoutes = require("./routes/publicProductos");

// ======================
// Rutas públicas
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/productos", publicProductosRoutes);

// ======================
// Rutas ADMIN (protegidas)
// ======================
app.use("/api/admin", adminRoutes);
app.use("/api/admin/compras", comprasRoutes);
app.use("/api/admin/entregas", entregasRoutes);
app.use("/api/admin/instalaciones", instalacionesRoutes);
app.use("/api/admin/pagos", pagosRoutes);
app.use("/api/admin/productos", productosRoutes);
app.use("/api/admin/proveedores", proveedoresRoutes);
app.use("/api/admin/soportes", soportesRoutes);
app.use("/api/admin/usuarios", usuariosRoutes);
app.use("/api/admin/reportes", reportesRoutes);

// ======================
// Usuario normal / perfil y compras
// ======================
app.use("/api/user", userRoutes); // aquí van las rutas de perfil, actualizar, subir foto
app.use("/api/compras/usuario", comprasUsuarioRoutes);
app.use("/api/entregas", entregasRoutes);

// ======================
// Manejo de rutas inexistentes
// ======================
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ======================
// Manejo global de errores
// ======================
app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

// ======================
// Inicio del servidor
// ======================
app.listen(PORT, () => {
  console.log(` Servidor escuchando en http://localhost:${PORT}`);
  console.log(` Swagger: http://localhost:${PORT}/api-docs`);
  console.log(` Uploads: http://localhost:${PORT}/uploads`);
});
