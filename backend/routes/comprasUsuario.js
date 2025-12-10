const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken } = require("../middleware/auth");

/**
 * ==================================================
 *   COMPRAS DEL USUARIO (RUTA PROTEGIDA)
 * ==================================================
 * - Requiere token JWT válido
 * - El usuario con rol "cliente" SOLO puede ver sus propias compras
 * - El rol "administrador" puede ver compras de cualquier usuario
 */

/**
 * @swagger
 * tags:
 *   name: Compras Usuario
 *   description: Endpoints para obtener compras de un usuario específico
 */

/**
 * @swagger
 * /api/compras/usuario/{userId}:
 *   get:
 *     summary: Obtener todas las compras de un usuario
 *     tags: [Compras Usuario]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error del servidor
 */
router.get("/:userId", verificarToken, (req, res) => {
  const { userId } = req.params;

  /**
   * --------------------------------------------------
   *  CONTROL DE AUTORIZACIÓN
   * --------------------------------------------------
   * - Si el rol es "cliente", solo puede consultar
   *   sus propias compras
   * - El administrador no tiene restricción
   */
  if (req.user.rol === "cliente" && req.user.id != userId) {
    return res.status(403).json({
      message: "No puedes ver compras de otros usuarios",
    });
  }

  /**
   * --------------------------------------------------
   *  CONSULTA A BASE DE DATOS
   * --------------------------------------------------
   */
  const query = `
    SELECT 
      c.ID_compra,
      c.ID_usuario,
      c.Fecha_compra,
      c.Monto_total,
      c.Estado,
      p.nombre_producto,
      c.cantidad
    FROM compras c
    LEFT JOIN productos p ON c.ID_producto = p.ID_producto
    WHERE c.ID_usuario = ?
  `;

  DB.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error al obtener compras:", err);
      return res.status(500).json({
        error: "Error al obtener las compras del usuario",
      });
    }

    res.json(result);
  });
});

module.exports = router;
