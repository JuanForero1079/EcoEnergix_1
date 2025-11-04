// server.js
const express = require('express');
const cors = require('cors');

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
const comprasRoutes = require("./routes/compras");
const entregasRoutes = require("./routes/entrega"); 
const instalacionesRoutes = require("./routes/instalacion");
const pagosRoutes = require("./routes/pago");
const productosRoutes = require("./routes/producto");
const proveedoresRoutes = require("./routes/proveedor");
const soportesRoutes = require("./routes/soporte_tecnico");
const usuariosRoutes = require("./routes/usuarios");

// ----------------------
// Conexión de rutas (todas en plural)
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/entregas", entregasRoutes);
app.use("/api/instalaciones", instalacionesRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/soportes", soportesRoutes);
app.use("/api/usuarios", usuariosRoutes);

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
});
