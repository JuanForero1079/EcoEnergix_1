const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ======================
// Obtener carrito del usuario
// ======================
router.get("/", verificarToken, async (req, res) => {
  const userId = req.user.id;

  DB.query(
    `SELECT c.ID_carrito, c.ID_usuario, c.ID_producto, c.Cantidad, p.Nombre_producto, p.Precio, p.Foto
     FROM carrito c
     JOIN producto p ON c.ID_producto = p.ID_producto
     WHERE c.ID_usuario = ?`,
    [userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al obtener carrito", details: err });

      res.json(result);
    }
  );
});

// ======================
// Agregar producto al carrito
// ======================
router.post("/", verificarToken, (req, res) => {
  const { ID_producto, Cantidad } = req.body;
  const userId = req.user.id;

  if (!ID_producto || !Cantidad)
    return res.status(400).json({ message: "ID_producto y Cantidad son obligatorios" });

  DB.query(
    "INSERT INTO carrito (ID_usuario, ID_producto, Cantidad) VALUES (?, ?, ?)",
    [userId, ID_producto, Cantidad],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al agregar al carrito", details: err });
      res.status(201).json({ message: "Producto agregado al carrito", ID_carrito: result.insertId });
    }
  );
});

// ======================
// Actualizar cantidad de producto en carrito
// ======================
router.put("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { Cantidad } = req.body;
  const userId = req.user.id;

  if (!Cantidad) return res.status(400).json({ message: "Cantidad es obligatoria" });

  DB.query(
    "UPDATE carrito SET Cantidad = ? WHERE ID_carrito = ? AND ID_usuario = ?",
    [Cantidad, id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar carrito", details: err });
      res.json({ message: "Cantidad actualizada" });
    }
  );
});

// ======================
// Eliminar producto del carrito
// ======================
router.delete("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  DB.query(
    "DELETE FROM carrito WHERE ID_carrito = ? AND ID_usuario = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al eliminar del carrito", details: err });
      res.json({ message: "Producto eliminado del carrito" });
    }
  );
});

module.exports = router;
