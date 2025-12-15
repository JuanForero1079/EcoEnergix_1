// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Usuario = require("../models/Usuario");
const { verificarUsuario } = require("../middleware/authUsuario");

// ============================
// Crear carpeta uploads/usuarios si no existe
// ============================
const uploadsDir = path.join(__dirname, "../uploads/usuarios");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ============================
// Configuración Multer
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.ID_usuario}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

// ============================
// GET perfil
// ============================
router.get("/perfil", verificarUsuario, async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.user.ID_usuario);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ============================
// PUT actualizar perfil + foto
// ============================
router.put("/perfil", verificarUsuario, upload.single("foto"), async (req, res, next) => {
  try {
    const { Nombre, Tipo_documento, Numero_documento } = req.body;

    if (!Nombre || !Tipo_documento || !Numero_documento)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    // Actualizar datos básicos
    await Usuario.updatePerfil(req.user.ID_usuario, Nombre, Tipo_documento, Numero_documento);

    // Si viene archivo, actualizar foto
    if (req.file) {
      const rutaFoto = `/uploads/usuarios/${req.file.filename}`;
      await Usuario.updateFoto(req.user.ID_usuario, rutaFoto);
    }

    // Devolver usuario actualizado
    const usuarioActualizado = await Usuario.findById(req.user.ID_usuario);
    res.json(usuarioActualizado);
  } catch (err) {
    next(err);
  }
});

// ============================
// POST solo subir foto (opcional)
// ============================
router.post("/perfil/foto", verificarUsuario, upload.single("foto"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se envió ninguna imagen" });

    const rutaFoto = `/uploads/usuarios/${req.file.filename}`;
    await Usuario.updateFoto(req.user.ID_usuario, rutaFoto);

    const usuarioActualizado = await Usuario.findById(req.user.ID_usuario);
    res.json({ message: "Foto actualizada correctamente", usuario: usuarioActualizado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
