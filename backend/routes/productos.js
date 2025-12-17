// routes/productos.js
const express = require("express"); 
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken, verificarRol } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser"); // npm install csv-parser

// ============================
// Configuración multer
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/productos";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `producto_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ============================
// GET: Todos los productos (ADMIN)
// ============================
router.get("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const sql = "SELECT * FROM producto";
  DB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener productos", details: err });
    res.json(results);
  });
});

// ============================
// POST: Crear producto
// ============================
router.post("/", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;
  const sql = "INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)";
  DB.query(sql, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al crear producto", details: err });
    res.status(201).json({ message: "Producto creado", ID_producto: result.insertId });
  });
});

// ============================
// PUT: Actualizar producto
// ============================
router.put("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = req.body;
  const sql = "UPDATE producto SET Nombre_producto=?, Tipo_producto=?, Precio=?, Marca=?, Fecha_fabricacion=?, Garantia=?, ID_proveedor=? WHERE ID_producto=?";
  DB.query(sql, [Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor, id], (err) => {
    if (err) return res.status(500).json({ message: "Error al actualizar producto", details: err });
    res.json({ message: "Producto actualizado" });
  });
});

// ============================
// DELETE: Eliminar producto
// ============================
router.delete("/:id", verificarToken, verificarRol(["administrador"]), (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM producto WHERE ID_producto=?";
  DB.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Error al eliminar producto", details: err });
    res.json({ message: "Producto eliminado" });
  });
});

// ============================
// POST: Subir imagen de producto
// ============================
router.post("/:id/imagen", verificarToken, verificarRol(["administrador"]), upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Archivo requerido" });
  const { id } = req.params;
  const filePath = `/uploads/productos/${req.file.filename}`;
  const sql = "UPDATE producto SET Foto=? WHERE ID_producto=?";
  DB.query(sql, [filePath, id], (err) => {
    if (err) return res.status(500).json({ message: "Error al subir imagen", details: err });
    res.json({ message: "Imagen subida correctamente", imagen: filePath });
  });
});

// ==================================================
// POST: Carga masiva de productos vía CSV (ADMIN)
// ==================================================
router.post(
  "/carga-masiva",
  verificarToken,
  verificarRol(["administrador"]),
  upload.single("archivo"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Archivo requerido" });

    const productos = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const nombre = row.Nombre_producto?.trim() || null;
          const tipo = row.Tipo_producto?.trim() || null;
          const precio = parseFloat(row.Precio) || 0;
          const marca = row.Marca?.trim() || null;
          const fecha = row.Fecha_fabricacion?.trim() || null;
          const garantia = parseInt(row.Garantia) || 0;
          const idProveedor = parseInt(row.ID_proveedor) || null;

          if (nombre && tipo && precio && marca && fecha && idProveedor) {
            productos.push([nombre, tipo, precio, marca, fecha, garantia, idProveedor]);
          }
        } catch (err) {
          console.error("Fila inválida ignorada:", row, err);
        }
      })
      .on("end", () => {
        fs.unlinkSync(filePath); // borramos archivo temporal

        if (productos.length === 0)
          return res.status(400).json({ message: "No se encontraron productos válidos en el archivo" });

        const sql = `INSERT INTO producto (Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor) VALUES ?`;
        DB.query(sql, [productos], (err, result) => {
          if (err) return res.status(500).json({ message: "Error al insertar productos", details: err });
          res.status(201).json({ message: `${result.affectedRows} productos cargados correctamente` });
        });
      });
  }
);

module.exports = router;
