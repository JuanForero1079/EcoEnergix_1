const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Middleware para verificar token de usuario
const { verificarUsuario } = require("../middleware/authUsuario");
const uploadUsuario = require("../middleware/uploadUsuario");

/* =======================================================
   REGISTRO
======================================================= */
router.post("/register", authController.register);

/* =======================================================
   VERIFICACIÓN DE CORREO
======================================================= */
router.get("/verificar/:token", authController.verifyEmail);

/* =======================================================
   LOGIN
======================================================= */
router.post("/login", authController.login);

/* =======================================================
   PERFIL DE USUARIO (PROTEGIDO)
======================================================= */
router.get("/perfil", verificarUsuario, authController.getPerfil);
router.put("/perfil", verificarUsuario, authController.updatePerfil);
router.post(
  "/perfil/foto",
  verificarUsuario,
  uploadUsuario.single("foto"),
  authController.uploadFoto
);

/* =======================================================
   REFRESH TOKEN
======================================================= */
router.post("/refresh", authController.refresh);

/* =======================================================
   LOGOUT
======================================================= */
router.post("/logout", verificarUsuario, authController.logout);

/* =======================================================
   FORGOT / RESET PASSWORD
======================================================= */
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
