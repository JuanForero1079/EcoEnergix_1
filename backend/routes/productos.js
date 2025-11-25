const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: CRUD de productos y carga masiva
 */

/**
 * @swagger
 * /api/admin/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM producto", (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener los productos", details: err });
    res.status(200).json(result);
  });
});

/**
 * @swagger
 * /api/admin/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM producto WHERE ID_producto = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar el producto", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(result[0]);
  });
});

/**
 * @swagger
 * /api/admin/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_producto
 *               - Tipo_producto
 *               - Precio
 *               - Marca
 *               - Fecha_fabricacion
 *               - Garantia
 *               - ID_proveedor
 *             properties:
 *               Nombre_producto:
 *                 type: string
 *               Tipo_producto:
 *                 type: string
 *               Precio:
 *                 type: number
 *               Marca:
 *                 type: string
 *               Fecha_fabricacion:
 *                 type: string
 *                 format: date
 *               Garantia:
 *                 type: string
 *               ID_proveedor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post("/", (req, res) => {
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;
  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const query = `INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  DB.query(query, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear el producto", details: err });
    res.status(201).json({ message: "Producto creado exitosamente", producto: { ID_producto: result.insertId, Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } });
  });
});

/**
 * @swagger
 * /api/admin/productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Productos]
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
 *             properties:
 *               Nombre_producto:
 *                 type: string
 *               Tipo_producto:
 *                 type: string
 *               Precio:
 *                 type: number
 *               Marca:
 *                 type: string
 *               Fecha_fabricacion:
 *                 type: string
 *                 format: date
 *               Garantia:
 *                 type: string
 *               ID_proveedor:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;
  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  const query = `UPDATE producto SET Nombre_producto = ?, Tipo_producto = ?, Precio = ?, Marca = ?, Fecha_fabricacion = ?, Garantia = ?, ID_proveedor = ? WHERE ID_producto = ?`;
  DB.query(query, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el producto", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto actualizado exitosamente", producto: { ID_producto: id, Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } });
  });
});

/**
 * @swagger
 * /api/admin/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM producto WHERE ID_producto = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar el producto", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado para eliminar" });
    res.status(200).json({ message: "Producto eliminado exitosamente", id });
  });
});

/**
 * @swagger
 * /api/admin/productos/bulk:
 *   post:
 *     summary: Carga masiva de productos
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - Nombre_producto
 *                 - Tipo_producto
 *                 - Precio
 *                 - Marca
 *                 - Fecha_fabricacion
 *                 - Garantia
 *                 - ID_proveedor
 *               properties:
 *                 Nombre_producto:
 *                   type: string
 *                 Tipo_producto:
 *                   type: string
 *                 Precio:
 *                   type: number
 *                 Marca:
 *                   type: string
 *                 Fecha_fabricacion:
 *                   type: string
 *                   format: date
 *                 Garantia:
 *                   type: string
 *                 ID_proveedor:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Productos cargados correctamente
 */
router.post("/bulk", (req, res) => {
  const productos = req.body;
  if (!Array.isArray(productos) || productos.length === 0) return res.status(400).json({ message: "Debe enviar un arreglo de productos" });

  const query = `INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES ?`;
  const values = productos.map((p) => [p.Nombre_producto, p.Tipo_producto, p.Precio, p.Marca, p.Fecha_fabricacion, p.Garantia, p.ID_proveedor]);

  DB.query(query, [values], (err) => {
    if (err) return res.status(500).json({ error: "Error en la carga masiva", details: err });
    res.status(201).json({ message: "Carga masiva realizada correctamente", cantidad: productos.length });
  });
});

module.exports = router;
