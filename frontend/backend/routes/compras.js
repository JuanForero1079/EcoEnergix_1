const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// READ: obtener todas las compras
router.get('/', (req, res) => {
  DB.query('SELECT * FROM compras', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las compras', details: err });
    res.json(result);
  });
});

// READ: obtener una compra por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM compras WHERE ID_compra = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar la compra', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(result[0]);
  });
});

// CREATE: agregar una compra
router.post('/', (req, res) => {
  const { ID_usuario, Fecha_compra, Monto_total, Estado } = req.body;

  // Validación básica
  if (!ID_usuario || !Fecha_compra || !Monto_total || !Estado) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO compras (ID_usuario, Fecha_compra, Monto_total, Estado) VALUES (?, ?, ?, ?)',
    [ID_usuario, Fecha_compra, Monto_total, Estado],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear la compra', details: err });

      const nuevaCompra = {
        ID_compra: result.insertId,
        ID_usuario,
        Fecha_compra,
        Monto_total,
        Estado
      };

      res.status(201).json({ message: 'Compra creada exitosamente!', compra: nuevaCompra });
    }
  );
});

// UPDATE: actualizar una compra
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Fecha_compra, Monto_total, Estado } = req.body;

  // Validación básica
  if (!Fecha_compra || !Monto_total || !Estado) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE compras SET Fecha_compra = ?, Monto_total = ?, Estado = ? WHERE ID_compra = ?',
    [Fecha_compra, Monto_total, Estado, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la compra', details: err });

      const compraActualizada = {
        ID_compra: id,
        Fecha_compra,
        Monto_total,
        Estado
      };

      res.json({ message: 'Compra actualizada exitosamente!', compra: compraActualizada });
    }
  );
});

// DELETE: eliminar una compra
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM compras WHERE ID_compra = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la compra', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Compra no encontrada para eliminar' });
    }

    res.json({ message: 'Compra eliminada exitosamente!', id });
  });
});

module.exports = router;
