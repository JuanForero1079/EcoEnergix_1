const { hashPassword } = require("../utils/password");

router.post("/", verificarToken, verificarRol("admin"), async (req, res) => {
  try {
    let { Nombre, Correo_electronico, Rol_usuario, Contraseña, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario } = req.body;
    if (!Nombre || !Correo_electronico || !Rol_usuario || !Contraseña) 
      return res.status(400).json({ success: false, message: "Nombre, correo, rol y contraseña son obligatorios" });

    Contraseña = await hashPassword(Contraseña);

    const sql = `
      INSERT INTO usuarios (Nombre, Correo_electronico, Rol_usuario, Contraseña, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    DB.query(sql, [Nombre, Correo_electronico, Rol_usuario, Contraseña, Tipo_documento || null, Numero_documento || null, Foto_usuario || null, Estado_usuario || "activo"], 
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error al crear usuario" });
        res.status(201).json({
          success: true,
          message: "Usuario creado exitosamente",
          data: { ID_usuario: result.insertId, Nombre, Correo_electronico, Rol_usuario, Tipo_documento, Numero_documento, Foto_usuario, Estado_usuario }
        });
    });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
