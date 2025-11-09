// routes/productos.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

// ✅ GET: obtener todos los productos
router.get("/", (req, res) => {
  DB.query("SELECT * FROM producto", (err, result) => {
    if (err) {
      console.error("❌ [GET /api/productos] Error:", err.message);
      return res
        .status(500)
        .json({ error: "Error al obtener los productos", details: err });
    }
    res.status(200).json(result); // o { productos: result } si prefieres
  });
});

// ✅ GET: obtener un producto por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.query(
    "SELECT * FROM producto WHERE ID_producto = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("❌ [GET /api/productos/:id] Error:", err.message);
        return res
          .status(500)
          .json({ error: "Error al buscar el producto", details: err });
      }
      if (result.length === 0)
        return res.status(404).json({ message: "Producto no encontrado" });
      res.status(200).json(result[0]);
    }
  );
});

// ✅ POST: crear un nuevo producto
router.post("/", (req, res) => {
  const {
    Nombre_producto,
    Tipo_producto,
    Precio,
    Marca,
    Fecha_fabricacion,
    Garantia,
    ID_proveedor,
  } = req.body;

  if (
    !Nombre_producto ||
    !Tipo_producto ||
    !Precio ||
    !Marca ||
    !Fecha_fabricacion ||
    !Garantia ||
    !ID_proveedor
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO producto 
    (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(
    query,
    [
      Nombre_producto,
      Tipo_producto,
      Precio,
      Marca,
      Fecha_fabricacion,
      Garantia,
      ID_proveedor,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ [POST /api/productos] Error:", err.message);
        return res
          .status(500)
          .json({ error: "Error al crear el producto", details: err });
      }

      res.status(201).json({
        message: "✅ Producto creado exitosamente",
        producto: {
          ID_producto: result.insertId,
          Nombre_producto,
          Tipo_producto,
          Precio,
          Marca,
          Fecha_fabricacion,
          Garantia,
          ID_proveedor,
        },
      });
    }
  );
});

// ✅ PUT: actualizar producto existente
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    Nombre_producto,
    Tipo_producto,
    Precio,
    Marca,
    Fecha_fabricacion,
    Garantia,
    ID_proveedor,
  } = req.body;

  if (
    !Nombre_producto ||
    !Tipo_producto ||
    !Precio ||
    !Marca ||
    !Fecha_fabricacion ||
    !Garantia ||
    !ID_proveedor
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  const query = `
    UPDATE producto 
    SET Nombre_producto = ?, Tipo_producto = ?, Precio = ?, Marca = ?, 
        Fecha_fabricacion = ?, Garantia = ?, ID_proveedor = ?
    WHERE ID_producto = ?
  `;

  DB.query(
    query,
    [
      Nombre_producto,
      Tipo_producto,
      Precio,
      Marca,
      Fecha_fabricacion,
      Garantia,
      ID_proveedor,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ [PUT /api/productos/:id] Error:", err.message);
        return res
          .status(500)
          .json({ error: "Error al actualizar el producto", details: err });
      }

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({
        message: "✅ Producto actualizado exitosamente",
        producto: {
          ID_producto: id,
          Nombre_producto,
          Tipo_producto,
          Precio,
          Marca,
          Fecha_fabricacion,
          Garantia,
          ID_proveedor,
        },
      });
    }
  );
});

// ✅ DELETE: eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query(
    "DELETE FROM producto WHERE ID_producto = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("❌ [DELETE /api/productos/:id] Error:", err.message);
        return res
          .status(500)
          .json({ error: "Error al eliminar el producto", details: err });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Producto no encontrado para eliminar" });
      }

      res
        .status(200)
        .json({ message: "✅ Producto eliminado exitosamente", id });
    }
  );
});

module.exports = router;
