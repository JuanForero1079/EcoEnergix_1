// controllers/entregasController.js
const DB = require("../db/connection");
const AppError = require("../utils/error");

// ===============================
// GET ENTREGAS (ADMIN)
// ===============================
exports.getEntregas = (req, res, next) => {
  const sql = `
    SELECT 
      e.ID_entrega,
      e.Cantidad,
      e.Fecha_entrega,
      e.ID_usuario,
      e.ID_producto,
      u.Nombre AS Nombre_usuario,
      p.Nombre AS Nombre_producto
    FROM entrega e
    INNER JOIN usuarios u ON e.ID_usuario = u.ID_usuario
    INNER JOIN productos p ON e.ID_producto = p.ID_producto
    ORDER BY e.Fecha_entrega DESC
  `;

  DB.query(sql, (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return next(new AppError("Error al obtener entregas", 500));
    }
    res.json(result);
  });
};

// ===============================
// POST ENTREGA DESDE PAGO (CLIENTE)
// ===============================
exports.crearEntregaDesdePago = (req, res, next) => {
  const { ID_usuario, ID_producto, Cantidad, Fecha_entrega } = req.body;

  const sql = `
    INSERT INTO entrega (ID_usuario, ID_producto, Cantidad, Fecha_entrega)
    VALUES (?, ?, ?, ?)
  `;

  DB.query(sql, [ID_usuario, ID_producto, Cantidad, Fecha_entrega], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return next(new AppError("Error al crear entrega desde pago", 500));
    }
    res.status(201).json({ message: "Entrega creada desde pago", ID_entrega: result.insertId });
  });
};

// ===============================
// POST ENTREGA (ADMIN)
// ===============================
exports.crearEntregaAdmin = (req, res, next) => {
  const { ID_usuario, ID_producto, Cantidad, Fecha_entrega } = req.body;

  const sql = `
    INSERT INTO entrega (ID_usuario, ID_producto, Cantidad, Fecha_entrega)
    VALUES (?, ?, ?, ?)
  `;

  DB.query(sql, [ID_usuario, ID_producto, Cantidad, Fecha_entrega], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return next(new AppError("Error al crear entrega", 500));
    }
    res.status(201).json({ message: "Entrega creada por admin", ID_entrega: result.insertId });
  });
};

// ===============================
// PUT ENTREGA (ADMIN)
// ===============================
exports.actualizarEntrega = (req, res, next) => {
  const { id } = req.params;
  const { ID_usuario, ID_producto, Cantidad, Fecha_entrega } = req.body;

  const sql = `
    UPDATE entrega
    SET ID_usuario = ?, ID_producto = ?, Cantidad = ?, Fecha_entrega = ?
    WHERE ID_entrega = ?
  `;

  DB.query(sql, [ID_usuario, ID_producto, Cantidad, Fecha_entrega, id], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return next(new AppError("Error al actualizar entrega", 500));
    }
    if (result.affectedRows === 0) {
      return next(new AppError("Entrega no encontrada", 404));
    }
    res.json({ message: "Entrega actualizada correctamente" });
  });
};

// ===============================
// DELETE ENTREGA (ADMIN)
// ===============================
exports.eliminarEntrega = (req, res, next) => {
  const { id } = req.params;

  const sql = "DELETE FROM entrega WHERE ID_entrega = ?";

  DB.query(sql, [id], (err, result) => {
    if (err) {
      console.error("ERROR SQL:", err);
      return next(new AppError("Error al eliminar entrega", 500));
    }
    if (result.affectedRows === 0) {
      return next(new AppError("Entrega no encontrada", 404));
    }
    res.json({ message: "Entrega eliminada correctamente" });
  });
};
