const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para crear y consultar pedidos
 */

/**
 * ==================================================
 * POST: Crear pedido desde carrito
 * ==================================================
 * @swagger
 * /admin/pedido:
 *   post:
 *     summary: Crear un pedido a partir del carrito del usuario
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ID_pedido:
 *                   type: integer
 *                 total:
 *                   type: number
 *       400:
 *         description: Carrito vacío
 *       500:
 *         description: Error al crear pedido o detalle
 */
router.post("/", verificarToken, (req, res) => {
  const userId = req.user.id;

  DB.query(
    "SELECT c.ID_producto, c.Cantidad, p.Precio FROM carrito c JOIN producto p ON c.ID_producto = p.ID_producto WHERE c.ID_usuario = ?",
    [userId],
    (err, productos) => {
      if (err) return res.status(500).json({ error: "Error al obtener carrito", details: err });
      if (productos.length === 0) return res.status(400).json({ message: "Carrito vacío" });

      const total = productos.reduce((acc, item) => acc + item.Precio * item.Cantidad, 0);

      DB.query(
        "INSERT INTO pedido (ID_usuario, Total, Estado) VALUES (?, ?, 'Pendiente')",
        [userId, total],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Error al crear pedido", details: err });
          const pedidoId = result.insertId;

          const detalles = productos.map(item => [pedidoId, item.ID_producto, item.Cantidad, item.Precio]);
          DB.query(
            "INSERT INTO detalle_pedido (ID_pedido, ID_producto, Cantidad, Precio_unitario) VALUES ?",
            [detalles],
            (err) => {
              if (err) return res.status(500).json({ error: "Error al crear detalle del pedido", details: err });

              DB.query("DELETE FROM carrito WHERE ID_usuario = ?", [userId]);

              res.status(201).json({ message: "Pedido creado", ID_pedido: pedidoId, total });
            }
          );
        }
      );
    }
  );
});

/**
 * ==================================================
 * GET: Obtener pedidos del usuario
 * ==================================================
 * @swagger
 * /admin/pedido:
 *   get:
 *     summary: Obtener todos los pedidos del usuario autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       500:
 *         description: Error al obtener pedidos
 */
router.get("/", verificarToken, (req, res) => {
  const userId = req.user.id;
  DB.query(
    "SELECT * FROM pedido WHERE ID_usuario = ? ORDER BY Fecha_pedido DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al obtener pedidos", details: err });
      res.json(result);
    }
  );
});

/**
 * ==================================================
 * GET: Obtener pedido por ID (usuario o admin)
 * ==================================================
 * @swagger
 * /admin/pedido/{id}:
 *   get:
 *     summary: Obtener un pedido por ID incluyendo sus detalles
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado con sus detalles
 *       403:
 *         description: No puedes ver este pedido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener pedido o detalles
 */
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.rol === "administrador";

  DB.query("SELECT * FROM pedido WHERE ID_pedido = ?", [id], (err, pedidos) => {
    if (err) return res.status(500).json({ error: "Error al buscar pedido", details: err });
    if (pedidos.length === 0) return res.status(404).json({ message: "Pedido no encontrado" });

    const pedido = pedidos[0];

    if (!isAdmin && pedido.ID_usuario !== userId)
      return res.status(403).json({ message: "No puedes ver este pedido" });

    DB.query(
      "SELECT dp.ID_detalle, dp.ID_producto, dp.Cantidad, dp.Precio_unitario, p.Nombre_producto, p.Foto FROM detalle_pedido dp JOIN producto p ON dp.ID_producto = p.ID_producto WHERE dp.ID_pedido = ?",
      [id],
      (err, detalles) => {
        if (err) return res.status(500).json({ error: "Error al obtener detalles", details: err });
        res.json({ pedido, detalles });
      }
    );
  });
});

module.exports = router;
