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

module.exports = router;
