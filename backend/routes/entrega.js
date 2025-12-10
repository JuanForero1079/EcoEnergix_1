const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// GET: Obtener entregas según rol
// ==================================================
router.get("/", verificarToken, (req, res) => {
  const rol = req.user.rol; // ya viene en minúscula
  const userId = req.user.id;

  let query = "SELECT * FROM entrega";
  let params = [];

  if (rol === "cliente") {
    query += " WHERE ID_usuario = ?";
    params.push(userId);
  } else if (rol === "domiciliario") {
    query += " WHERE ID_domiciliario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener entregas",
        details: err,
      });
    }

    res.json(result);
  });
});

// ==================================================
// GET: Obtener entrega por ID (validación por rol)
// ==================================================
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const rol = req.user.rol;
  const userId = req.user.id;

  DB.query(
    "SELECT * FROM entrega WHERE ID_entrega = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al buscar la entrega",
          details: err,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Entrega no encontrada",
        });
      }

      const entrega = result[0];

      // Cliente -> solo sus entregas
      if (rol === "cliente" && entrega.ID_usuario !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para ver esta entrega",
        });
      }

      // Domiciliario -> solo entregas asignadas a él
      if (rol === "domiciliario" && entrega.ID_domiciliario !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para ver esta entrega",
        });
      }

      res.json(entrega);
    }
  );
});

// ==================================================
// POST: Crear entrega (solo ADMIN)
// ==================================================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const {
      Fecha_entrega,
      ID_usuario,
      ID_producto,
      Cantidad,
      ID_domiciliario,
    } = req.body;

    if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
      return res.status(400).json({
        message: "Todos los campos obligatorios son requeridos",
      });
    }

    DB.query(
      `INSERT INTO entrega 
       (Fecha_entrega, ID_usuario, ID_producto, Cantidad, ID_domiciliario)
       VALUES (?, ?, ?, ?, ?)`,
      [
        Fecha_entrega,
        ID_usuario,
        ID_producto,
        Cantidad,
        ID_domiciliario || null,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al crear la entrega",
            details: err,
          });
        }

        res.status(201).json({
          message: "Entrega creada exitosamente",
          entrega: {
            ID_entrega: result.insertId,
            Fecha_entrega,
            ID_usuario,
            ID_producto,
            Cantidad,
            ID_domiciliario: ID_domiciliario || null,
          },
        });
      }
    );
  }
);

// ==================================================
// PUT: Actualizar entrega (solo ADMIN)
// ==================================================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;
    const { Fecha_entrega, Cantidad, ID_usuario, ID_domiciliario } = req.body;

    DB.query(
      `UPDATE entrega 
       SET Fecha_entrega = ?, Cantidad = ?, ID_usuario = ?, ID_domiciliario = ?
       WHERE ID_entrega = ?`,
      [Fecha_entrega, Cantidad, ID_usuario, ID_domiciliario, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al actualizar la entrega",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Entrega no encontrada",
          });
        }

        res.json({
          message: "Entrega actualizada exitosamente",
          id,
        });
      }
    );
  }
);

// ==================================================
// DELETE: Eliminar entrega (solo ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "DELETE FROM entrega WHERE ID_entrega = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al eliminar la entrega",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Entrega no encontrada",
          });
        }

        res.json({
          message: "Entrega eliminada exitosamente",
          id,
        });
      }
    );
  }
);

module.exports = router;
