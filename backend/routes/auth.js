
const express = require('express');
const jwt = require('jsonwebtoken');
const DB = require('../db/connection');
const router = express.Router();

const JWT_SECRET = 'clave_secreta_super_segura'; // ideal usar process.env.JWT_SECRET

// Ruta POST /login
router.post('/login', (req, res) => {
  const correo = req.body.correo;
  const contraseña = req.body.contraseña;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Datos de sesión incompletos.' });
  }

  const query = 'SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1';

  DB.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la BD' });
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = results[0];

    if (contraseña !== user['Contraseña']) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: user.Rol_usuario,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, usuario: user });
  });
});

module.exports = router;
