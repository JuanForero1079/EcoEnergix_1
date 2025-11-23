const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

// Reporte parametrizado
router.get("/", (req, res) => {
  let { fechaInicio, fechaFin, estado, tipo } = req.query;

  let query = `
    SELECT c.id, c.fecha_compra, c.estado, c.total, u.nombre AS cliente
    FROM compras c
    INNER JOIN usuarios u ON c.usuario_id = u.id
    WHERE 1 = 1
  `;

  let params = [];

  if (fechaInicio && fechaFin) {
    query += " AND c.fecha_compra BETWEEN ? AND ?";
    params.push(fechaInicio, fechaFin);
  }

  if (estado) {
    query += " AND c.estado = ?";
    params.push(estado);
  }

  if (tipo === "mayores") query += " AND c.total > 500000";
  if (tipo === "menores") query += " AND c.total <= 500000";

  query += " ORDER BY c.fecha_compra DESC";

  DB.query(query, params, (err, results) => {
    if (err) {
      console.error("Error al generar reporte:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.json(results);
  });
});

module.exports = router;
