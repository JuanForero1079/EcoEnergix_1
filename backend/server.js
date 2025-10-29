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
const authRoutes = require('./routes/auth');            // POST /api/auth/login
const comprasRoutes = require('./routes/compras');      // CRUD compras
const entregaRoutes = require('./routes/entrega');      // CRUD entrega
const instalacionRoutes = require('./routes/instalacion'); // CRUD instalación
const pagoRoutes = require('./routes/pago');            // CRUD pago
const productoRoutes = require('./routes/producto');    // CRUD producto
const proveedorRoutes = require('./routes/proveedor');  // CRUD proveedor
const soporteRoutes = require('./routes/soporte_tecnico'); // CRUD soporte técnico
const usuariosRoutes = require('./routes/usuarios');    // CRUD usuarios protegido

// ----------------------
// Conexión de rutas
// ----------------------
app.use('/api/auth', authRoutes);                     
app.use('/api/compras', comprasRoutes);
app.use('/api/entrega', entregaRoutes);
app.use('/api/instalacion', instalacionRoutes);
app.use('/api/pago', pagoRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/soporte', soporteRoutes);
app.use('/api/usuarios', usuariosRoutes);   // Rutas protegidas con token y rol

// ----------------------
// Manejo de rutas inexistentes
// ----------------------
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ----------------------
// Manejo global de errores
// ----------------------
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ----------------------
// Inicio del servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
