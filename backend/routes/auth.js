const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación de usuarios
 */

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
   REFRESH TOKEN
   ======================================================= */

router.post("/refresh", authController.refresh);

/* =======================================================
   LOGOUT
   ======================================================= */

router.post("/logout", verificarToken, authController.logout);

router.post("/logout-all", verificarToken, authController.logoutAll);

/* =======================================================
   RECUPERACIÓN DE CONTRASEÑA
   ======================================================= */

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
