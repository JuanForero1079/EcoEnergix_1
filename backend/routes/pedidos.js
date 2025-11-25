const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ClienteDomiciliario
 *   description: Endpoints para Cliente y Domiciliario (temporal)
 */

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Vista simple para Cliente y Domiciliario
 *     tags: [ClienteDomiciliario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida mostrando correo y rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", (req, res) => {
  res.json({ message: `Hola ${req.user.correo}, tu rol es ${req.user.rol}. Esta es una vista simple.` });
});

module.exports = router;
