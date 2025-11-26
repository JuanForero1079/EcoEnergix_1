const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// GET: Obtener entregas según rol
// ==================================================
router.get(
  "/",
  verificarToken,
  verificarRol("Administrador", "Cliente", "Domiciliario"),
  (req, res) => {
    const rol = req.user.rol;
    const userId = req.user.id;

    let query = "SELECT * FROM entrega";
    let params = [];

    // CLIENTE -> solo sus entregas
    if (rol === "Cliente") {
      query += " WHERE ID_usuario = ?";
      params.push(userId);
    }

    // DOMICILIARIO -> también solo entregas asignadas a él
    if (rol === "Domiciliario") {
      query += " WHERE ID_usuario = ?";
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
  }
);

// ==================================================
// GET: Obtener entrega por ID (con validación por rol)
// ==================================================
router.get(
  "/:id",
  verificarToken,
  verificarRol("Administrador", "Cliente", "Domiciliario"),
  (req, res) => {
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
          return res.status(404).json({ message: "Entrega no encontrada" });
        }

        const entrega = result[0];

        // CLIENTE -> solo su entrega
        if (rol === "Cliente" && entrega.ID_usuario !== userId) {
          return res.status(403).json({
            message: "No tienes permiso para ver esta entrega",
          });
        }

        // DOMICILIARIO -> solo si está asignada a él
        if (rol === "Domiciliario" && entrega.ID_usuario !== userId) {
          return res.status(403).json({
            message: "No tienes permiso para ver esta entrega",
          });
        }

        res.json(entrega);
      }
    );
  }
);

// ==================================================
// POST: Crear entrega (solo ADMIN)
// ==================================================
router.post("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

  if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  DB.query(
    "INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad) VALUES (?, ?, ?, ?)",
    [Fecha_entrega, ID_usuario, ID_producto, Cantidad],
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
        },
      });
    }
  );
});

// ==================================================
// PUT: Actualizar entrega (solo ADMIN)
// ==================================================
router.put("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;
  const { Fecha_entrega, Cantidad, ID_usuario } = req.body;

  if (!Fecha_entrega || !Cantidad) {
    return res.status(400).json({
      message: "Fecha_entrega y Cantidad son obligatorios",
    });
  }

  DB.query(
    "UPDATE entrega SET Fecha_entrega = ?, Cantidad = ?, ID_usuario = ? WHERE ID_entrega = ?",
    [Fecha_entrega, Cantidad, ID_usuario, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al actualizar la entrega",
          details: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Entrega no encontrada para actualizar",
        });
      }

      res.json({
        message: "Entrega actualizada exitosamente",
        entrega: {
          ID_entrega: id,
          Fecha_entrega,
          Cantidad,
          ID_usuario,
        },
      });
    }
  );
});

// ==================================================
// DELETE: Eliminar entrega (solo ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol("Administrador"),
  (req, res) => {
    const { id } = req.params;

    DB.query("DELETE FROM entrega WHERE ID_entrega = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al eliminar la entrega",
          details: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Entrega no encontrada para eliminar",
        });
      }

      res.json({
        message: "Entrega eliminada exitosamente",
        id,
      });
    });
  }
);

module.exports = router;
