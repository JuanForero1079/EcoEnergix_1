
const express = require("express");
const router = express.Router();
const DB = require("../db/connection");

// GET: todos los productos (público)
router.get("/", (req, res) => {
  DB.query("SELECT * FROM producto", (err, result) => {
    if (err) {
      console.error("  [GET /api/productos] Error:", err.message);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    res.status(200).json(result);
  });
});

module.exports = router;
