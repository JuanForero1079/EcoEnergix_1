const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

/**
 * @swagger
 * tags:
 *   name: Productos Públicos
 *   description: Endpoints accesibles sin autenticación
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos (público)
 *     tags: [Productos Públicos]
 *     responses:
 *       200:
 *         description: Lista de todos los productos
 */
router.get("/", (req, res) => {
  DB.query("SELECT * FROM producto", (err, result) => {
    if (err) {
      console.error("  [GET /api/productos] Error:", err.message);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    res.status(200).json(result);
  });
});

module.exports = router;
