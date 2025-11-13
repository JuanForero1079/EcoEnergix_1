const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

//   Obtener todos los usuarios
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      ID_usuario, 
      Nombre, 
      Correo_electronico, 
      Rol_usuario, 
      Tipo_documento, 
      Numero_documento, 
      Foto_usuario, 
      Estado_usuario
    FROM usuarios
  `;
  DB.query(sql, (err, result) => {
    if (err) {
      console.error("  Error al obtener los usuarios:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
    res.json(result);
  });
});

//   Obtener un usuario por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener usuario" });
    if (result.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result[0]);
  });
});

//   Crear un usuario
router.post("/", (req, res) => {
  const { Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO usuarios (Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(sql, [Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario], (err, result) => {
    if (err) {
      console.error("  Error al crear el usuario:", err);
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
    res.status(201).json({
      message: "  Usuario creado exitosamente",
      usuario: { ID_usuario: result.insertId, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario },
    });
  });
});

//   Actualizar un usuario
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const sql = `
    UPDATE usuarios SET 
      Nombre = ?, 
      Correo_electronico = ?, 
      Rol_usuario = ?, 
      Tipo_documento = ?, 
      Numero_documento = ?, 
      Foto_usuario = ?, 
      Estado_usuario = ?
    WHERE ID_usuario = ?
  `;

  DB.query(sql, [Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario, id], (err, result) => {
    if (err) {
      console.error("  Error al actualizar usuario:", err);
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }

    res.json({ message: "  Usuario actualizado correctamente" });
  });
});

//   Eliminar usuario
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err) {
      console.error("  Error al eliminar usuario:", err);
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "  Usuario eliminado correctamente" });
  });
});

module.exports = router;
