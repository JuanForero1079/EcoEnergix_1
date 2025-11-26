const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// GET: Obtener instalaciones según rol
// ==================================================
router.get(
  "/",
  verificarToken,
  verificarRol("Administrador", "Cliente"),
  (req, res) => {
    const rol = req.user.rol;
    const userId = req.user.id;

    let query = "SELECT * FROM instalacion";
    let params = [];

    if (rol === "Cliente") {
      query += " WHERE ID_usuario = ?";
      params.push(userId);
    }

    DB.query(query, params, (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Error al obtener instalaciones",
          details: err,
        });
      res.json(result);
    });
  }
);

// ==================================================
// GET: Obtener instalación por ID (con validación de rol)
// ==================================================
router.get(
  "/:id",
  verificarToken,
  verificarRol("Administrador", "Cliente"),
  (req, res) => {
    const { id } = req.params;
    const rol = req.user.rol;
    const userId = req.user.id;

    DB.query(
      "SELECT * FROM instalacion WHERE ID_instalacion = ?",
      [id],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al buscar la instalación",
            details: err,
          });
        if (result.length === 0)
          return res.status(404).json({ message: "Instalación no encontrada" });

        const instalacion = result[0];

        if (rol === "Cliente" && instalacion.ID_usuario !== userId) {
          return res.status(403).json({
            message: "No tienes permiso para ver esta instalación",
          });
        }

        res.json(instalacion);
      }
    );
  }
);

// ==================================================
// POST: Crear instalación (solo ADMIN)
// ==================================================
router.post("/", verificarToken, verificarRol("Administrador"), (req, res) => {
  const {
    Fecha_instalacion,
    Duracion_instalacion,
    Costo_instalacion,
    Estado_instalacion,
    ID_usuario,
    ID_producto,
  } = req.body;

  if (
    !Fecha_instalacion ||
    !Duracion_instalacion ||
    !Costo_instalacion ||
    !Estado_instalacion ||
    !ID_usuario ||
    !ID_producto
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  DB.query(
    "INSERT INTO instalacion (Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto) VALUES (?, ?, ?, ?, ?, ?)",
    [
      Fecha_instalacion,
      Duracion_instalacion,
      Costo_instalacion,
      Estado_instalacion,
      ID_usuario,
      ID_producto,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Error al crear la instalación",
          details: err,
        });

      res.status(201).json({
        message: "Instalación creada exitosamente!",
        instalacion: {
          ID_instalacion: result.insertId,
          Fecha_instalacion,
          Duracion_instalacion,
          Costo_instalacion,
          Estado_instalacion,
          ID_usuario,
          ID_producto,
        },
      });
    }
  );
});

// ==================================================
// PUT: Actualizar instalación (solo ADMIN)
// ==================================================
router.put("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;
  const {
    Fecha_instalacion,
    Duracion_instalacion,
    Costo_instalacion,
    Estado_instalacion,
    ID_usuario,
    ID_producto,
  } = req.body;

  if (
    !Fecha_instalacion ||
    !Duracion_instalacion ||
    !Costo_instalacion ||
    !Estado_instalacion ||
    !ID_usuario ||
    !ID_producto
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  DB.query(
    "UPDATE instalacion SET Fecha_instalacion = ?, Duracion_instalacion = ?, Costo_instalacion = ?, Estado_instalacion = ?, ID_usuario = ?, ID_producto = ? WHERE ID_instalacion = ?",
    [
      Fecha_instalacion,
      Duracion_instalacion,
      Costo_instalacion,
      Estado_instalacion,
      ID_usuario,
      ID_producto,
      id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({
          error: "Error al actualizar la instalación",
          details: err,
        });

      res.json({
        message: "Instalación actualizada exitosamente!",
        instalacion: {
          ID_instalacion: id,
          Fecha_instalacion,
          Duracion_instalacion,
          Costo_instalacion,
          Estado_instalacion,
          ID_usuario,
          ID_producto,
        },
      });
    }
  );
});

// ==================================================
// DELETE: Eliminar instalación (solo ADMIN)
// ==================================================
router.delete("/:id", verificarToken, verificarRol("Administrador"), (req, res) => {
  const { id } = req.params;

  DB.query(
    "DELETE FROM instalacion WHERE ID_instalacion = ?",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Error al eliminar la instalación",
          details: err,
        });

      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ message: "Instalación no encontrada para eliminar" });

      res.json({ message: "Instalación eliminada exitosamente!", id });
    }
  );
});

module.exports = router;
