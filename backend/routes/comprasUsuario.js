const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

// Obtener todas las compras de un usuario
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  //   Si quieres mostrar también el nombre del producto, usa JOIN con productos
  const query = `
    SELECT c.ID_compra, c.ID_usuario, c.Fecha_compra, c.Monto_total, c.Estado,
           p.nombre_producto, c.cantidad
    FROM compras c
    LEFT JOIN productos p ON c.ID_producto = p.ID_producto
    WHERE c.ID_usuario = ?
  `;

  DB.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener las compras del usuario" });
    }
    res.json(result);
  });
});

module.exports = router;
