const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para CRUD de pagos
 */

// ==================================================
// GET: Obtener todos los pagos (solo ADMIN)
// ==================================================
router.get(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    DB.query("SELECT * FROM pago", (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al obtener los pagos",
          details: err,
        });
      }
      res.json(result);
    });
  }
);

// ==================================================
// GET: Obtener pago por ID (solo ADMIN)
// ==================================================
router.get(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "SELECT * FROM pago WHERE ID_pago = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al buscar el pago",
            details: err,
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "Pago no encontrado",
          });
        }

        res.json(result[0]);
      }
    );
  }
);

// ==================================================
// GET: Pagos de un usuario
// - ADMIN: ve cualquiera
// - CLIENTE: solo los suyos
// ==================================================
router.get("/usuario/:userId", verificarToken, (req, res) => {
  const { userId } = req.params;
  const rol = req.user.rol; // minúscula
  const authUserId = req.user.id;

  if (rol !== "administrador" && authUserId != userId) {
    return res.status(403).json({
      message: "No tienes permiso para ver estos pagos",
    });
  }

  DB.query(
    "SELECT * FROM pago WHERE ID_usuario = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al obtener los pagos del usuario",
          details: err,
        });
      }

      res.json(result);
    }
  );
});

// ==================================================
// POST: Crear pago (solo ADMIN)
// ==================================================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } = req.body;

    if (
      !ID_usuario ||
      !Monto ||
      !Fecha_pago ||
      !Metodo_pago ||
      !Estado_pago
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    DB.query(
      `INSERT INTO pago 
       (ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago)
       VALUES (?, ?, ?, ?, ?)`,
      [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al crear el pago",
            details: err,
          });
        }

        res.status(201).json({
          message: "Pago creado exitosamente",
          pago: {
            ID_pago: result.insertId,
            ID_usuario,
            Monto,
            Fecha_pago,
            Metodo_pago,
            Estado_pago,
          },
        });
      }
    );
  }
);

// ==================================================
// PUT: Actualizar pago (solo ADMIN)
// ==================================================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;
    const { ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago } =
      req.body;

    if (
      !ID_usuario ||
      !Monto ||
      !Fecha_pago ||
      !Metodo_pago ||
      !Estado_pago
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios para actualizar",
      });
    }

    DB.query(
      `UPDATE pago 
       SET ID_usuario=?, Monto=?, Fecha_pago=?, Metodo_pago=?, Estado_pago=?
       WHERE ID_pago=?`,
      [ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Error al actualizar el pago",
            details: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Pago no encontrado",
          });
        }

        res.json({
          message: "Pago actualizado exitosamente",
          id,
        });
      }
    );
  }
);

// ==================================================
// DELETE: Eliminar pago (solo ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query("DELETE FROM pago WHERE ID_pago = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error al eliminar el pago",
          details: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Pago no encontrado",
        });
      }

      res.json({
        message: "Pago eliminado exitosamente",
        id,
      });
    });
  }
);

module.exports = router;
