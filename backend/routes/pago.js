// src/routes/pagos.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para CRUD de pagos
 */

/**
 * @swagger
 * /api/admin/pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       500:
 *         description: Error del servidor
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM pago", (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener los pagos", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/admin/pagos/{id}:
 *   get:
 *     summary: Obtener pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago encontrado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM pago WHERE ID_pago = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar el pago", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Pago no encontrado" });
    res.json(result[0]);
  });
});

/**
 * @swagger
 * /api/admin/pagos:
 *   post:
 *     summary: Crear un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_usuario
 *               - Monto
 *               - Fecha_pago
 *               - Metodo_pago
 *               - Estado_pago
 *             properties:
 *               ID_usuario:
 *                 type: integer
 *               Monto:
 *                 type: number
 *               Fecha_pago:
 *                 type: string
 *                 format: date
 *               Metodo_pago:
 *                 type: string
 *               Estado_pago:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */
router.post("/", (req, res) => {
  const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

  if (!ID_usuario || !Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    "INSERT INTO pago (ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago) VALUES (?, ?, ?, ?, ?)",
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear el pago", details: err });

      const nuevoPago = { ID_pago: result.insertId, ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago };
      res.status(201).json({ message: "Pago creado exitosamente!", pago: nuevoPago });
    }
  );
});

/**
 * @swagger
 * /api/admin/pagos/{id}:
 *   put:
 *     summary: Actualizar un pago existente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_usuario
 *               - Monto
 *               - Fecha_pago
 *               - Metodo_pago
 *               - Estado_pago
 *             properties:
 *               ID_usuario:
 *                 type: integer
 *               Monto:
 *                 type: number
 *               Fecha_pago:
 *                 type: string
 *                 format: date
 *               Metodo_pago:
 *                 type: string
 *               Estado_pago:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

  if (!ID_usuario || !Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    "UPDATE pago SET ID_usuario = ?, Monto = ?, Fecha_pago = ?, Metodo_pago = ?, Estado_pago = ? WHERE ID_pago = ?",
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar el pago", details: err });

      const pagoActualizado = { ID_pago: id, ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago };
      res.json({ message: "Pago actualizado exitosamente!", pago: pagoActualizado });
    }
  );
});

/**
 * @swagger
 * /api/admin/pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago a eliminar
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM pago WHERE ID_pago = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el pago", details: err });

    if (result.affectedRows === 0) return res.status(404).json({ message: "Pago no encontrado para eliminar" });
    res.json({ message: "Pago eliminado exitosamente!", id });
  });
});

module.exports = router;
