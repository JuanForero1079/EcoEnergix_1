const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// ESTADOS PERMITIDOS
// ==================================================
const ESTADOS_INSTALACION = ["Pendiente", "En_Proceso", "Completada", "Cancelada"];

// ==================================================
// GET: Obtener instalaciones según rol
// ==================================================
router.get("/", verificarToken, (req, res) => {
  const rol = req.user.rol; // viene en minúscula
  const userId = req.user.id;

  let query = "SELECT * FROM instalacion";
  let params = [];

  // CLIENTE → solo sus instalaciones
  if (rol === "cliente") {
    query += " WHERE ID_usuario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener instalaciones",
        details: err,
      });
    }

    res.json(result);
  });
});

// ==================================================
// GET: Obtener instalación por ID (validación por rol)
// ==================================================
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const rol = req.user.rol;
  const userId = req.user.id;

  DB.query(
    "SELECT * FROM instalacion WHERE ID_instalacion = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al buscar la instalación",
          details: err,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Instalación no encontrada",
        });
      }

      const instalacion = result[0];

      // CLIENTE → solo puede ver su instalación
      if (rol === "cliente" && instalacion.ID_usuario !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para ver esta instalación",
        });
      }

      res.json(instalacion);
    }
  );
});

// ==================================================
// POST: Crear instalación (solo ADMIN)
// ==================================================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
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
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // Validar estado
    if (!ESTADOS_INSTALACION.includes(Estado_instalacion)) {
      return res.status(400).json({
        message: `Estado inválido. Los estados permitidos son: ${ESTADOS_INSTALACION.join(", ")}`,
      });
    }

    DB.query(
      `INSERT INTO instalacion
       (Fecha_instalacion, Duracion_instalacion, Costo_instalacion, Estado_instalacion, ID_usuario, ID_producto)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Fecha_instalacion,
        Duracion_instalacion,
        Costo_instalacion,
        Estado_instalacion,
        ID_usuario,
        ID_producto,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al crear la instalación",
            details: err,
          });
        }

        res.status(201).json({
          message: "Instalación creada exitosamente",
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
  }
);

// ==================================================
// PUT: Actualizar instalación (solo ADMIN)
// ==================================================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
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
      return res.status(400).json({
        message: "Todos los campos son obligatorios para actualizar",
      });
    }

    // Validar estado
    if (!ESTADOS_INSTALACION.includes(Estado_instalacion)) {
      return res.status(400).json({
        message: `Estado inválido. Los estados permitidos son: ${ESTADOS_INSTALACION.join(", ")}`,
      });
    }

    // Obtener estado actual para reglas de negocio
    DB.query(
      "SELECT Estado_instalacion FROM instalacion WHERE ID_instalacion = ?",
      [id],
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Error al consultar la instalación", details: err });

        if (result.length === 0)
          return res.status(404).json({ message: "Instalación no encontrada" });

        const estadoActual = result[0].Estado_instalacion;

        // Regla de negocio: no permitir Pendiente → Completada directo
        if (estadoActual === "Pendiente" && Estado_instalacion === "Completada") {
          return res.status(400).json({
            message: "No puedes cambiar directamente de Pendiente a Completada",
          });
        }

        // Actualizar instalación
        DB.query(
          `UPDATE instalacion
           SET Fecha_instalacion = ?, Duracion_instalacion = ?, Costo_instalacion = ?,
               Estado_instalacion = ?, ID_usuario = ?, ID_producto = ?
           WHERE ID_instalacion = ?`,
          [
            Fecha_instalacion,
            Duracion_instalacion,
            Costo_instalacion,
            Estado_instalacion,
            ID_usuario,
            ID_producto,
            id,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                error: "Error al actualizar la instalación",
                details: err,
              });
            }

            res.json({
              message: "Instalación actualizada exitosamente",
              id,
            });
          }
        );
      }
    );
  }
);

// ==================================================
// DELETE: Eliminar instalación (solo ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "DELETE FROM instalacion WHERE ID_instalacion = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al eliminar la instalación",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Instalación no encontrada",
          });
        }

        res.json({
          message: "Instalación eliminada exitosamente",
          id,
        });
      }
    );
  }
);

module.exports = router;
