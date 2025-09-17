const express = require('express');
const router = express.Router();
const DB = require('../db/connection');
const { verificarToken, verificarRol } = require('../middleware/auth');

// GET all usuarios (solo Admin puede verlos)
router.get('/', verificarToken, verificarRol('Admin'), (req, res) => {
  DB.query('SELECT * FROM usuarios', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los usuarios', details: err });
    res.json(result);
  });
});

// GET usuario by ID (Admin o el mismo usuario)
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  // si no es Admin, solo puede ver su propio perfil
  if (req.user.rol !== 'Admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'No tienes permisos para ver este usuario' });
  }

  DB.query('SELECT * FROM usuarios WHERE ID_usuario = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el usuario', details: err });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result[0]);
  });
});

// CREATE usuario (solo Admin)
router.post('/', verificarToken, verificarRol('Admin'), (req, res) => {
  const { Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Contraseña || !Rol_usuario || !Tipo_documento || !Numero_documento) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  DB.query(
    'INSERT INTO usuarios (Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario || null, Estado_usuario || 'Activo'],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el usuario', details: err });

      res.status(201).json({ 
        message: 'Usuario creado exitosamente!', 
        usuario: { ID_usuario: result.insertId, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario: Foto_usuario || null, Estado_usuario: Estado_usuario || 'Activo' }
      });
    }
  );
});

// UPDATE usuario (Admin o el mismo usuario)
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Contraseña || !Rol_usuario || !Tipo_documento || !Numero_documento) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' });
  }

  // Solo Admin puede actualizar a otros, un usuario solo a sí mismo
  if (req.user.rol !== 'Admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'No tienes permisos para actualizar este usuario' });
  }

  DB.query(
    'UPDATE usuarios SET Nombre = ?, Correo_electronico = ?, Contraseña = ?, Rol_usuario = ?, Tipo_documento = ?, Numero_documento = ?, Foto_usuario = ?, Estado_usuario = ? WHERE ID_usuario = ?',
    [Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario || null, Estado_usuario || 'Activo', id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el usuario', details: err });

      res.json({ 
        message: 'Usuario actualizado exitosamente!', 
        usuario: { ID_usuario: id, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario: Foto_usuario || null, Estado_usuario: Estado_usuario || 'Activo' }
      });
    }
  );
});

// DELETE usuario (solo Admin)
router.delete('/:id', verificarToken, verificarRol('Admin'), (req, res) => {
  const { id } = req.params;

  DB.query('DELETE FROM usuarios WHERE ID_usuario = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el usuario', details: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });

    res.json({ message: 'Usuario eliminado exitosamente!', id });
  });
});

module.exports = router;
