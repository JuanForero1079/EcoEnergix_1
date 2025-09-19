const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// GET all instalaciones
router.get('/', (req, res) => {
  DB.query('SELECT * FROM instalacion', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las instalaciones', details: err });
    res.json(result);
  });
});

// GET instalacion by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM instalacion WHERE ID_instalacion = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar la instalación', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Instalación no encontrada' });
    res.json(result[0]);
  });
});

// CREATE instalacion
router.post('/', (req, res) => {
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;

  // Validación
  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  DB.query(
    'INSERT INTO instalacion (Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto) VALUES (?, ?, ?, ?, ?, ?)',
    [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear la instalación', details: err });

      const nuevaInstalacion = {
        ID_instalacion: result.insertId,
        Fecha_instalacion,
        Duracion_instalacion,
        Costo_instalacion,
        Estado_instalacion,
        ID_usuario,
        ID_producto
      };

      res.status(201).json({ message: 'Instalación creada exitosamente!', instalacion: nuevaInstalacion });
    }
  );
});

// UPDATE instalacion
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto } = req.body;

  // Validación
  if (!Fecha_instalacion || !Duracion_instalacion || !Costo_instalacion || !Estado_instalacion || !ID_usuario || !ID_producto) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE instalacion SET Fecha_instalacion = ?, Duracion_instalacion = ?, Costo_instalacion = ?, Estado_instalacion = ?, ID_usuario = ?, ID_producto = ? WHERE ID_instalacion = ?',
    [Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la instalación', details: err });

      const instalacionActualizada = {
        ID_instalacion: id,
        Fecha_instalacion,
        Duracion_instalacion,
        Costo_instalacion,
        Estado_instalacion,
        ID_usuario,
        ID_producto
      };

      res.json({ message: 'Instalación actualizada exitosamente!', instalacion: instalacionActualizada });
    }
  );
});

// DELETE instalacion
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM instalacion WHERE ID_instalacion = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la instalación', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Instalación no encontrada para eliminar' });
    }

    res.json({ message: 'Instalación eliminada exitosamente!', id });
  });
});

module.exports = router;
