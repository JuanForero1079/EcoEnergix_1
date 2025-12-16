const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

// ==================================================
// ESTADOS PERMITIDOS
// ==================================================
const ESTADOS_COMPRAS = ["pendiente", "aprobada", "en_proceso", "entregada", "cancelada"];

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: CRUD de compras para el administrador
 */

/**
 * ==================================================
 * GET TODAS LAS COMPRAS (solo Administrador)
 * ==================================================
 * @swagger
 * /admin/compras:
 *   get:
 *     summary: Obtener todas las compras
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras
 *       500:
 *         description: Error al obtener las compras
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
 * GET UNA COMPRA POR ID (solo Administrador)
 * ==================================================
 * @swagger
 * /admin/compras/{id}:
 *   get:
 *     summary: Obtener una compra por ID
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra encontrada
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error al buscar la compra
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
 * GET COMPRAS DE UN USUARIO
 * - Cliente: solo sus compras
 * - Administrador: puede ver cualquier usuario
 * ==================================================
 * @swagger
 * /admin/compras/usuario/{userId}:
 *   get:
 *     summary: Obtener compras de un usuario
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error al obtener las compras
 */
router.get("/usuario/:userId", verificarToken, (req, res) => {
  const { userId } = req.params;

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
 * CREAR COMPRA (solo Administrador)
 * ==================================================
 * @swagger
 * /admin/compras:
 *   post:
 *     summary: Crear una compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_usuario
 *               - Fecha_compra
 *               - Monto_total
 *               - Estado
 *             properties:
 *               ID_usuario:
 *                 type: integer
 *               Fecha_compra:
 *                 type: string
 *                 format: date-time
 *               Monto_total:
 *                 type: number
 *               Estado:
 *                 type: string
 *                 enum: [pendiente, aprobada, en_proceso, entregada, cancelada]
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *       400:
 *         description: Campos inválidos
 *       500:
 *         description: Error al crear la compra
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

    if (!ESTADOS_COMPRAS.includes(Estado)) {
      return res.status(400).json({
        message: `Estado inválido. Los estados permitidos son: ${ESTADOS_COMPRAS.join(
          ", "
        )}`,
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
 * ACTUALIZAR COMPRA (solo Administrador)
 * ==================================================
 * @swagger
 * /admin/compras/{id}:
 *   put:
 *     summary: Actualizar una compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Fecha_compra
 *               - Monto_total
 *               - Estado
 *             properties:
 *               Fecha_compra:
 *                 type: string
 *                 format: date-time
 *               Monto_total:
 *                 type: number
 *               Estado:
 *                 type: string
 *                 enum: [pendiente, aprobada, en_proceso, entregada, cancelada]
 *     responses:
 *       200:
 *         description: Compra actualizada exitosamente
 *       400:
 *         description: Campos inválidos o transición no permitida
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error al actualizar la compra
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

    if (!ESTADOS_COMPRAS.includes(Estado)) {
      return res.status(400).json({
        message: `Estado inválido. Los estados permitidos son: ${ESTADOS_COMPRAS.join(
          ", "
        )}`,
      });
    }

    // Obtener el estado actual para validar transición
    DB.query(
      "SELECT Estado FROM compras WHERE ID_compra = ?",
      [id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error al consultar la compra", details: err });

        if (result.length === 0)
          return res.status(404).json({ message: "Compra no encontrada" });

        const estadoActual = result[0].Estado;

        if (estadoActual === "Pendiente" && Estado === "Entregado") {
          return res.status(400).json({
            message: "No puedes cambiar directamente de Pendiente a Entregado",
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
  }
);

/**
 * ==================================================
 * ELIMINAR COMPRA (solo Administrador)
 * ==================================================
 * @swagger
 * /admin/compras/{id}:
 *   delete:
 *     summary: Eliminar una compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra a eliminar
 *     responses:
 *       200:
 *         description: Compra eliminada exitosamente
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error al eliminar la compra
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
