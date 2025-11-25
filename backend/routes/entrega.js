const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

// ---------------------------------------------------
// GET: Obtener todas las entregas
// ---------------------------------------------------
router.get("/", (req, res) => {
  DB.query("SELECT * FROM entrega", (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener entregas",
        details: err
      });
    }
    res.json(result);
  });
});

// ---------------------------------------------------
// GET: Obtener entrega por ID
// ---------------------------------------------------
router.get("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("SELECT * FROM entrega WHERE ID_entrega = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al buscar la entrega",
        details: err
      });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Entrega no encontrada" });
    }

    res.json(result[0]);
  });
});

// ---------------------------------------------------
// POST: Crear entrega
// ---------------------------------------------------
router.post("/", (req, res) => {
  const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

  if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios"
    });
  }

  DB.query(
    "INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad) VALUES (?, ?, ?, ?)",
    [Fecha_entrega, ID_usuario, ID_producto, Cantidad],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al crear la entrega",
          details: err
        });
      }

      res.status(201).json({
        message: "Entrega creada exitosamente",
        entrega: {
          ID_entrega: result.insertId,
          Fecha_entrega,
          ID_usuario,
          ID_producto,
          Cantidad
        }
      });
    }
  );
});

// ---------------------------------------------------
// PUT: Actualizar entrega
// ---------------------------------------------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Fecha_entrega, Cantidad } = req.body;

  if (!Fecha_entrega || !Cantidad) {
    return res.status(400).json({
      message: "Fecha_entrega y Cantidad son obligatorios"
    });
  }

  DB.query(
    "UPDATE entrega SET Fecha_entrega = ?, Cantidad = ? WHERE ID_entrega = ?",
    [Fecha_entrega, Cantidad, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al actualizar la entrega",
          details: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Entrega no encontrada para actualizar"
        });
      }

      res.json({
        message: "Entrega actualizada exitosamente",
        entrega: {
          ID_entrega: id,
          Fecha_entrega,
          Cantidad
        }
      });
    }
  );
});

// ---------------------------------------------------
// DELETE: Eliminar entrega
// ---------------------------------------------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.query("DELETE FROM entrega WHERE ID_entrega = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al eliminar la entrega",
        details: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Entrega no encontrada para eliminar"
      });
    }

    res.json({
      message: "Entrega eliminada exitosamente",
      id
    });
  });
});

module.exports = router;
