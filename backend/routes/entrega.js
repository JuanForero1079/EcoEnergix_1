const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// GET ENTREGAS (SEGÚN ROL)
// ==================================================
router.get("/", verificarToken, (req, res) => {
  const rol = req.user.rol;
  const userId = req.user.id;

  let query = "SELECT * FROM entrega";
  let params = [];

  if (rol === "cliente") {
    query += " WHERE ID_usuario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err) {
      console.error("Error GET entregas:", err);
      return res.status(500).json({ message: "Error al obtener entregas" });
    }
    res.json(result);
  });
});

// ==================================================
// POST CREAR ENTREGA (ADMIN)
// ==================================================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

    if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
      return res.status(400).json({ message: "Campos obligatorios faltantes" });
    }

    DB.query(
      `INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad)
       VALUES (?, ?, ?, ?)`,
      [
        Fecha_entrega,
        Number(ID_usuario),
        Number(ID_producto),
        Number(Cantidad),
      ],
      (err, result) => {
        if (err) {
          console.error("Error POST entrega:", err);
          return res.status(500).json({ message: "Error al crear la entrega" });
        }

        res.status(201).json({
          message: "Entrega creada correctamente",
          ID_entrega: result.insertId,
        });
      }
    );
  }
);

// ==================================================
// PUT ACTUALIZAR ENTREGA (ADMIN)
// ==================================================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;
    const { Fecha_entrega, ID_usuario, ID_producto, Cantidad } = req.body;

    if (!Fecha_entrega || !ID_usuario || !ID_producto || !Cantidad) {
      return res.status(400).json({ message: "Campos obligatorios faltantes" });
    }

    DB.query(
      `UPDATE entrega
       SET Fecha_entrega = ?, ID_usuario = ?, ID_producto = ?, Cantidad = ?
       WHERE ID_entrega = ?`,
      [
        Fecha_entrega,
        Number(ID_usuario),
        Number(ID_producto),
        Number(Cantidad),
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error PUT entrega:", err);
          return res.status(500).json({ message: "Error al actualizar la entrega" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Entrega no encontrada" });
        }

        res.json({ message: "Entrega actualizada correctamente" });
      }
    );
  }
);

// ==================================================
// DELETE ENTREGA (ADMIN)
// ==================================================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    DB.query(
      "DELETE FROM entrega WHERE ID_entrega = ?",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.error("Error DELETE entrega:", err);
          return res.status(500).json({ message: "Error al eliminar la entrega" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Entrega no encontrada" });
        }

        res.json({ message: "Entrega eliminada correctamente" });
      }
    );
  }
);

module.exports = router;
