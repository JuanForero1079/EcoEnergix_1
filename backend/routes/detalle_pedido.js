const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: DetallePedido
 *   description: CRUD de detalle de pedidos para administrador
 */

/**
 * ==================================================
 * GET todos los detalles (solo admin)
 * ==================================================
 * @swagger
 * /admin/detalle-pedido:
 *   get:
 *     summary: Obtener todos los detalles de pedidos
 *     tags: [DetallePedido]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de detalles de pedidos
 *       500:
 *         description: Error al obtener los detalles
 */
router.get("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  DB.query("SELECT * FROM detalle_pedido", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

/**
 * ==================================================
 * GET detalle por ID
 * ==================================================
 * @swagger
 * /admin/detalle-pedido/{id}:
 *   get:
 *     summary: Obtener un detalle por ID
 *     tags: [DetallePedido]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error al obtener detalle
 */
router.get("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM detalle_pedido WHERE ID_detalle = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Detalle no encontrado" });
    res.json(result[0]);
  });
});

/**
 * ==================================================
 * POST nuevo detalle (solo admin)
 * ==================================================
 * @swagger
 * /admin/detalle-pedido:
 *   post:
 *     summary: Crear un nuevo detalle de pedido
 *     tags: [DetallePedido]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_pedido
 *               - ID_producto
 *               - Cantidad
 *               - Precio_unitario
 *             properties:
 *               ID_pedido:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *               Cantidad:
 *                 type: number
 *               Precio_unitario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Detalle creado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error al crear el detalle
 */
router.post("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { ID_pedido, ID_producto, Cantidad, Precio_unitario } = req.body;

  if (!ID_pedido || !ID_producto || !Cantidad || !Precio_unitario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    "INSERT INTO detalle_pedido (ID_pedido, ID_producto, Cantidad, Precio_unitario) VALUES (?, ?, ?, ?)",
    [ID_pedido, ID_producto, Cantidad, Precio_unitario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({
        message: "Detalle creado exitosamente",
        detalle: { ID_detalle: result.insertId, ID_pedido, ID_producto, Cantidad, Precio_unitario },
      });
    }
  );
});

/**
 * ==================================================
 * PUT actualizar detalle (solo admin)
 * ==================================================
 * @swagger
 * /admin/detalle-pedido/{id}:
 *   put:
 *     summary: Actualizar un detalle de pedido
 *     tags: [DetallePedido]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Cantidad
 *               - Precio_unitario
 *             properties:
 *               Cantidad:
 *                 type: number
 *               Precio_unitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error al actualizar
 */
router.put("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const { Cantidad, Precio_unitario } = req.body;

  if (!Cantidad || !Precio_unitario) {
    return res.status(400).json({ message: "Cantidad y Precio_unitario son obligatorios" });
  }

  DB.query(
    "UPDATE detalle_pedido SET Cantidad = ?, Precio_unitario = ? WHERE ID_detalle = ?",
    [Cantidad, Precio_unitario, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" });
      res.json({ message: "Detalle actualizado exitosamente", ID_detalle: id });
    }
  );
});

/**
 * ==================================================
 * DELETE detalle (solo admin)
 * ==================================================
 * @swagger
 * /admin/detalle-pedido/{id}:
 *   delete:
 *     summary: Eliminar un detalle de pedido
 *     tags: [DetallePedido]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle a eliminar
 *     responses:
 *       200:
 *         description: Detalle eliminado exitosamente
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error al eliminar
 */
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM detalle_pedido WHERE ID_detalle = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Detalle no encontrado" });
    res.json({ message: "Detalle eliminado exitosamente", ID_detalle: id });
  });
});

module.exports = router;
