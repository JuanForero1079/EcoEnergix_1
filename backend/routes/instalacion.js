const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Instalaciones
 *   description: CRUD de instalaciones para administrador y consultas para clientes
 */

/**
 * ==================================================
 * GET todas las instalaciones según rol
 * ==================================================
 * @swagger
 * /admin/instalacion:
 *   get:
 *     summary: Obtener todas las instalaciones
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instalaciones
 *       500:
 *         description: Error al obtener instalaciones
 */
router.get("/", verificarToken, (req, res) => {
  const rol = req.user.rol;
  const userId = req.user.id;

  let query = "SELECT * FROM instalacion";
  let params = [];

  if (rol === "cliente") {
    query += " WHERE ID_usuario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener instalaciones", details: err });
    res.json(result);
  });
});

/**
 * ==================================================
 * GET instalación por ID (validación por rol)
 * ==================================================
 * @swagger
 * /admin/instalacion/{id}:
 *   get:
 *     summary: Obtener instalación por ID
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *     responses:
 *       200:
 *         description: Instalación encontrada
 *       403:
 *         description: No tienes permiso para ver esta instalación
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al buscar instalación
 */
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const rol = req.user.rol;
  const userId = req.user.id;

  DB.query("SELECT * FROM instalacion WHERE ID_instalacion = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar la instalación", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Instalación no encontrada" });

    const instalacion = result[0];
    if (rol === "cliente" && instalacion.ID_usuario !== userId)
      return res.status(403).json({ message: "No tienes permiso para ver esta instalación" });

    res.json(instalacion);
  });
});

/**
 * ==================================================
 * POST crear instalación (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/instalacion:
 *   post:
 *     summary: Crear instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_instalacion
 *               - Duracion_instalacion
 *               - Costo_instalacion
 *               - Estado_instalacion
 *               - ID_usuario
 *               - ID_producto
 *             properties:
 *               Fecha_instalacion:
 *                 type: string
 *                 format: date
 *               Duracion_instalacion:
 *                 type: string
 *               Costo_instalacion:
 *                 type: number
 *               Estado_instalacion:
 *                 type: string
 *                 enum: [Pendiente, En_Proceso, Completada, Cancelada]
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Instalación creada exitosamente
 *       400:
 *         description: Campos obligatorios faltantes o estado inválido
 *       500:
 *         description: Error al crear instalación
 */
router.post("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;
  const ESTADOS_INSTALACION = ["Pendiente", "En_Proceso", "Completada", "Cancelada"];

  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  if (!ESTADOS_INSTALACION.includes(Estado_instalacion)) {
    return res.status(400).json({ message: `Estado inválido. Permitidos: ${ESTADOS_INSTALACION.join(", ")}` });
  }

  DB.query(
    `INSERT INTO instalacion (Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear la instalación", details: err });
      res.status(201).json({ message: "Instalación creada exitosamente", instalacion: { ID_instalacion: result.insertId, Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } });
    }
  );
});

/**
 * ==================================================
 * PUT actualizar instalación (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/instalacion/{id}:
 *   put:
 *     summary: Actualizar instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_instalacion
 *               - Duracion_instalacion
 *               - Costo_instalacion
 *               - Estado_instalacion
 *               - ID_usuario
 *               - ID_producto
 *             properties:
 *               Fecha_instalacion:
 *                 type: string
 *                 format: date
 *               Duracion_instalacion:
 *                 type: string
 *               Costo_instalacion:
 *                 type: number
 *               Estado_instalacion:
 *                 type: string
 *                 enum: [Pendiente, En_Proceso, Completada, Cancelada]
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Instalación actualizada correctamente
 *       400:
 *         description: Campos obligatorios faltantes o estado inválido
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al actualizar
 */
router.put("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;
  const ESTADOS_INSTALACION = ["Pendiente", "En_Proceso", "Completada", "Cancelada"];

  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }
  if (!ESTADOS_INSTALACION.includes(Estado_instalacion)) {
    return res.status(400).json({ message: `Estado inválido. Permitidos: ${ESTADOS_INSTALACION.join(", ")}` });
  }

  DB.query("SELECT Estado_instalacion FROM instalacion WHERE ID_instalacion = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al consultar la instalación", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Instalación no encontrada" });

    const estadoActual = result[0].Estado_instalacion;
    if (estadoActual === "Pendiente" && Estado_instalacion === "Completada") {
      return res.status(400).json({ message: "No puedes cambiar directamente de Pendiente a Completada" });
    }

    DB.query(
      `UPDATE instalacion SET Fecha_instalacion = ?, Duracion_instalacion = ?, Costo_instalacion = ?, Estado_instalacion = ?, ID_usuario = ?, ID_producto = ? WHERE ID_instalacion = ?`,
      [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al actualizar la instalación", details: err });
        res.json({ message: "Instalación actualizada exitosamente", id });
      }
    );
  });
});

/**
 * ==================================================
 * DELETE instalación (solo ADMIN)
 * ==================================================
 * @swagger
 * /admin/instalacion/{id}:
 *   delete:
 *     summary: Eliminar instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación a eliminar
 *     responses:
 *       200:
 *         description: Instalación eliminada correctamente
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al eliminar
 */
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM instalacion WHERE ID_instalacion = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar la instalación", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Instalación no encontrada" });
    res.json({ message: "Instalación eliminada exitosamente", id });
  });
});

module.exports = router;
