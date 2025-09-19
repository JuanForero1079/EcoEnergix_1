const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// GET all pagos
router.get('/', (req, res) => {
  DB.query('SELECT * FROM pago', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los pagos', details: err });
    res.json(result);
  });
});

// GET pago by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM pago WHERE ID_pago = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el pago', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result[0]);
  });
});

// CREATE pago
router.post('/', (req, res) => {
  const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

  // Validación
  if (!ID_usuario || !Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO pago (ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago) VALUES (?, ?, ?, ?, ?)',
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el pago', details: err });

      const nuevoPago = {
        ID_pago: result.insertId,
        ID_usuario,
        Monto,
        Fecha_pago,
        Metodo_pago,
        Estado_pago
      };

      res.status(201).json({ message: 'Pago creado exitosamente!', pago: nuevoPago });
    }
  );
});

// UPDATE pago
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

  // Validación
  if (!ID_usuario || !Monto || !Fecha_pago || !Metodo_pago || !Estado_pago) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE pago SET ID_usuario = ?, Monto = ?, Fecha_pago = ?, Metodo_pago = ?, Estado_pago = ? WHERE ID_pago = ?',
    [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el pago', details: err });

      const pagoActualizado = {
        ID_pago: id,
        ID_usuario,
        Monto,
        Fecha_pago,
        Metodo_pago,
        Estado_pago
      };

      res.json({ message: 'Pago actualizado exitosamente!', pago: pagoActualizado });
    }
  );
});

// DELETE pago
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM pago WHERE ID_pago = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el pago', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado para eliminar' });
    }

    res.json({ message: 'Pago eliminado exitosamente!', id });
  });
});

module.exports = router;
