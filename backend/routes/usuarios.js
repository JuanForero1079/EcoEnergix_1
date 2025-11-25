const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/admin/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      ID_usuario, 
      Nombre, 
      Correo_electronico, 
      Rol_usuario, 
      Tipo_documento, 
      Numero_documento, 
      Foto_usuario, 
      Estado_usuario
    FROM usuarios
  `;

  DB.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener los usuarios" });
    res.json({ success: true, data: result });
  });
});

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("SELECT * FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener usuario" });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({ success: true, data: result[0] });
  });
});

/**
 * @swagger
 * /api/admin/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo_electronico
 *               - Rol_usuario
 *             properties:
 *               Nombre:
 *                 type: string
 *               Correo_electronico:
 *                 type: string
 *               Rol_usuario:
 *                 type: string
 *               Tipo_documento:
 *                 type: string
 *               Numero_documento:
 *                 type: string
 *               Foto_usuario:
 *                 type: string
 *               Estado_usuario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos incompletos
 */
router.post("/", (req, res) => {
  const { Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario) return res.status(400).json({ success: false, message: "Nombre, correo y rol son obligatorios" });

  const sql = `
    INSERT INTO usuarios 
      (Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(sql, [Nombre, Correo_electronico, Rol_usuario, Tipo_documento || null, Numero_documento || null, Foto_usuario || null, Estado_usuario || "activo"], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al crear usuario" });

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { ID_usuario: result.insertId, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario }
    });
  });
});

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo_electronico
 *               - Rol_usuario
 *             properties:
 *               Nombre:
 *                 type: string
 *               Correo_electronico:
 *                 type: string
 *               Rol_usuario:
 *                 type: string
 *               Tipo_documento:
 *                 type: string
 *               Numero_documento:
 *                 type: string
 *               Foto_usuario:
 *                 type: string
 *               Estado_usuario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos incompletos
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario) return res.status(400).json({ success: false, message: "Nombre, correo y rol son obligatorios" });

  const sql = `
    UPDATE usuarios SET 
      Nombre = ?, 
      Correo_electronico = ?, 
      Rol_usuario = ?, 
      Tipo_documento = ?, 
      Numero_documento = ?, 
      Foto_usuario = ?, 
      Estado_usuario = ?
    WHERE ID_usuario = ?
  `;

  DB.query(sql, [Nombre, Correo_electronico, Rol_usuario, Tipo_documento || null, Numero_documento || null, Foto_usuario || null, Estado_usuario || "activo", id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al actualizar usuario" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({ success: true, message: "Usuario actualizado correctamente" });
  });
});

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar usuario" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({ success: true, message: "Usuario eliminado correctamente" });
  });
});

/**
 * @swagger
 * /api/admin/usuarios/bulk:
 *   post:
 *     summary: Carga masiva de usuarios
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - Nombre
 *                 - Correo_electronico
 *                 - Rol_usuario
 *               properties:
 *                 Nombre:
 *                   type: string
 *                 Correo_electronico:
 *                   type: string
 *                 Rol_usuario:
 *                   type: string
 *                 Tipo_documento:
 *                   type: string
 *                 Numero_documento:
 *                   type: string
 *                 Foto_usuario:
 *                   type: string
 *                 Estado_usuario:
 *                   type: string
 *     responses:
 *       201:
 *         description: Usuarios agregados correctamente
 *       400:
 *         description: Datos incompletos o formato incorrecto
 */
router.post("/bulk", (req, res) => {
  const usuarios = req.body;

  if (!Array.isArray(usuarios) || usuarios.length === 0) return res.status(400).json({ success: false, message: "Se requiere un array de usuarios" });

  try {
    const values = usuarios.map(u => {
      if (!u.Nombre || !u.Correo_electronico || !u.Rol_usuario) throw new Error("Cada usuario debe tener Nombre, Correo y Rol");
      return [u.Nombre, u.Correo_electronico, u.Rol_usuario, u.Tipo_documento || null, u.Numero_documento || null, u.Foto_usuario || null, u.Estado_usuario || "activo"];
    });

    const sql = `
      INSERT INTO usuarios 
        (Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
      VALUES ?
    `;

    DB.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error al insertar usuarios" });
      res.status(201).json({ success: true, message: `Se agregaron ${result.affectedRows} usuarios correctamente` });
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
