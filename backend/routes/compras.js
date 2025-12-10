const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: CRUD de compras para el administrador
 */

/**
 * ==================================================
 *   GET TODAS LAS COMPRAS (solo Administrador)
 * ==================================================
 */
router.get(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    DB.query("SELECT * FROM compras", (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error al obtener las compras", details: err });

      res.json(result);
    });
  }
);

/**
 * ==================================================
 *   GET UNA COMPRA POR ID (solo Administrador)
 * ==================================================
 */
router.get(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "SELECT * FROM compras WHERE ID_compra = ?",
      [id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error al buscar la compra", details: err });

        if (result.length === 0)
          return res.status(404).json({ message: "Compra no encontrada" });

        res.json(result[0]);
      }
    );
  }
);

/**
 * ==================================================
 *   GET COMPRAS DE UN USUARIO
 *   - Cliente: solo sus compras
 *   - Administrador: puede ver cualquier usuario
 * ==================================================
 */
router.get("/usuario/:userId", verificarToken, (req, res) => {
  const { userId } = req.params;

  // Cliente solo puede ver sus propias compras
  if (req.user.rol === "cliente" && req.user.id != userId) {
    return res.status(403).json({
      message: "No puedes ver compras de otros usuarios",
    });
  }

  DB.query(
    "SELECT * FROM compras WHERE ID_usuario = ?",
    [userId],
    (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Error al obtener las compras del usuario",
          details: err,
        });

      res.json(result);
    }
  );
});

/**
 * ==================================================
 *   CREAR COMPRA (solo Administrador)
 * ==================================================
 */
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { ID_usuario, Fecha_compra, Monto_total, Estado } = req.body;

    if (!ID_usuario || !Fecha_compra || !Monto_total || !Estado) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    DB.query(
      "INSERT INTO compras (ID_usuario, Fecha_compra, Monto_total, Estado) VALUES (?, ?, ?, ?)",
      [ID_usuario, Fecha_compra, Monto_total, Estado],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error al crear la compra", details: err });

        res.status(201).json({
          message: "Compra creada exitosamente",
          compra: {
            ID_compra: result.insertId,
            ID_usuario,
            Fecha_compra,
            Monto_total,
            Estado,
          },
        });
      }
    );
  }
);

/**
 * ==================================================
 *   ACTUALIZAR COMPRA (solo Administrador)
 * ==================================================
 */
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;
    const { Fecha_compra, Monto_total, Estado } = req.body;

    if (!Fecha_compra || !Monto_total || !Estado) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios para actualizar",
      });
    }

    DB.query(
      "UPDATE compras SET Fecha_compra = ?, Monto_total = ?, Estado = ? WHERE ID_compra = ?",
      [Fecha_compra, Monto_total, Estado, id],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al actualizar la compra",
            details: err,
          });

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Compra no encontrada" });

        res.json({
          message: "Compra actualizada exitosamente",
          compra: {
            ID_compra: id,
            Fecha_compra,
            Monto_total,
            Estado,
          },
        });
      }
    );
  }
);

/**
 * ==================================================
 *   ELIMINAR COMPRA (solo Administrador)
 * ==================================================
 */
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "DELETE FROM compras WHERE ID_compra = ?",
      [id],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al eliminar la compra",
            details: err,
          });

        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Compra no encontrada" });

        res.json({
          message: "Compra eliminada exitosamente",
          id,
        });
      }
    );
  }
);

module.exports = router;
