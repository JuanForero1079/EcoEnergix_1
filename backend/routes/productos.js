const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: CRUD de productos y carga masiva
 */

// ==================================================
// GET: Obtener todos los productos (solo ADMIN)
// ==================================================
router.get(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    DB.query("SELECT * FROM producto", (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al obtener los productos",
          details: err,
        });
      }
      res.json(result);
    });
  }
);

// ==================================================
// GET: Obtener producto por ID (solo ADMIN)
// ==================================================
router.get(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "SELECT * FROM producto WHERE ID_producto = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al buscar el producto",
            details: err,
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "Producto no encontrado",
          });
        }

        res.json(result[0]);
      }
    );
  }
);

// ==================================================
// POST: Crear producto (solo ADMIN)
// ==================================================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
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
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    DB.query(
      `INSERT INTO producto
       (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
          return res.status(500).json({
            error: "Error al crear el producto",
            details: err,
          });
        }

        res.status(201).json({
          message: "Producto creado exitosamente",
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
  }
);

// ==================================================
// PUT: Actualizar producto (solo ADMIN)
// ==================================================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
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
      return res.status(400).json({
        message: "Todos los campos son obligatorios para actualizar",
      });
    }

    DB.query(
      `UPDATE producto
       SET Nombre_producto=?, Tipo_producto=?, Precio=?, Marca=?, Fecha_fabricacion=?, Garantia=?, ID_proveedor=?
       WHERE ID_producto=?`,
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
          return res.status(500).json({
            error: "Error al actualizar el producto",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Producto no encontrado",
          });
        }

        res.json({
          message: "Producto actualizado exitosamente",
          id,
        });
      }
    );
  }
);

// ==================================================
// DELETE: Eliminar producto (solo ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "DELETE FROM producto WHERE ID_producto = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al eliminar el producto",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Producto no encontrado",
          });
        }

        res.json({
          message: "Producto eliminado exitosamente",
          id,
        });
      }
    );
  }
);

// ==================================================
// POST: Carga masiva de productos (solo ADMIN)
// ==================================================
router.post(
  "/bulk",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const productos = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        message: "Debe enviar un arreglo de productos",
      });
    }

    for (const p of productos) {
      if (
        !p.Nombre_producto ||
        !p.Tipo_producto ||
        !p.Precio ||
        !p.Marca ||
        !p.Fecha_fabricacion ||
        !p.Garantia ||
        !p.ID_proveedor
      ) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios en cada producto",
        });
      }
    }

    const values = productos.map((p) => [
      p.Nombre_producto,
      p.Tipo_producto,
      p.Precio,
      p.Marca,
      p.Fecha_fabricacion,
      p.Garantia,
      p.ID_proveedor,
    ]);

    DB.query(
      `INSERT INTO producto
       (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor)
       VALUES ?`,
      [values],
      (err) => {
        if (err) {
          return res.status(500).json({
            error: "Error en la carga masiva",
            details: err,
          });
        }

        res.status(201).json({
          message: "Carga masiva realizada correctamente",
          cantidad: productos.length,
        });
      }
    );
  }
);

module.exports = router;
