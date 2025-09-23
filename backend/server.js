const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require("./routes/auth");
const comprasRoutes = require("./routes/compras");
const entregaRoutes = require("./routes/entrega");
const instalacionRoutes = require("./routes/instalacion");
const pagoRoutes = require("./routes/pago");
const productoRoutes = require("./routes/producto");
const proveedorRoutes = require("./routes/proveedor");
const soporteRoutes = require("./routes/soporte_tecnico");
const usuariosRoutes = require("./routes/usuarios");

// Endpoints base
// La ruta POST /login está disponible gracias a authRoutes
// IMPORTANTE: /login solo existe como POST, no como GET
app.use("/", authRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/entrega", entregaRoutes);
app.use("/api/instalacion", instalacionRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/producto", productoRoutes);
app.use("/api/proveedor", proveedorRoutes);
app.use("/api/soporte", soporteRoutes);
app.use("/api/usuarios", usuariosRoutes);

// Manejo de rutas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
