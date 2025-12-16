const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken } = require("../middleware/auth");

// POST: Crear pedido + pago + entrega (CLIENTE)
router.post("/", verificarToken, (req, res) => {
  const userId = req.user.id;
  const { Metodo_pago } = req.body;

  if (!Metodo_pago) {
    return res.status(400).json({ message: "Método de pago es obligatorio" });
  }

  // Fecha actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const Fecha_pago = new Date();

  // 1️ Obtener productos del carrito
  DB.query(
    `SELECT c.ID_producto, c.Cantidad, p.Precio, p.Tiempo_preparacion 
     FROM carrito c 
     JOIN producto p ON c.ID_producto = p.ID_producto 
     WHERE c.ID_usuario = ?`,
    [userId],
    (err, productos) => {
      if (err) return res.status(500).json({ error: "Error al obtener carrito", details: err });
      if (!productos || productos.length === 0) return res.status(400).json({ message: "Carrito vacío" });

      // Calcular total
      const total = productos.reduce((acc, item) => acc + item.Precio * item.Cantidad, 0);

      // Fecha mínima de entrega
      const maxPreparacion = Math.max(...productos.map(p => p.Tiempo_preparacion || 0));
      const fechaEntregaMin = new Date();
      fechaEntregaMin.setDate(hoy.getDate() + maxPreparacion);

      // 2️ Crear pedido
      DB.query(
        "INSERT INTO pedido (ID_usuario, Total, Estado) VALUES (?, ?, 'Pendiente')",
        [userId, total],
        (err, resultPedido) => {
          if (err) return res.status(500).json({ error: "Error al crear pedido", details: err });

          const pedidoId = resultPedido.insertId;

          // 3️ Crear detalle pedido
          const detalles = productos.map(item => [pedidoId, item.ID_producto, item.Cantidad, item.Precio]);
          DB.query(
            "INSERT INTO detalle_pedido (ID_pedido, ID_producto, Cantidad, Precio_unitario) VALUES ?",
            [detalles],
            (err) => {
              if (err) return res.status(500).json({ error: "Error al crear detalle del pedido", details: err });

              // 4️ Crear pago
              DB.query(
                "INSERT INTO pago (ID_usuario, Monto, Fecha_pago, Metodo_pago, Estado_pago) VALUES (?, ?, ?, ?, 'Completado')",
                [userId, total, Fecha_pago, Metodo_pago],
                (err, resultPago) => {
                  if (err) return res.status(500).json({ error: "Error al crear pago", details: err });

                  const pagoId = resultPago.insertId;

                  // 5️ Crear entrega
                  const entregas = productos.map(item => [fechaEntregaMin, userId, item.ID_producto, item.Cantidad]);
                  DB.query(
                    "INSERT INTO entrega (Fecha_entrega, ID_usuario, ID_producto, Cantidad) VALUES ?",
                    [entregas],
                    (err) => {
                      if (err) return res.status(500).json({ error: "Error al crear entrega", details: err });

                      // 6️ Vaciar carrito
                      DB.query("DELETE FROM carrito WHERE ID_usuario = ?", [userId], (err) => {
                        if (err) console.error("Error al vaciar carrito:", err);

                        // Respuesta final
                        res.status(201).json({
                          message: "Pedido, pago y entrega creados exitosamente",
                          pedidoId,
                          pagoId,
                          total,
                          Fecha_entrega: fechaEntregaMin.toISOString().split("T")[0]
                        });
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
