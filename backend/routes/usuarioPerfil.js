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

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestión de perfil de usuario
 */

/**
 * @swagger
 * /api/usuario/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener perfil
 */
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
});

/**
 * @swagger
 * /api/usuario/perfil:
 *   put:
 *     summary: Actualizar datos del perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Tipo_documento
 *               - Numero_documento
 *             properties:
 *               Nombre:
 *                 type: string
 *               Tipo_documento:
 *                 type: string
 *               Numero_documento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Datos incompletos
 *       500:
 *         description: Error al actualizar perfil
 */
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { Nombre, Tipo_documento, Numero_documento } = req.body;

    if (!Nombre || !Tipo_documento || !Numero_documento)
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });

    await Usuario.updatePerfil(req.user.id, Nombre, Tipo_documento, Numero_documento);

    const user = await Usuario.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
});

/**
 * @swagger
 * /api/usuario/foto:
 *   post:
 *     summary: Subir o actualizar foto de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada correctamente
 *       400:
 *         description: No se envió ningún archivo
 *       500:
 *         description: Error al subir foto
 */
router.post(
  "/foto",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "No se subió ningún archivo" });

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
