const express = require('express');
const jwt = require('jsonwebtoken');
const DB = require('../db/connection');
const router = express.Router();

const JWT_SECRET = 'clave_secreta_super_segura'; // ideal usar process.env.JWT_SECRET

// Login
router.post('/login', (req, res) => {
  console.log('Body recibido:', req.body); // 👈 debug

  // aceptar ambos formatos: (email/password) o (correo/contrasena)
  const email = req.body.email || req.body.correo;
  const password = req.body.password || req.body.contrasena;

  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  const query = 'SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1';

  DB.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la BD' });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparar en texto plano (porque tu BD guarda "password123")
    if (password !== user['Contraseña']) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: user.Rol_usuario,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, rol: user.Rol_usuario });
  });
});

module.exports = router;
