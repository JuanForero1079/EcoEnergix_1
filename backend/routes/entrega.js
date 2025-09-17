const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// READ: obtener todas las entregas
router.get('/', (req, res) => {
  DB.query('SELECT * FROM entrega', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener entregas', details: err });
    res.json(result);
  });
});

// READ: obtener una entrega por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM entrega WHERE ID_entrega = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar la entrega', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Entrega no encontrada' });
    res.json(result[0]);
  });
});

// CREATE: agregar una entrega
router.post('/', (req, res) => {
  const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

  // Validación básica
  if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad) VALUES (?, ?, ?, ?)',
    [Fecha_entrega, ID_usuario, ID_producto, Cantidad],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear la entrega', details: err });

      const nuevaEntrega = {
        ID_entrega: result.insertId,
        Fecha_entrega,
        ID_usuario,
        ID_producto,
        Cantidad
      };

      res.status(201).json({ message: 'Entrega creada exitosamente!', entrega: nuevaEntrega });
    }
  );
});

// UPDATE: actualizar una entrega
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Fecha_entrega, Cantidad } = req.body;

  // Validación básica
  if (!Fecha_entrega || !Cantidad) {
    return res.status(400).json({ message: 'Fecha_entrega y Cantidad son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE entrega SET Fecha_entrega = ?, Cantidad = ? WHERE ID_entrega = ?',
    [Fecha_entrega, Cantidad, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la entrega', details: err });

      const entregaActualizada = {
        ID_entrega: id,
        Fecha_entrega,
        Cantidad
      };

      res.json({ message: 'Entrega actualizada exitosamente!', entrega: entregaActualizada });
    }
  );
});

// DELETE: eliminar una entrega
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM entrega WHERE ID_entrega = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la entrega', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Entrega no encontrada para eliminar' });
    }

    res.json({ message: 'Entrega eliminada exitosamente!', id });
  });
});

module.exports = router;
