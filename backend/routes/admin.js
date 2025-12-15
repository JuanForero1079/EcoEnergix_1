// routes/admin.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require("../db/connection");
const { verificarAdmin } = require("../middleware/authAdmin");

// ===========================
// Configuración de Multer
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin-${req.admin.ID_usuario}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

// ===========================
// GET /api/admin/perfil
// ===========================
router.get("/perfil", verificarAdmin, async (req, res) => {
  try {
    const [rows] = await pool
      .promise()
      .query(
        `SELECT 
          ID_usuario,
          Nombre,
          Correo_electronico,
          Tipo_documento,
          Numero_documento,
          Foto_usuario
        FROM usuarios
        WHERE ID_usuario = ? AND Rol_usuario = 'administrador'`,
        [req.admin.ID_usuario]
      );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
});

// ===========================
// PUT /api/admin/perfil
// ===========================
router.put("/perfil", verificarAdmin, async (req, res) => {
  try {
    const { Nombre, Correo_electronico, Tipo_documento, Numero_documento } =
      req.body;

    await pool
      .promise()
      .query(
        `UPDATE usuarios 
         SET Nombre = ?, Correo_electronico = ?, Tipo_documento = ?, Numero_documento = ?
         WHERE ID_usuario = ? AND Rol_usuario = 'administrador'`,
        [
          Nombre,
          Correo_electronico,
          Tipo_documento,
          Numero_documento,
          req.admin.ID_usuario,
        ]
      );

    const [updated] = await pool
      .promise()
      .query(
        `SELECT 
          ID_usuario,
          Nombre,
          Correo_electronico,
          Tipo_documento,
          Numero_documento,
          Foto_usuario
        FROM usuarios
        WHERE ID_usuario = ?`,
        [req.admin.ID_usuario]
      );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
});

// ===========================
// POST /api/admin/foto
// ===========================
router.post(
  "/foto",
  verificarAdmin,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No se subió ningún archivo" });
      }

      const rutaFoto = `/uploads/${req.file.filename}`;

      await pool
        .promise()
        .query(
          "UPDATE usuarios SET Foto_usuario = ? WHERE ID_usuario = ?",
          [rutaFoto, req.admin.ID_usuario]
        );

      res.json({
        msg: "Foto actualizada correctamente",
        Foto_usuario: rutaFoto,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error al subir foto" });
    }
  }
);

module.exports = router;
