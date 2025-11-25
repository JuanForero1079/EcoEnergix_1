const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: CRUD de compras para el admin
 */

/**
 * @swagger
 * /api/admin/compras:
 *   get:
 *     summary: Obtener todas las compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de compras
 *       500:
 *         description: Error del servidor
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM compras", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener las compras", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/admin/compras/{id}:
 *   get:
 *     summary: Obtener una compra por ID
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra encontrada
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM compras WHERE ID_compra = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar la compra", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(result[0]);
  });
});

/**
 * @swagger
 * /api/admin/compras/usuario/{userId}:
 *   get:
 *     summary: Obtener todas las compras de un usuario
 *     tags: [Compras]
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
 *       500:
 *         description: Error del servidor
 */
router.get("/usuario/:userId", (req, res) => {
  const { userId } = req.params;
  DB.query("SELECT * FROM compras WHERE ID_usuario = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener las compras del usuario", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/admin/compras:
 *   post:
 *     summary: Crear una nueva compra
 *     tags: [Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_usuario:
 *                 type: integer
 *               Fecha_compra:
 *                 type: string
 *                 format: date
 *               Monto_total:
 *                 type: number
 *               Estado:
 *                 type: string
 *             required:
 *               - ID_usuario
 *               - Fecha_compra
 *               - Monto_total
 *               - Estado
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *       400:
 *         description: Campos incompletos
 *       500:
 *         description: Error del servidor
 */
router.post("/", (req, res) => {
  const { ID_usuario, Fecha_compra, Monto_total, Estado } = req.body;

  if (!ID_usuario || !Fecha_compra || !Monto_total || !Estado) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    "INSERT INTO compras (ID_usuario, Fecha_compra, Monto_total, Estado) VALUES (?, ?, ?, ?)",
    [ID_usuario, Fecha_compra, Monto_total, Estado],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear la compra", details: err });

      const nuevaCompra = {
        ID_compra: result.insertId,
        ID_usuario,
        Fecha_compra,
        Monto_total,
        Estado,
      };

      res.status(201).json({ message: "Compra creada exitosamente!", compra: nuevaCompra });
    }
  );
});

/**
 * @swagger
 * /api/admin/compras/{id}:
 *   put:
 *     summary: Actualizar una compra
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Fecha_compra:
 *                 type: string
 *                 format: date
 *               Monto_total:
 *                 type: number
 *               Estado:
 *                 type: string
 *             required:
 *               - Fecha_compra
 *               - Monto_total
 *               - Estado
 *     responses:
 *       200:
 *         description: Compra actualizada
 *       400:
 *         description: Campos incompletos
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Fecha_compra, Monto_total, Estado } = req.body;

  if (!Fecha_compra || !Monto_total || !Estado) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    "UPDATE compras SET Fecha_compra = ?, Monto_total = ?, Estado = ? WHERE ID_compra = ?",
    [Fecha_compra, Monto_total, Estado, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar la compra", details: err });

      const compraActualizada = { ID_compra: id, Fecha_compra, Monto_total, Estado };
      res.json({ message: "Compra actualizada exitosamente!", compra: compraActualizada });
    }
  );
});

/**
 * @swagger
 * /api/admin/compras/{id}:
 *   delete:
 *     summary: Eliminar una compra
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra eliminada exitosamente
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM compras WHERE ID_compra = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar la compra", details: err });

    if (result.affectedRows === 0) return res.status(404).json({ message: "Compra no encontrada para eliminar" });

    res.json({ message: "Compra eliminada exitosamente!", id });
  });
});

module.exports = router;
