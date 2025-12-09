const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Correo_electronico:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *               Tipo_documento:
 *                 type: string
 *               Numero_documento:
 *                 type: string
 *               Rol_usuario:
 *                 type: string
 *                 enum: [administrador, cliente, domiciliario]
 *             required:
 *               - Nombre
 *               - Correo_electronico
 *               - Contraseña
 *               - Tipo_documento
 *               - Numero_documento
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/verificar/{token}:
 *   get:
 *     summary: Verificar el correo del usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Correo verificado exitosamente
 *       400:
 *         description: Token inválido o expirado
 */
router.get("/verificar/:token", authController.verifyEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión del usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo_electronico:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *             required:
 *               - Correo_electronico
 *               - Contraseña
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Generar un nuevo token de acceso usando el refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Nuevo token generado
 *       403:
 *         description: Refresh token inválido o expirado
 */
router.post("/refresh", authController.refresh);

/* =======================================================
   RECUPERACIÓN DE CONTRASEÑA
   ======================================================= */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar un correo para recuperar la contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo_electronico:
 *                 type: string
 *             required:
 *               - Correo_electronico
 *     responses:
 *       200:
 *         description: Enlace de recuperación enviado al correo
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer la contraseña usando un token temporal
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevaContraseña:
 *                 type: string
 *             required:
 *               - nuevaContraseña
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Token inválido o expirado
 */
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
