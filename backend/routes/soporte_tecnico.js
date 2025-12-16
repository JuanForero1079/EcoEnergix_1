const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Soportes
 *   description: CRUD de soporte técnico para todos los roles
 */

/**
 * ==================================================
 * GET: Obtener todos los soportes según rol
 * ==================================================
 * @swagger
 * /admin/soporte:
 *   get:
 *     summary: Obtener todos los soportes del usuario o rol correspondiente
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de soportes
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener soportes
 */
router.get("/", verificarToken, (req, res) => {
  const { id, rol } = req.user;
  const rolLower = rol.toLowerCase();

  let query = "SELECT * FROM soporte_tecnico";
  let params = [];

  if (rolLower === "cliente") {
    query += " WHERE ID_usuarioFK = ?";
    params.push(id);
  } else if (rolLower === "domiciliario") {
    query += " WHERE ID_domiciliario = ?";
    params.push(id);
  } else if (rolLower !== "administrador") {
    return res.status(403).json({ message: "Rol no autorizado" });
  }

  DB.query(query, params, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener soportes", details: err });

    res.json(result);
  });
});

/**
 * ==================================================
 * GET: Obtener soporte por ID (todos los roles)
 * ==================================================
 * @swagger
 * /admin/soporte/{id}:
 *   get:
 *     summary: Obtener un soporte por su ID
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte
 *     responses:
 *       200:
 *         description: Soporte encontrado
 *       403:
 *         description: No tienes permiso para ver este soporte
 *       404:
 *         description: Soporte no encontrado
 *       500:
 *         description: Error al buscar soporte
 */
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  DB.query("SELECT * FROM soporte_tecnico WHERE ID_soporte = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al buscar soporte", details: err });

    if (result.length === 0)
      return res.status(404).json({ message: "Soporte no encontrado" });

    const soporte = result[0];

    if (
      (rolLower === "cliente" && soporte.ID_usuarioFK !== userId) ||
      (rolLower === "domiciliario" && soporte.ID_domiciliario !== userId)
    ) {
      return res.status(403).json({ message: "No tienes permiso para ver este soporte" });
    }

    res.json(soporte);
  });
});

/**
 * ==================================================
 * POST: Crear soporte (todos los roles)
 * ==================================================
 * @swagger
 * /admin/soporte:
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
 *         description: Campos obligatorios incompletos
 *       500:
 *         description: Error al crear soporte
 */
router.post("/", verificarToken, (req, res) => {
  const {
    Fecha_solicitud,
    Descripcion_problema,
    Fecha_resolucion,
    ID_usuarioFK,
    ID_producto,
    ID_instalacion,
    ID_domiciliario,
  } = req.body;

  if (
    !Fecha_solicitud ||
    !Descripcion_problema ||
    !ID_usuarioFK ||
    !ID_producto ||
    !ID_instalacion ||
    !ID_domiciliario
  ) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  DB.query(
    "INSERT INTO soporte_tecnico (Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      Fecha_solicitud,
      Descripcion_problema,
      Fecha_resolucion || null,
      ID_usuarioFK,
      ID_producto,
      ID_instalacion,
      ID_domiciliario,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al crear soporte", details: err });

      res.status(201).json({
        message: "Soporte creado exitosamente",
        soporte: {
          ID_soporte: result.insertId,
          Fecha_solicitud,
          Descripcion_problema,
          Fecha_resolucion,
          ID_usuarioFK,
          ID_producto,
          ID_instalacion,
          ID_domiciliario,
        },
      });
    }
  );
});

/**
 * ==================================================
 * PUT: Actualizar soporte (roles propios)
 * ==================================================
 * @swagger
 * /admin/soporte/{id}:
 *   put:
 *     summary: Actualizar un soporte existente (solo roles propios)
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte
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
 *         description: Soporte actualizado exitosamente
 *       400:
 *         description: Campos obligatorios incompletos
 *       403:
 *         description: No tienes permiso para actualizar
 *       500:
 *         description: Error al actualizar soporte
 */
router.put("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const {
    Fecha_solicitud,
    Descripcion_problema,
    Fecha_resolucion,
    ID_usuarioFK,
    ID_producto,
    ID_instalacion,
    ID_domiciliario,
  } = req.body;

  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  if (
    !Fecha_solicitud ||
    !Descripcion_problema ||
    !ID_usuarioFK ||
    !ID_producto ||
    !ID_instalacion ||
    !ID_domiciliario
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  if (rolLower === "cliente" && ID_usuarioFK !== userId) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }

  if (rolLower === "domiciliario" && ID_domiciliario !== userId) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }

  DB.query(
    "UPDATE soporte_tecnico SET Fecha_solicitud = ?, Descripcion_problema = ?, Fecha_resolucion = ?, ID_usuarioFK = ?, ID_producto = ?, ID_instalacion = ?, ID_domiciliario = ? WHERE ID_soporte = ?",
    [
      Fecha_solicitud,
      Descripcion_problema,
      Fecha_resolucion || null,
      ID_usuarioFK,
      ID_producto,
      ID_instalacion,
      ID_domiciliario,
      id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Error al actualizar soporte", details: err });

      res.json({
        message: "Soporte actualizado exitosamente",
        soporte: {
          ID_soporte: id,
          Fecha_solicitud,
          Descripcion_problema,
          Fecha_resolucion,
          ID_usuarioFK,
          ID_producto,
          ID_instalacion,
          ID_domiciliario,
        },
      });
    }
  );
});

/**
 * ==================================================
 * DELETE: Eliminar soporte (roles propios / admin)
 * ==================================================
 * @swagger
 * /admin/soporte/{id}:
 *   delete:
 *     summary: Eliminar un soporte (solo roles propios o admin)
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte a eliminar
 *     responses:
 *       200:
 *         description: Soporte eliminado exitosamente
 *       403:
 *         description: No tienes permiso para eliminar
 *       404:
 *         description: Soporte no encontrado
 *       500:
 *         description: Error al eliminar soporte
 */
router.delete("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  let query = "DELETE FROM soporte_tecnico WHERE ID_soporte = ?";
  let params = [id];

  if (rolLower === "cliente") {
    query += " AND ID_usuarioFK = ?";
    params.push(userId);
  }

  if (rolLower === "domiciliario") {
    query += " AND ID_domiciliario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar soporte", details: err });

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Soporte no encontrado o no tienes permiso para eliminar",
      });

    res.json({ message: "Soporte eliminado exitosamente", id });
  });
});

module.exports = router;
