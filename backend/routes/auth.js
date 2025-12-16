const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Middleware para verificar token de usuario
const { verificarUsuario } = require("../middleware/authUsuario");
// Middleware para la subida de fotos de perfil
const uploadUsuario = require("../middleware/uploadUsuario");

/* =======================================================
   REGISTRO
======================================================= */
router.post("/register", authController.register);

/* =======================================================
   VERIFICACIÓN DE CORREO (Al hacer clic en el enlace de verificación)
======================================================= */
router.get("/verificar/:token", authController.verifyEmail);

/* =======================================================
   LOGIN (Autenticación para obtener tokens)
======================================================= */
router.post("/login", authController.login);

/* =======================================================
   PERFIL DE USUARIO (PROTEGIDO)
   Rutas para obtener y actualizar el perfil, requiere autenticación
======================================================= */
router.get("/perfil", verificarUsuario, authController.getPerfil);

router.put("/perfil", verificarUsuario, authController.updatePerfil);

/* Subir foto de perfil */
router.post(
  "/perfil/foto",
  verificarUsuario, // Verifica que el usuario esté autenticado
  uploadUsuario.single("foto"), // Middleware de subida de archivos
  authController.uploadFoto // Controlador para guardar la foto
);

/* =======================================================
   ELIMINAR CUENTA (PROTEGIDO + CONFIRMACIÓN DE CONTRASEÑA)
   Utiliza POST en vez de DELETE por razones de seguridad
======================================================= */
router.post(
  "/delete-account",
  verificarUsuario, // Verifica autenticación
  authController.deleteAccount // Controlador para eliminar la cuenta
);

/* =======================================================
   REFRESH TOKEN (Generar un nuevo Access Token usando un Refresh Token válido)
======================================================= */
router.post("/refresh", authController.refresh);

/* =======================================================
   LOGOUT (Cerrar sesión)
======================================================= */
router.post("/logout", verificarUsuario, authController.logout);

/* =======================================================
   FORGOT / RESET PASSWORD
   Para cuando el usuario olvida su contraseña
======================================================= */
router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
