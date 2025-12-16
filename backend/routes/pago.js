const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

const ESTADOS_PAGO = ["Pendiente", "Completado"];

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para CRUD de pagos
 */

/**
 * ==================================================
 * GET: Pagos de un usuario
 * - ADMIN: ve cualquiera
 * - CLIENTE: solo los suyos
 * ==================================================
 * @swagger
 * /admin/pago/usuario/{userId}:
 *   get:
 *     summary: Obtener pagos de un usuario
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       403:
 *         description: No tienes permiso
 *       500:
 *         description: Error al obtener pagos
 */
router.get("/usuario/:userId", verificarToken, (req, res) => {
  const { userId } = req.params;
  const rol = req.user.rol;
  const authUserId = req.user.id;

  if (rol !== "administrador" && authUserId != userId) {
    return res.status(403).json({ message: "No tienes permiso para ver estos pagos" });
  }

  DB.query("SELECT * FROM pago WHERE ID_usuario = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener pagos", details: err });
    res.json(result);
  });
});

/**
 * ==================================================
 * POST: Crear pago (CLIENTE o ADMIN)
 * ==================================================
 * @swagger
 * /admin/pago:
 *   post:
 *     summary: Crear un nuevo pago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Monto
 *               - Fecha_pago
 *               - Metodo_pago
 *               - Estado_pago
 *             properties:
 *               Monto:
 *                 type: number
 *               Fecha_pago:
 *                 type: string
 *                 format: date
 *               Metodo_pago:
 *                 type: string
 *               Estado_pago:
 *                 type: string
 *                 enum: [Pendiente, Completado]
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes o estado inválido
 *       500:
 *         description: Error al crear pago
 */
router.post("/", verificarToken, (req, res) => {
  const { Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;
  const ID_usuario = req.user.id;

  if (!Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  if (!ESTADOS_PAGO.includes(Estado_pago)) {
    return res.status(400).json({ message: `Estado inválido. Permitidos: ${ESTADOS_PAGO.join(", ")}` });
  }

  DB.query(
    `INSERT INTO pago (ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago) VALUES (?, ?, ?, ?, ?)`,
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error al crear pago", details: err });
      res.status(201).json({
        message: "Pago creado exitosamente",
        pago: { ID_pago: result.insertId, ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago },
      });
    }
  );
});

/**
 * ==================================================
 * GET: Todos los pagos (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/pago:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pagos
 *       500:
 *         description: Error al obtener pagos
 */
router.get("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  DB.query("SELECT * FROM pago", (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener pagos", details: err });
    res.json(result);
  });
});

/**
 * ==================================================
 * GET: Pago por ID (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/pago/{id}:
 *   get:
 *     summary: Obtener un pago por ID
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
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
 *         description: Error al buscar pago
 */
router.get("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM pago WHERE ID_pago = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar pago", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Pago no encontrado" });
    res.json(result[0]);
  });
});

/**
 * ==================================================
 * PUT: Actualizar pago (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/pago/{id}:
 *   put:
 *     summary: Actualizar un pago existente
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
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
 *                 enum: [Pendiente, Completado]
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes o estado inválido
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al actualizar pago
 */
router.put("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

  if (!ID_usuario || !Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  if (!ESTADOS_PAGO.includes(Estado_pago)) {
    return res.status(400).json({ message: `Estado inválido. Permitidos: ${ESTADOS_PAGO.join(", ")}` });
  }

  DB.query(
    `UPDATE pago SET ID_usuario=?, Monto=?, Fecha_pago=?, Metodo_pago=?, Estado_pago=? WHERE ID_pago=?`,
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar pago", details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Pago no encontrado" });
      res.json({ message: "Pago actualizado exitosamente", id });
    }
  );
});

/**
 * ==================================================
 * DELETE: Eliminar pago (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/pago/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
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
 *         description: Error al eliminar pago
 */
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM pago WHERE ID_pago = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar pago", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Pago no encontrado" });
    res.json({ message: "Pago eliminado exitosamente", id });
  });
});

module.exports = router;
