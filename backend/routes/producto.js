const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// GET all productos
router.get('/', (req, res) => {
  DB.query('SELECT * FROM producto', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los productos', details: err });
    res.json(result);
  });
});

// GET producto by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM producto WHERE ID_producto = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el producto', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result[0]);
  });
});

// CREATE producto
router.post('/', (req, res) => {
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;

  // Validación
  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el producto', details: err });

      const nuevoProducto = {
        ID_producto: result.insertId,
        Nombre_producto,
        Tipo_producto,
        Precio,
        Marca,
        Fecha_fabricacion,
        Garantia,
        ID_proveedor
      };

      res.status(201).json({ message: 'Producto creado exitosamente!', producto: nuevoProducto });
    }
  );
});

// UPDATE producto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;

  // Validación
  if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE producto SET Nombre_producto = ?, Tipo_producto = ?, Precio = ?, Marca = ?, Fecha_fabricacion = ?, Garantia = ?, ID_proveedor = ? WHERE ID_producto = ?',
    [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el producto', details: err });

      const productoActualizado = {
        ID_producto: id,
        Nombre_producto,
        Tipo_producto,
        Precio,
        Marca,
        Fecha_fabricacion,
        Garantia,
        ID_proveedor
      };

      res.json({ message: 'Producto actualizado exitosamente!', producto: productoActualizado });
    }
  );
});

// DELETE producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM producto WHERE ID_producto = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el producto', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }

    res.json({ message: 'Producto eliminado exitosamente!', id });
  });
});

module.exports = router;
