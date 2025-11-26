const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: CRUD de productos y carga masiva
 */

// =====================
// GET: Todos los productos
// =====================
router.get("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  DB.query("SELECT * FROM producto", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener los productos", details: err });
    res.status(200).json(result);
  });
});

// =====================
// GET: Producto por ID
// =====================
router.get("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM producto WHERE ID_producto = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al buscar el producto", details: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(result[0]);
  });
});

// =====================
// POST: Crear producto
// =====================
router.post("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;

  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO producto 
    (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(query, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al crear el producto", details: err });

    res.status(201).json({
      message: "Producto creado exitosamente",
      producto: { ID_producto: result.insertId, Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor }
    });
  });
});

// =====================
// PUT: Actualizar producto
// =====================
router.put("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;

  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  const query = `
    UPDATE producto 
    SET Nombre_producto = ?, Tipo_producto = ?, Precio = ?, Marca = ?, Fecha_fabricacion = ?, Garantia = ?, ID_proveedor = ? 
    WHERE ID_producto = ?
  `;

  DB.query(query, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor, id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al actualizar el producto", details: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      producto: { ID_producto: id, Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor }
    });
  });
});

// =====================
// DELETE: Eliminar producto
// =====================
router.delete("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM producto WHERE ID_producto = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar el producto", details: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Producto no encontrado para eliminar" });

    res.status(200).json({ message: "Producto eliminado exitosamente", id });
  });
});

// =====================
// POST: Carga masiva de productos
// =====================
router.post("/bulk", verificarToken, verificarRol("Administrador"), (req, res) => {
  const productos = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: "Debe enviar un arreglo de productos" });
  }

  // Validación de cada producto
  for (const p of productos) {
    if (!p.Nombre_producto || !p.Tipo_producto || !p.Precio || !p.Marca || !p.Fecha_fabricacion || !p.Garantia || !p.ID_proveedor) {
      return res.status(400).json({ message: "Todos los campos son obligatorios en cada producto" });
    }
  }

  const query = `
    INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor)
    VALUES ?
  `;

  const values = productos.map(p => [
    p.Nombre_producto, p.Tipo_producto, p.Precio, p.Marca, p.Fecha_fabricacion, p.Garantia, p.ID_proveedor
  ]);

  DB.query(query, [values], (err) => {
    if (err) return res.status(500).json({ error: "Error en la carga masiva", details: err });
    res.status(201).json({ message: "Carga masiva realizada correctamente", cantidad: productos.length });
  });
});

module.exports = router;
