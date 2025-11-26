const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Soportes
 *   description: Endpoints para gestionar soportes técnicos
 */

/**
 * @swagger
 * /api/soportes:
 *   get:
 *     summary: Obtener todos los soportes según rol
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de soportes según permisos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", verificarToken, (req, res) => {
  const { ID_usuario, rol } = req.user;

  let query = "SELECT * FROM soporte_tecnico";
  let params = [];

  if (rol === "Cliente") {
    query += " WHERE ID_usuarioFK = ?";
    params.push(ID_usuario);
  } else if (rol === "Domiciliario") {
    query += " WHERE ID_domiciliario = ?";
    params.push(ID_usuario);
  } else if (rol !== "Administrador") {
    return res.status(403).json({ message: "Rol no autorizado" });
  }

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener soportes", details: err });
    res.json(result);
  });
});

/**
 * @swagger
 * /api/soportes/{id}:
 *   get:
 *     summary: Obtener un soporte por ID
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Soporte encontrado
 *       404:
 *         description: Soporte no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { ID_usuario, rol } = req.user;

  DB.query("SELECT * FROM soporte_tecnico WHERE ID_soporte = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar soporte", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Soporte no encontrado" });

    const soporte = result[0];

    if (
      (rol === "Cliente" && soporte.ID_usuarioFK !== ID_usuario) ||
      (rol === "Domiciliario" && soporte.ID_domiciliario !== ID_usuario)
    ) {
      return res.status(403).json({ message: "No tienes permiso para ver este soporte" });
    }

    res.json(soporte);
  });
});

/**
 * @swagger
 * /api/soportes:
 *   post:
 *     summary: Crear un nuevo soporte
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
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
 *         description: Soporte creado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */
router.post("/", verificarToken, (req, res) => {
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;

  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  DB.query(
    "INSERT INTO soporte_tecnico (Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion || null, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear soporte", details: err });
      const nuevoSoporte = { ID_soporte: result.insertId, Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario };
      res.status(201).json({ message: "Soporte creado exitosamente", soporte: nuevoSoporte });
    }
  );
});

/**
 * @swagger
 * /api/soportes/{id}:
 *   put:
 *     summary: Actualizar un soporte existente
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Soporte actualizado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;
  const { rol, ID_usuario } = req.user;

  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  // Validar que cliente o domiciliario solo puedan actualizar sus soportes
  if (rol === "Cliente" && ID_usuarioFK !== ID_usuario) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }
  if (rol === "Domiciliario" && ID_domiciliario !== ID_usuario) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }

  DB.query(
    "UPDATE soporte_tecnico SET Fecha_solicitud = ?, Descripcion_problema = ?, Fecha_resolucion = ?, ID_usuarioFK = ?, ID_producto = ?, ID_instalacion = ?, ID_domiciliario = ? WHERE ID_soporte = ?",
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion || null, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar soporte", details: err });
      res.json({ message: "Soporte actualizado exitosamente", soporte: { ID_soporte: id, Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } });
    }
  );
});

/**
 * @swagger
 * /api/soportes/{id}:
 *   delete:
 *     summary: Eliminar un soporte
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Soporte eliminado exitosamente
 *       403:
 *         description: Rol no autorizado
 *       404:
 *         description: Soporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { rol, ID_usuario } = req.user;

  // Validar permisos según rol
  let query = "DELETE FROM soporte_tecnico WHERE ID_soporte = ?";
  let params = [id];

  if (rol === "Cliente") query += " AND ID_usuarioFK = ?";
  if (rol === "Domiciliario") query += " AND ID_domiciliario = ?";
  if (rol === "Cliente" || rol === "Domiciliario") params.push(ID_usuario);

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar soporte", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Soporte no encontrado o no tienes permiso para eliminar" });
    res.json({ message: "Soporte eliminado exitosamente", id });
  });
});

module.exports = router;
