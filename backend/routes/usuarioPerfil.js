const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { verificarToken } = require("../middleware/authUsuario");  // Middleware de autenticación
const Usuario = require("../model/Usuario");  // Modelo Usuario

// ===========================
// Configuración de Multer
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta específica para fotos de usuario
    cb(null, "uploads/usuarios");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `usuario-${req.user.id}-${Date.now()}${ext}`);
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

// ===========================
// GET /api/usuario/perfil
// ===========================
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json(user);  // Retorna datos del perfil
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
});

// ===========================
// PUT /api/usuario/perfil
// ===========================
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { Nombre, Tipo_documento, Numero_documento } = req.body;

    await Usuario.updatePerfil(req.user.id, Nombre, Tipo_documento, Numero_documento);

    const user = await Usuario.findById(req.user.id);
    res.json(user);  // Retorna perfil actualizado
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
});

// ===========================
// POST /api/usuario/foto
// ===========================
router.post(
  "/foto",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "No se subió ningún archivo" });

      // Guardar ruta relativa correcta
      const rutaFoto = `/uploads/usuarios/${req.file.filename}`;

      await Usuario.updateFoto(req.user.id, rutaFoto);

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
