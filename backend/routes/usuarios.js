const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");
const { hashPassword } = require("../utils/password");

// =====================
// GET todos los usuarios
// =====================
router.get("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const sql = `
    SELECT ID_usuario, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario
    FROM usuarios
  `;
  DB.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "Error al obtener los usuarios" });
    res.json({ success: true, data: result });
  });
});

// =====================
// GET usuario por ID
// =====================
router.get("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("SELECT * FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "Error al obtener usuario" });
    if (result.length === 0)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, data: result[0] });
  });
});

// =====================
// POST crear usuario con hash
// =====================
router.post("/", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  try {
    let {
      Nombre,
      Correo_electronico,
      Rol_usuario,
      Contraseña,
      Tipo_documento,
      Numero_documento,
      Foto_usuario,
      Estado_usuario
    } = req.body;

    if (!Nombre || !Correo_electronico || !Rol_usuario || !Contraseña)
      return res.status(400).json({
        success: false,
        message: "Nombre, correo, rol y contraseña son obligatorios"
      });

    Contraseña = await hashPassword(Contraseña);

    const sql = `
      INSERT INTO usuarios 
      (Nombre, Correo_electronico, Rol_usuario, Contraseña, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    DB.query(
      sql,
      [
        Nombre,
        Correo_electronico,
        Rol_usuario,
        Contraseña,
        Tipo_documento || null,
        Numero_documento || null,
        Foto_usuario || null,
        Estado_usuario || "activo"
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({ success: false, message: "Error al crear usuario" });

        res.status(201).json({
          success: true,
          message: "Usuario creado exitosamente",
          data: {
            ID_usuario: result.insertId,
            Nombre,
            Correo_electronico,
            Rol_usuario,
            Tipo_documento,
            Numero_documento,
            Foto_usuario,
            Estado_usuario: Estado_usuario || "activo"
          }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =====================
// PUT actualizar usuario
// =====================
router.put("/:id", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  const { id } = req.params;
  let {
    Nombre,
    Correo_electronico,
    Rol_usuario,
    Contraseña,
    Tipo_documento,
    Numero_documento,
    Foto_usuario,
    Estado_usuario
  } = req.body;

  if (!Nombre || !Correo_electronico || !Rol_usuario)
    return res.status(400).json({
      success: false,
      message: "Nombre, correo y rol son obligatorios"
    });

  try {
    let sql, params;

    if (Contraseña) {
      Contraseña = await hashPassword(Contraseña);
      sql = `
        UPDATE usuarios 
        SET Nombre = ?, Correo_electronico = ?, Rol_usuario = ?, Contraseña = ?, 
            Tipo_documento = ?, Numero_documento = ?, Foto_usuario = ?, Estado_usuario = ?
        WHERE ID_usuario = ?
      `;
      params = [
        Nombre,
        Correo_electronico,
        Rol_usuario,
        Contraseña,
        Tipo_documento || null,
        Numero_documento || null,
        Foto_usuario || null,
        Estado_usuario || "activo",
        id
      ];
    } else {
      sql = `
        UPDATE usuarios 
        SET Nombre = ?, Correo_electronico = ?, Rol_usuario = ?, 
            Tipo_documento = ?, Numero_documento = ?, Foto_usuario = ?, Estado_usuario = ?
        WHERE ID_usuario = ?
      `;
      params = [
        Nombre,
        Correo_electronico,
        Rol_usuario,
        Tipo_documento || null,
        Numero_documento || null,
        Foto_usuario || null,
        Estado_usuario || "activo",
        id
      ];
    }

    DB.query(sql, params, (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: "Error al actualizar usuario" });

      if (result.affectedRows === 0)
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });

      res.json({ success: true, message: "Usuario actualizado correctamente" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =====================
// DELETE usuario
// =====================
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  DB.query("DELETE FROM usuarios WHERE ID_usuario = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "Error al eliminar usuario" });

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({ success: true, message: "Usuario eliminado correctamente" });
  });
});

// =====================
// POST carga masiva
// =====================
router.post("/bulk", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  const usuarios = req.body;

  if (!Array.isArray(usuarios) || usuarios.length === 0)
    return res.status(400).json({ success: false, message: "Se requiere un array de usuarios" });

  try {
    const values = [];

    for (const u of usuarios) {
      if (!u.Nombre || !u.Correo_electronico || !u.Rol_usuario || !u.Contraseña)
        throw new Error("Cada usuario debe tener Nombre, Correo, Rol y Contraseña");

      const hashed = await hashPassword(u.Contraseña);

      values.push([
        u.Nombre,
        u.Correo_electronico,
        u.Rol_usuario,
        hashed,
        u.Tipo_documento || null,
        u.Numero_documento || null,
        u.Foto_usuario || null,
        u.Estado_usuario || "activo"
      ]);
    }

    const sql = `
      INSERT INTO usuarios 
      (Nombre, Correo_electronico, Rol_usuario, Contraseña, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
      VALUES ?
    `;

    DB.query(sql, [values], (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: "Error al insertar usuarios" });

      res
        .status(201)
        .json({ success: true, message: `Se agregaron ${result.affectedRows} usuarios correctamente` });
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
