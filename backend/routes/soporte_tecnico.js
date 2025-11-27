const express = require("express");
const router = express.Router();
const DB = require("../db/connection");
const { verificarToken } = require("../middleware/auth");

/* -------------------------------------------------------------------------- */
/*                        GET TODOS LOS SOPORTES (ADMIN)                      */
/* -------------------------------------------------------------------------- */
router.get("/", verificarToken, (req, res) => {
  const { id, rol } = req.user; // 🔥 token ya trae { id, correo, rol }
  const rolLower = rol.toLowerCase();

  let query = "SELECT * FROM soporte_tecnico";
  let params = [];

  if (rolLower === "cliente") {
    query += " WHERE ID_usuarioFK = ?";
    params.push(id);
  } 
  else if (rolLower === "domiciliario") {
    query += " WHERE ID_domiciliario = ?";
    params.push(id);
  } 
  else if (rolLower !== "administrador") {
    return res.status(403).json({ message: "Rol no autorizado" });
  }

  DB.query(query, params, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener soportes", details: err });

    res.json(result);
  });
});

/* -------------------------------------------------------------------------- */
/*                       GET SOPORTE POR ID (TODOS LOS ROLES)                */
/* -------------------------------------------------------------------------- */
router.get("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  DB.query("SELECT * FROM soporte_tecnico WHERE ID_soporte = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al buscar soporte", details: err });

    if (result.length === 0)
      return res.status(404).json({ message: "Soporte no encontrado" });

    const soporte = result[0];

    if (
      (rolLower === "cliente" && soporte.ID_usuarioFK !== userId) ||
      (rolLower === "domiciliario" && soporte.ID_domiciliario !== userId)
    ) {
      return res.status(403).json({ message: "No tienes permiso para ver este soporte" });
    }

    res.json(soporte);
  });
});

/* -------------------------------------------------------------------------- */
/*                           CREAR SOPORTE (TODOS)                            */
/* -------------------------------------------------------------------------- */
router.post("/", verificarToken, (req, res) => {
  const {
    Fecha_solicitud,
    Descripcion_problema,
    Fecha_resolucion,
    ID_usuarioFK,
    ID_producto,
    ID_instalacion,
    ID_domiciliario,
  } = req.body;

  if (
    !Fecha_solicitud ||
    !Descripcion_problema ||
    !ID_usuarioFK ||
    !ID_producto ||
    !ID_instalacion ||
    !ID_domiciliario
  ) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  DB.query(
    "INSERT INTO soporte_tecnico (Fecha_solicitud, Descripcion_problema, Fecha_resolucion, ID_usuarioFK, ID_producto, ID_instalacion, ID_domiciliario) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      Fecha_solicitud,
      Descripcion_problema,
      Fecha_resolucion || null,
      ID_usuarioFK,
      ID_producto,
      ID_instalacion,
      ID_domiciliario,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al crear soporte", details: err });

      res.status(201).json({
        message: "Soporte creado exitosamente",
        soporte: {
          ID_soporte: result.insertId,
          Fecha_solicitud,
          Descripcion_problema,
          Fecha_resolucion,
          ID_usuarioFK,
          ID_producto,
          ID_instalacion,
          ID_domiciliario,
        },
      });
    }
  );
});

/* -------------------------------------------------------------------------- */
/*                      ACTUALIZAR SOPORTE (ROLES PROPIOS)                   */
/* -------------------------------------------------------------------------- */
router.put("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const {
    Fecha_solicitud,
    Descripcion_problema,
    Fecha_resolucion,
    ID_usuarioFK,
    ID_producto,
    ID_instalacion,
    ID_domiciliario,
  } = req.body;

  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  if (
    !Fecha_solicitud ||
    !Descripcion_problema ||
    !ID_usuarioFK ||
    !ID_producto ||
    !ID_instalacion ||
    !ID_domiciliario
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios para actualizar" });
  }

  if (rolLower === "cliente" && ID_usuarioFK !== userId) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }

  if (rolLower === "domiciliario" && ID_domiciliario !== userId) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este soporte" });
  }

  DB.query(
    "UPDATE soporte_tecnico SET Fecha_solicitud = ?, Descripcion_problema = ?, Fecha_resolucion = ?, ID_usuarioFK = ?, ID_producto = ?, ID_instalacion = ?, ID_domiciliario = ? WHERE ID_soporte = ?",
    [
      Fecha_solicitud,
      Descripcion_problema,
      Fecha_resolucion || null,
      ID_usuarioFK,
      ID_producto,
      ID_instalacion,
      ID_domiciliario,
      id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Error al actualizar soporte", details: err });

      res.json({
        message: "Soporte actualizado exitosamente",
        soporte: {
          ID_soporte: id,
          Fecha_solicitud,
          Descripcion_problema,
          Fecha_resolucion,
          ID_usuarioFK,
          ID_producto,
          ID_instalacion,
          ID_domiciliario,
        },
      });
    }
  );
});

/* -------------------------------------------------------------------------- */
/*                    ELIMINAR SOPORTE (ROLES PROPIOS / ADMIN)               */
/* -------------------------------------------------------------------------- */
router.delete("/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { rol, id: userId } = req.user;
  const rolLower = rol.toLowerCase();

  let query = "DELETE FROM soporte_tecnico WHERE ID_soporte = ?";
  let params = [id];

  if (rolLower === "cliente") {
    query += " AND ID_usuarioFK = ?";
    params.push(userId);
  }

  if (rolLower === "domiciliario") {
    query += " AND ID_domiciliario = ?";
    params.push(userId);
  }

  DB.query(query, params, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar soporte", details: err });

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Soporte no encontrado o no tienes permiso para eliminar",
      });

    res.json({ message: "Soporte eliminado exitosamente", id });
  });
});

module.exports = router;
