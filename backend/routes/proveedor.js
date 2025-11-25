const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: CRUD de proveedores y carga masiva
 */

/**
 * @swagger
 * /api/admin/proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 */
router.get("/", (req, res) => {
  DB.query(
    "SELECT ID_proveedor, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario FROM proveedor",
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al obtener los proveedores", details: err });
      res.json(result);
    }
  );
});

/**
 * @swagger
 * /api/admin/proveedores/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *       404:
 *         description: Proveedor no encontrado
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query(
    "SELECT ID_proveedor, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario FROM proveedor WHERE ID_proveedor = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al buscar el proveedor", details: err });
      if (result.length === 0) return res.status(404).json({ message: "Proveedor no encontrado" });
      res.json(result[0]);
    }
  );
});

/**
 * @swagger
 * /api/admin/proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_empresa
 *               - Dirección
 *               - Teléfono
 *               - Correo_electronico
 *               - ID_usuario
 *             properties:
 *               Nombre_empresa:
 *                 type: string
 *               Dirección:
 *                 type: string
 *               Teléfono:
 *                 type: string
 *               Correo_electronico:
 *                 type: string
 *               ID_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 */
router.post("/", (req, res) => {
  const { Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } = req.body;
  if (!Nombre_empresa || !Dirección || !Teléfono || !Correo_electronico || !ID_usuario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    `INSERT INTO proveedor (Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario) VALUES (?, ?, ?, ?, ?)`,
    [Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear el proveedor", details: err });
      res.status(201).json({ message: "Proveedor creado exitosamente!", proveedor: { ID_proveedor: result.insertId, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } });
    }
  );
});

/**
 * @swagger
 * /api/admin/proveedores/{id}:
 *   put:
 *     summary: Actualizar un proveedor existente
 *     tags: [Proveedores]
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
 *               - Nombre_empresa
 *               - Dirección
 *               - Teléfono
 *               - Correo_electronico
 *               - ID_usuario
 *             properties:
 *               Nombre_empresa:
 *                 type: string
 *               Dirección:
 *                 type: string
 *               Teléfono:
 *                 type: string
 *               Correo_electronico:
 *                 type: string
 *               ID_usuario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *       404:
 *         description: Proveedor no encontrado
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } = req.body;
  if (!Nombre_empresa || !Dirección || !Teléfono || !Correo_electronico || !ID_usuario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    `UPDATE proveedor SET Nombre_empresa = ?, Dirección = ?, Teléfono = ?, Correo_electronico = ?, ID_usuario = ? WHERE ID_proveedor = ?`,
    [Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar el proveedor", details: err });
      res.json({ message: "Proveedor actualizado exitosamente!", proveedor: { ID_proveedor: id, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } });
    }
  );
});

/**
 * @swagger
 * /api/admin/proveedores/{id}:
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM proveedor WHERE ID_proveedor = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el proveedor", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Proveedor no encontrado para eliminar" });
    res.json({ message: "Proveedor eliminado exitosamente!", id });
  });
});

/**
 * @swagger
 * /api/admin/proveedores/bulk:
 *   post:
 *     summary: Carga masiva de proveedores
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - Nombre_empresa
 *                 - Dirección
 *                 - Teléfono
 *                 - Correo_electronico
 *                 - ID_usuario
 *               properties:
 *                 Nombre_empresa:
 *                   type: string
 *                 Dirección:
 *                   type: string
 *                 Teléfono:
 *                   type: string
 *                 Correo_electronico:
 *                   type: string
 *                 ID_usuario:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Proveedores cargados correctamente
 */
router.post("/bulk", (req, res) => {
  const proveedores = req.body;
  if (!Array.isArray(proveedores) || proveedores.length === 0) return res.status(400).json({ message: "Se requiere un array de proveedores" });

  try {
    const values = proveedores.map((p) => {
      if (!p.Nombre_empresa || !p.Dirección || !p.Teléfono || !p.Correo_electronico || !p.ID_usuario) {
        throw new Error("Cada proveedor debe tener Nombre_empresa, Dirección, Teléfono, Correo_electronico e ID_usuario");
      }
      return [p.Nombre_empresa, p.Dirección, p.Teléfono, p.Correo_electronico, p.ID_usuario];
    });

    const sql = `INSERT INTO proveedor (Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario) VALUES ?`;
    DB.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: "Error al insertar los proveedores" });
      res.status(201).json({ message: `Se agregaron ${result.affectedRows} proveedores correctamente` });
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
