const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Soportes
 *   description: Endpoints para gestionar soportes técnicos
 */

/**
 * @swagger
 * /api/admin/soportes:
 *   get:
 *     summary: Obtener todos los soportes técnicos
 *     tags: [Soportes]
 *     responses:
 *       200:
 *         description: Lista de soportes técnicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_soporte:
 *                     type: integer
 *                   Fecha_solicitud:
 *                     type: string
 *                     format: date
 *                   Descripcion_problema:
 *                     type: string
 *                   Fecha_resolucion:
 *                     type: string
 *                     format: date
 *                   ID_usuarioFK:
 *                     type: integer
 *                   ID_producto:
 *                     type: integer
 *                   ID_instalacion:
 *                     type: integer
 *                   ID_domiciliario:
 *                     type: integer
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM soporte_tecnico", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener soportes técnicos", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/admin/soportes/{id}:
 *   get:
 *     summary: Obtener un soporte técnico por ID
 *     tags: [Soportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte técnico
 *     responses:
 *       200:
 *         description: Soporte técnico encontrado
 *       404:
 *         description: Soporte técnico no encontrado
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM soporte_tecnico WHERE ID_soporte = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al buscar el soporte técnico", details: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Soporte técnico no encontrado" });
    res.json(result[0]);
  });
});

/**
 * @swagger
 * /api/admin/soportes:
 *   post:
 *     summary: Crear un nuevo soporte técnico
 *     tags: [Soportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_solicitud
 *               - Descripcion_problema
 *               - ID_usuarioFK
 *               - ID_producto
 *               - ID_instalacion
 *               - ID_domiciliario
 *             properties:
 *               Fecha_solicitud:
 *                 type: string
 *                 format: date
 *               Descripcion_problema:
 *                 type: string
 *               Fecha_resolucion:
 *                 type: string
 *                 format: date
 *               ID_usuarioFK:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *               ID_instalacion:
 *                 type: integer
 *               ID_domiciliario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Soporte técnico creado exitosamente
 *       400:
 *         description: Campos obligatorios incompletos
 */
router.post("/", (req, res) => {
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;

  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  DB.query(
    "INSERT INTO soporte_tecnico (Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al crear el soporte técnico", details: err });

      const nuevoSoporte = { ID_soporte: result.insertId, Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario };
      res.status(201).json({ message: "Soporte técnico creado exitosamente!", soporte: nuevoSoporte });
    }
  );
});

/**
 * @swagger
 * /api/admin/soportes/{id}:
 *   put:
 *     summary: Actualizar un soporte técnico
 *     tags: [Soportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte técnico a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_solicitud
 *               - Descripcion_problema
 *               - ID_usuarioFK
 *               - ID_producto
 *               - ID_instalacion
 *               - ID_domiciliario
 *             properties:
 *               Fecha_solicitud:
 *                 type: string
 *                 format: date
 *               Descripcion_problema:
 *                 type: string
 *               Fecha_resolucion:
 *                 type: string
 *                 format: date
 *               ID_usuarioFK:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *               ID_instalacion:
 *                 type: integer
 *               ID_domiciliario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Soporte técnico actualizado exitosamente
 *       400:
 *         description: Campos obligatorios incompletos
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;

  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    "UPDATE soporte_tecnico SET Fecha_solicitud = ?, Descripcion_problema = ?, Fecha_resolucion = ?, ID_usuarioFK = ?, ID_producto = ?, ID_instalacion = ?, ID_domiciliario = ? WHERE ID_soporte = ?",
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar el soporte técnico", details: err });
      const soporteActualizado = { ID_soporte: id, Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario };
      res.json({ message: "Soporte técnico actualizado exitosamente!", soporte: soporteActualizado });
    }
  );
});

/**
 * @swagger
 * /api/admin/soportes/{id}:
 *   delete:
 *     summary: Eliminar un soporte técnico
 *     tags: [Soportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte técnico a eliminar
 *     responses:
 *       200:
 *         description: Soporte técnico eliminado exitosamente
 *       404:
 *         description: Soporte técnico no encontrado
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM soporte_tecnico WHERE ID_soporte = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el soporte técnico", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Soporte técnico no encontrado para eliminar" });
    res.json({ message: "Soporte técnico eliminado exitosamente!", id });
  });
});

module.exports = router;
