const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes parametrizados
 */

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener reporte de compras parametrizado
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para filtrar las compras
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para filtrar las compras
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado de la compra (ej. 'pendiente', 'pagado')
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [mayores, menores]
 *         description: Filtra por monto total de la compra
 *     responses:
 *       200:
 *         description: Lista de compras según los filtros aplicados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fecha_compra:
 *                     type: string
 *                     format: date
 *                   estado:
 *                     type: string
 *                   total:
 *                     type: number
 *                   cliente:
 *                     type: string
 */
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
