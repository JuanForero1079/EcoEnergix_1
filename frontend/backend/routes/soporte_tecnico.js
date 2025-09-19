const express = require('express');
const router = express.Router();
const DB = require('../db/connection');

// GET all soportes
router.get('/', (req, res) => {
  DB.query('SELECT * FROM soporte_tecnico', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener soportes técnicos', details: err });
    res.json(result);
  });
});

// GET soporte by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  DB.query('SELECT * FROM soporte_tecnico WHERE ID_soporte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el soporte técnico', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Soporte técnico no encontrado' });
    res.json(result[0]);
  });
});

// CREATE soporte
router.post('/', (req, res) => {
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;

  // Validación
  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' });
  }

  DB.query(
    'INSERT INTO soporte_tecnico (Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el soporte técnico', details: err });

      const nuevoSoporte = {
        ID_soporte: result.insertId,
        Fecha_solicitud,
        Descripcion_problema,
        Fecha_resolucion,
        ID_usuarioFK,
        ID_producto,
        ID_instalacion,
        ID_domiciliario
      };

      res.status(201).json({ message: 'Soporte técnico creado exitosamente!', soporte: nuevoSoporte });
    }
  );
});

// UPDATE soporte
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario } = req.body;

  // Validación
  if (!Fecha_solicitud || !Descripcion_problema || !ID_usuarioFK || !ID_producto || !ID_instalacion || !ID_domiciliario) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
  }

  DB.query(
    'UPDATE soporte_tecnico SET Fecha_solicitud = ?, Descripcion_problema = ?, Fecha_resolucion = ?, ID_usuarioFK = ?, ID_producto = ?, ID_instalacion = ?, ID_domiciliario = ? WHERE ID_soporte = ?',
    [Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el soporte técnico', details: err });

      const soporteActualizado = {
        ID_soporte: id,
        Fecha_solicitud,
        Descripcion_problema,
        Fecha_resolucion,
        ID_usuarioFK,
        ID_producto,
        ID_instalacion,
        ID_domiciliario
      };

      res.json({ message: 'Soporte técnico actualizado exitosamente!', soporte: soporteActualizado });
    }
  );
});

// DELETE soporte
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM soporte_tecnico WHERE ID_soporte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el soporte técnico', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Soporte técnico no encontrado para eliminar' });
    }

    res.json({ message: 'Soporte técnico eliminado exitosamente!', id });
  });
});

module.exports = router;
