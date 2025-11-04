// routes/usuarios.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// 🔹 GET todos los usuarios (solo Administrador)
router.get("/", verificarToken, verificarRol("Administrador"), (req, res) => {
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
      console.error("❌ Error al obtener los usuarios:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }

    res.json(result);
  });
});

// 🔹 GET usuario por ID (Administrador o el mismo usuario)
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;

  if (
    req.user.Rol_usuario !== "Administrador" &&
    req.user.ID_usuario !== parseInt(id)
  ) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para ver este usuario" });
  }

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
    WHERE ID_usuario = ?
  `;

  DB.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al buscar el usuario:", err);
      return res.status(500).json({ error: "Error al buscar el usuario" });
    }

    if (result.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(result[0]);
  });
});

// 🔹 POST crear usuario (solo Administrador)
router.post("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  const {
    Nombre,
    Correo_electronico,
    Contraseña,
    Rol_usuario,
    Tipo_documento,
    Numero_documento,
    Foto_usuario,
    Estado_usuario,
  } = req.body;

  if (!Nombre || !Correo_electronico || !Contraseña || !Rol_usuario) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO usuarios 
    (Nombre, Correo_electronico, Contraseña, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(
    sql,
    [
      Nombre,
      Correo_electronico,
      Contraseña,
      Rol_usuario,
      Tipo_documento || null,
      Numero_documento || null,
      Foto_usuario || null,
      Estado_usuario || "Activo",
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al crear el usuario:", err);
        return res.status(500).json({ error: "Error al crear el usuario" });
      }

      res.status(201).json({
        message: "✅ Usuario creado exitosamente",
        usuario: {
          ID_usuario: result.insertId,
          Nombre,
          Correo_electronico,
          Rol_usuario,
          Tipo_documento,
          Numero_documento,
          Foto_usuario,
          Estado_usuario,
        },
      });
    }
  );
});

// 🔹 PUT actualizar usuario (Administrador o el mismo usuario)
router.put("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const {
    Nombre,
    Correo_electronico,
    Contraseña,
    Rol_usuario,
    Tipo_documento,
    Numero_documento,
    Foto_usuario,
    Estado_usuario,
  } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  if (
    req.user.Rol_usuario !== "Administrador" &&
    req.user.ID_usuario !== parseInt(id)
  ) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para actualizar este usuario" });
  }

  const sql = `
    UPDATE usuarios SET 
      Nombre = ?, 
      Correo_electronico = ?, 
      ${Contraseña ? "Contraseña = ?, " : ""}
      Rol_usuario = ?, 
      Tipo_documento = ?, 
      Numero_documento = ?, 
      Foto_usuario = ?, 
      Estado_usuario = ?
    WHERE ID_usuario = ?
  `;

  const params = Contraseña
    ? [
        Nombre,
        Correo_electronico,
        Contraseña,
        Rol_usuario,
        Tipo_documento || null,
        Numero_documento || null,
        Foto_usuario || null,
        Estado_usuario || "Activo",
        id,
      ]
    : [
        Nombre,
        Correo_electronico,
        Rol_usuario,
        Tipo_documento || null,
        Numero_documento || null,
        Foto_usuario || null,
        Estado_usuario || "Activo",
        id,
      ];

  DB.query(sql, params, (err) => {
    if (err) {
      console.error("❌ Error al actualizar el usuario:", err);
      return res.status(500).json({ error: "Error al actualizar el usuario" });
    }

    res.json({
      message: "✅ Usuario actualizado exitosamente",
      usuario: {
        ID_usuario: id,
        Nombre,
        Correo_electronico,
        Rol_usuario,
        Tipo_documento,
        Numero_documento,
        Foto_usuario,
        Estado_usuario,
      },
    });
  });
});

// 🔹 DELETE usuario (solo Administrador)
router.delete("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar el usuario:", err);
      return res.status(500).json({ error: "Error al eliminar el usuario" });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "✅ Usuario eliminado exitosamente", id });
  });
});

module.exports = router;
