// src/routes/pedidos.js
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: ClienteDomiciliario
 *   description: Endpoints para Cliente y Domiciliario
 */

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Mostrar pedidos del usuario según su rol
 *     tags: [ClienteDomiciliario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error del servidor
 */
router.get("/", verificarToken, (req, res) => {
  if (!req.user || !req.user.id || !req.user.rol) {
    return res.status(401).json({ message: "Usuario no autenticado correctamente" });
  }

  const { id: ID_usuario, rol, correo } = req.user;
  let query = "";
  let params = [];

  if (rol === "Cliente") {
    query = `
      SELECT p.ID_pago, p.Monto, p.Fecha_pago, p.Metodo_pago, p.Estado_pago, prod.Nombre_producto
      FROM pago p
      JOIN instalacion i ON i.ID_instalacion = p.ID_pago
      JOIN producto prod ON prod.ID_producto = i.ID_producto
      WHERE p.ID_usuario = ?
    `;
    params = [ID_usuario];
  } else if (rol === "Domiciliario") {
    query = `
      SELECT e.ID_entrega, e.Fecha_entrega, e.Cantidad, prod.Nombre_producto, u.Correo_electronico AS cliente
      FROM entrega e
      JOIN usuarios u ON u.ID_usuario = e.ID_usuario
      JOIN producto prod ON prod.ID_producto = e.ID_producto
      WHERE e.ID_usuario = ?
    `;
    params = [ID_usuario];
  } else {
    return res.status(403).json({ message: "Rol no autorizado para ver pedidos" });
  }

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al obtener los pedidos", details: err });
    res.json({ usuario: correo, rol, pedidos: result });
  });
});

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido específico según el rol
 *     tags: [ClienteDomiciliario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago o entrega
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verificarToken, (req, res) => {
  if (!req.user || !req.user.id || !req.user.rol) {
    return res.status(401).json({ message: "Usuario no autenticado correctamente" });
  }

  const { id: ID_usuario, rol, correo } = req.user;
  const { id } = req.params;

  let query = "";
  let params = [];

  if (rol === "Cliente") {
    query = `
      SELECT p.ID_pago, p.Monto, p.Fecha_pago, p.Metodo_pago, p.Estado_pago, prod.Nombre_producto
      FROM pago p
      JOIN instalacion i ON i.ID_instalacion = p.ID_pago
      JOIN producto prod ON prod.ID_producto = i.ID_producto
      WHERE p.ID_pago = ? AND p.ID_usuario = ?
    `;
    params = [id, ID_usuario];
  } else if (rol === "Domiciliario") {
    query = `
      SELECT e.ID_entrega, e.Fecha_entrega, e.Cantidad, prod.Nombre_producto, u.Correo_electronico AS cliente
      FROM entrega e
      JOIN usuarios u ON u.ID_usuario = e.ID_usuario
      JOIN producto prod ON prod.ID_producto = e.ID_producto
      WHERE e.ID_entrega = ? AND e.ID_usuario = ?
    `;
    params = [id, ID_usuario];
  } else {
    return res.status(403).json({ message: "Rol no autorizado para ver este pedido" });
  }

  DB.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al obtener el pedido", details: err });
    if (result.length === 0) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ usuario: correo, rol, pedido: result[0] });
  });
});

module.exports = router;
