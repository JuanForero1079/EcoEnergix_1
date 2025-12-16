const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Entregas
 *   description: CRUD de entregas para administrador y creación automática desde pago
 */

/**
 * ==================================================
 * GET todas las entregas (según rol)
 * ==================================================
 * @swagger
 * /admin/entrega:
 *   get:
 *     summary: Obtener entregas
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas
 *       500:
 *         description: Error al obtener entregas
 */
router.get("/", verificarToken, (req, res) => {
  const rol = req.user.rol;
  const userId = req.user.id;

  let query = "SELECT * FROM entrega";
  let params = [];

  if (rol === "cliente") {
    query += " WHERE ID_usuario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al obtener entregas" });
    res.json(result);
  });
});

/**
 * ==================================================
 * POST crear entrega automática desde pago (cliente)
 * ==================================================
 * @swagger
 * /entrega/crear-desde-pago:
 *   post:
 *     summary: Crear entrega automáticamente desde un pago
 *     tags: [Entregas]
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
 *               - Fecha_entrega
 *             properties:
 *               ID_pedido:
 *                 type: integer
 *               Fecha_entrega:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Entrega creada automáticamente
 *       400:
 *         description: Campos obligatorios faltantes o pedido vacío
 *       500:
 *         description: Error al crear entrega
 */
router.post("/crear-desde-pago", verificarToken, (req, res) => {
  const ID_usuario = req.user.id;
  const { ID_pedido, Fecha_entrega } = req.body;

  if (!ID_pedido || !Fecha_entrega) {
    return res.status(400).json({ message: "ID_pedido y Fecha_entrega son obligatorios" });
  }

  DB.query(
    "SELECT ID_producto, Cantidad FROM detalle_pedido WHERE ID_pedido = ?",
    [ID_pedido],
    (err, productos) => {
      if (err) return res.status(500).json({ message: "Error al obtener productos del pedido", details: err });
      if (productos.length === 0) return res.status(400).json({ message: "Pedido vacío o no encontrado" });

      const entregas = productos.map(p => [Fecha_entrega, ID_usuario, p.ID_producto, p.Cantidad]);

      DB.query(
        "INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad) VALUES ?",
        [entregas],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Error al crear entrega", details: err });

          res.status(201).json({
            message: "Entrega creada automáticamente desde el pago",
            ID_entregas: result.insertId,
          });
        }
      );
    }
  );
});

/**
 * ==================================================
 * POST crear entrega (admin)
 * ==================================================
 * @swagger
 * /admin/entrega:
 *   post:
 *     summary: Crear entrega manual (solo admin)
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_entrega
 *               - ID_usuario
 *               - ID_producto
 *               - Cantidad
 *             properties:
 *               Fecha_entrega:
 *                 type: string
 *                 format: date
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *               Cantidad:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entrega creada correctamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error al crear entrega
 */
router.post("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

  if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
    return res.status(400).json({ message: "Campos obligatorios faltantes" });
  }

  DB.query(
    `INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad)
     VALUES (?, ?, ?, ?)`,
    [Fecha_entrega, Number(ID_usuario), Number(ID_producto), Number(Cantidad)],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error al crear la entrega" });

      res.status(201).json({
        message: "Entrega creada correctamente",
        ID_entrega: result.insertId,
      });
    }
  );
});

/**
 * ==================================================
 * PUT actualizar entrega (admin)
 * ==================================================
 * @swagger
 * /admin/entrega/{id}:
 *   put:
 *     summary: Actualizar entrega (solo admin)
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entrega a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_entrega
 *               - ID_usuario
 *               - ID_producto
 *               - Cantidad
 *             properties:
 *               Fecha_entrega:
 *                 type: string
 *                 format: date
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *               Cantidad:
 *                 type: number
 *     responses:
 *       200:
 *         description: Entrega actualizada correctamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error al actualizar
 */
router.put("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

  if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
    return res.status(400).json({ message: "Campos obligatorios faltantes" });
  }

  DB.query(
    `UPDATE entrega
     SET Fecha_entrega = ?, ID_usuario = ?, ID_producto = ?, Cantidad = ?
     WHERE ID_entrega = ?`,
    [Fecha_entrega, Number(ID_usuario), Number(ID_producto), Number(Cantidad), id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error al actualizar la entrega" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Entrega no encontrada" });

      res.json({ message: "Entrega actualizada correctamente" });
    }
  );
});

/**
 * ==================================================
 * DELETE entrega (admin)
 * ==================================================
 * @swagger
 * /admin/entrega/{id}:
 *   delete:
 *     summary: Eliminar entrega (solo admin)
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entrega a eliminar
 *     responses:
 *       200:
 *         description: Entrega eliminada correctamente
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error al eliminar
 */
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  DB.query(
    "DELETE FROM entrega WHERE ID_entrega = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error al eliminar la entrega" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Entrega no encontrada" });
      res.json({ message: "Entrega eliminada correctamente" });
    }
  );
});

module.exports = router;
