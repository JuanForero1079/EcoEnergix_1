const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: CRUD de proveedores y carga masiva
 */

// =====================
// GET: Todos los proveedores (ADMIN)
// =====================
router.get(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    DB.query(
      "SELECT ID_proveedor, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario FROM proveedor",
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al obtener los proveedores",
            details: err,
          });
        res.json(result);
      }
    );
  }
);

// =====================
// GET: Proveedor por ID (ADMIN)
// =====================
router.get(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "SELECT ID_proveedor, Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario FROM proveedor WHERE ID_proveedor = ?",
      [id],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al buscar el proveedor",
            details: err,
          });

        if (result.length === 0)
          return res.status(404).json({
            message: "Proveedor no encontrado",
          });

        res.json(result[0]);
      }
    );
  }
);

// =====================
// POST: Crear proveedor (ADMIN)
// =====================
router.post(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const {
      Nombre_empresa,
      Dirección,
      Teléfono,
      Correo_electronico,
      ID_usuario,
    } = req.body;

    if (
      !Nombre_empresa ||
      !Dirección ||
      !Teléfono ||
      !Correo_electronico ||
      !ID_usuario
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    DB.query(
      `INSERT INTO proveedor 
       (Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        Nombre_empresa,
        Dirección,
        Teléfono,
        Correo_electronico,
        ID_usuario,
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al crear el proveedor",
            details: err,
          });

        res.status(201).json({
          message: "Proveedor creado exitosamente",
          proveedor: {
            ID_proveedor: result.insertId,
            Nombre_empresa,
            Dirección,
            Teléfono,
            Correo_electronico,
            ID_usuario,
          },
        });
      }
    );
  }
);

// =====================
// PUT: Actualizar proveedor (ADMIN)
// =====================
router.put(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;
    const {
      Nombre_empresa,
      Dirección,
      Teléfono,
      Correo_electronico,
      ID_usuario,
    } = req.body;

    if (
      !Nombre_empresa ||
      !Dirección ||
      !Teléfono ||
      !Correo_electronico ||
      !ID_usuario
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios para actualizar",
      });
    }

    DB.query(
      `UPDATE proveedor 
       SET Nombre_empresa=?, Dirección=?, Teléfono=?, Correo_electronico=?, ID_usuario=? 
       WHERE ID_proveedor=?`,
      [
        Nombre_empresa,
        Dirección,
        Teléfono,
        Correo_electronico,
        ID_usuario,
        id,
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al actualizar el proveedor",
            details: err,
          });

        if (result.affectedRows === 0)
          return res.status(404).json({
            message: "Proveedor no encontrado",
          });

        res.json({
          message: "Proveedor actualizado exitosamente",
          id,
        });
      }
    );
  }
);

// =====================
// DELETE: Eliminar proveedor (ADMIN)
// =====================
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const { id } = req.params;

    DB.query(
      "DELETE FROM proveedor WHERE ID_proveedor = ?",
      [id],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error al eliminar el proveedor",
            details: err,
          });

        if (result.affectedRows === 0)
          return res.status(404).json({
            message: "Proveedor no encontrado",
          });

        res.json({
          message: "Proveedor eliminado exitosamente",
          id,
        });
      }
    );
  }
);

// =====================
// POST: Carga masiva (ADMIN)
// =====================
router.post(
  "/bulk",
  verificarToken,
  verificarRol(["administrador"]),
  (req, res) => {
    const proveedores = req.body;

    if (!Array.isArray(proveedores) || proveedores.length === 0) {
      return res.status(400).json({
        message: "Se requiere un array de proveedores",
      });
    }

    const values = proveedores.map((p) => [
      p.Nombre_empresa,
      p.Dirección,
      p.Teléfono,
      p.Correo_electronico,
      p.ID_usuario,
    ]);

    DB.query(
      `INSERT INTO proveedor 
       (Nombre_empresa, Dirección, Teléfono, Correo_electronico, ID_usuario) 
       VALUES ?`,
      [values],
      (err, result) => {
        if (err)
          return res.status(500).json({
            error: "Error en la carga masiva",
            details: err,
          });

        res.status(201).json({
          message: "Carga masiva realizada correctamente",
          cantidad: result.affectedRows,
        });
      }
    );
  }
);

module.exports = router;
