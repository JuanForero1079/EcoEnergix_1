// src/routes/instalaciones.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Instalaciones
 *   description: Endpoints para CRUD de instalaciones
 */

/**
 * @swagger
 * /api/admin/instalaciones:
 *   get:
 *     summary: Obtener todas las instalaciones
 *     tags: [Instalaciones]
 *     responses:
 *       200:
 *         description: Lista de instalaciones
 *       500:
 *         description: Error del servidor
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM instalacion", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener las instalaciones", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/admin/instalaciones/{id}:
 *   get:
 *     summary: Obtener instalación por ID
 *     tags: [Instalaciones]
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
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query(
    "SELECT * FROM instalacion WHERE ID_instalacion = ?",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al buscar la instalación", details: err });
      if (result.length === 0)
        return res.status(404).json({ message: "Instalación no encontrada" });
      res.json(result[0]);
    }
  );
});

/**
 * @swagger
 * /api/admin/instalaciones:
 *   post:
 *     summary: Crear una nueva instalación
 *     tags: [Instalaciones]
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
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Instalación creada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */
router.post("/", (req, res) => {
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;

  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    "INSERT INTO instalacion (Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto) VALUES (?, ?, ?, ?, ?, ?)",
    [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear la instalación", details: err });

      const nuevaInstalacion = {
        ID_instalacion: result.insertId,
        Fecha_instalacion,
        Duracion_instalacion,
        Costo_instalacion,
        Estado_instalacion,
        ID_usuario,
        ID_producto,
      };

      res.status(201).json({ message: "Instalación creada exitosamente!", instalacion: nuevaInstalacion });
    }
  );
});

/**
 * @swagger
 * /api/admin/instalaciones/{id}:
 *   put:
 *     summary: Actualizar una instalación existente
 *     tags: [Instalaciones]
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
 *               ID_usuario:
 *                 type: integer
 *               ID_producto:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Instalación actualizada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;

  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    "UPDATE instalacion SET Fecha_instalacion = ?, Duracion_instalacion = ?, Costo_instalacion = ?, Estado_instalacion = ?, ID_usuario = ?, ID_producto = ? WHERE ID_instalacion = ?",
    [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar la instalación", details: err });

      const instalacionActualizada = {
        ID_instalacion: id,
        Fecha_instalacion,
        Duracion_instalacion,
        Costo_instalacion,
        Estado_instalacion,
        ID_usuario,
        ID_producto,
      };

      res.json({ message: "Instalación actualizada exitosamente!", instalacion: instalacionActualizada });
    }
  );
});

/**
 * @swagger
 * /api/admin/instalaciones/{id}:
 *   delete:
 *     summary: Eliminar una instalación
 *     tags: [Instalaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación a eliminar
 *     responses:
 *       200:
 *         description: Instalación eliminada exitosamente
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM instalacion WHERE ID_instalacion = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar la instalación", details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Instalación no encontrada para eliminar" });
    }

    res.json({ message: "Instalación eliminada exitosamente!", id });
  });
});

module.exports = router;
