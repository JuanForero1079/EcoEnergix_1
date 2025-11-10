// routes/pedidos.js
const express = require("express");
const router = express.Router();

// Ruta temporal para Cliente y Domiciliario
router.get("/", (req, res) => {
  res.json({ message: `Hola ${req.user.correo}, tu rol es ${req.user.rol}. Esta es una vista simple.` });
});

module.exports = router;
