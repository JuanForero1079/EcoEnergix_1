const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// GET all proveedores
router.get('/', (req, res) => {
  DB.query('SELECT * FROM proveedor', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los proveedores', details: err });
    res.json(result);
  });
});

// GET proveedor by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM proveedor WHERE ID_proveedor = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el proveedor', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(result[0]);
  });
});

// CREATE proveedor
router.post('/', (req, res) => {
  const { Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } = req.body;

  // Validación
  if (!Nombre_empresa || !Dirección || !Teléfono || !Correo_electronico || !ID_usuario) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO proveedor (Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario) VALUES (?, ?, ?, ?, ?)',
    [Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el proveedor', details: err });

      const nuevoProveedor = {
        ID_proveedor: result.insertId,
        Nombre_empresa,
        Dirección,
        Teléfono,
        Correo_electronico,
        ID_usuario
      };

      res.status(201).json({ message: 'Proveedor creado exitosamente!', proveedor: nuevoProveedor });
    }
  );
});

// UPDATE proveedor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario } = req.body;

  // Validación
  if (!Nombre_empresa || !Dirección || !Teléfono || !Correo_electronico || !ID_usuario) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE proveedor SET Nombre_empresa = ?, Dirección = ?, Teléfono = ?, Correo_electronico = ?, ID_usuario = ? WHERE ID_proveedor = ?',
    [Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el proveedor', details: err });

      const proveedorActualizado = {
        ID_proveedor: id,
        Nombre_empresa,
        Dirección,
        Teléfono,
        Correo_electronico,
        ID_usuario
      };

      res.json({ message: 'Proveedor actualizado exitosamente!', proveedor: proveedorActualizado });
    }
  );
});

// DELETE proveedor
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM proveedor WHERE ID_proveedor = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el proveedor', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado para eliminar' });
    }

    res.json({ message: 'Proveedor eliminado exitosamente!', id });
  });
});

module.exports = router;
