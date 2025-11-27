const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes parametrizados (solo ADMIN)
 */

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Generar reportes parametrizados de compras
 *     security:
 *       - bearerAuth: []
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: false
 *       - in: query
 *         name: fechaFin
 *         required: false
 *       - in: query
 *         name: estado
 *         required: false
 *       - in: query
 *         name: tipo
 *         required: false
 *         description: "mayores | menores"
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  let { fechaInicio, fechaFin, estado, tipo } = req.query;

  let query = `
    SELECT 
      c.ID_compra AS id,
      c.Fecha_compra AS fecha_compra,
      c.Estado AS estado,
      c.Monto_total AS total,
      u.Nombre AS usuario
    FROM compras c
    INNER JOIN usuarios u ON c.ID_usuario = u.ID_usuario
    WHERE 1 = 1
  `;

  let params = [];

  // Validación de fechas
  if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
    return res.status(400).json({
      error: "Debe enviar fechaInicio y fechaFin juntas"
    });
  }

  if (fechaInicio && fechaFin) {
    query += " AND c.Fecha_compra BETWEEN ? AND ?";
    params.push(fechaInicio, fechaFin);
  }

  // Filtrar por estado
  if (estado) {
    query += " AND c.Estado = ?";
    params.push(estado);
  }

  // Filtros por tipo
  if (tipo) {
    if (tipo === "mayores") query += " AND c.Monto_total > 500000";
    else if (tipo === "menores") query += " AND c.Monto_total <= 500000";
    else return res.status(400).json({ error: "Tipo inválido" });
  }

  query += " ORDER BY c.Fecha_compra DESC";

  DB.query(query, params, (err, results) => {
    if (err) {
      console.error("  [GET /api/reportes] Error SQL:", err);
      return res
        .status(500)
        .json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(200).json({
        message: "No se encontraron resultados con los filtros aplicados",
        datos: []
      });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
