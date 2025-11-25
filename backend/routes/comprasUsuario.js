// src/routes/comprasUsuario.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Compras Usuario
 *   description: Endpoints para obtener compras de un usuario específico
 */

/**
 * @swagger
 * /api/compras/usuario/{userId}:
 *   get:
 *     summary: Obtener todas las compras de un usuario
 *     tags: [Compras Usuario]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_compra:
 *                     type: integer
 *                   ID_usuario:
 *                     type: integer
 *                   Fecha_compra:
 *                     type: string
 *                     format: date
 *                   Monto_total:
 *                     type: number
 *                   Estado:
 *                     type: string
 *                   nombre_producto:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 *       500:
 *         description: Error del servidor
 */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.ID_compra, c.ID_usuario, c.Fecha_compra, c.Monto_total, c.Estado,
           p.nombre_producto, c.cantidad
    FROM compras c
    LEFT JOIN productos p ON c.ID_producto = p.ID_producto
    WHERE c.ID_usuario = ?
  `;

  DB.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener las compras del usuario" });
    }
    res.json(result);
  });
});

module.exports = router;
