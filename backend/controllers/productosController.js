const DB = require("../db/connection");
const fs = require("fs");
const csv = require("csv-parser");
const AppError = require("../utils/error"); // opcional si quieres manejo centralizado de errores

// ==============================
// Carga masiva de productos
// ==============================
exports.cargaMasivaProductos = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Archivo CSV requerido" });
  }

  const productos = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Validar campos obligatorios
      if (
        row.Nombre_producto &&
        row.Tipo_producto &&
        row.Precio &&
        row.Marca &&
        row.Fecha_fabricacion &&
        row.Garantia &&
        row.ID_proveedor
      ) {
        productos.push([
          row.Nombre_producto,
          row.Tipo_producto,
          row.Precio,
          row.Marca,
          row.Fecha_fabricacion,
          row.Garantia,
          row.ID_proveedor,
        ]);
      }
    })
    .on("end", () => {
      fs.unlinkSync(filePath); // borrar archivo temporal

      if (productos.length === 0) {
        return res.status(400).json({ message: "No se encontraron productos válidos en el archivo" });
      }

      const sql = `INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES ?`;
      DB.query(sql, [productos], (err, result) => {
        if (err) return next(new AppError("Error al insertar productos masivos", 500));
        res.status(201).json({ message: `${result.affectedRows} productos cargados correctamente` });
      });
    })
    .on("error", (err) => {
      fs.unlinkSync(filePath);
      return next(new AppError("Error al procesar el archivo CSV", 500));
    });
};
