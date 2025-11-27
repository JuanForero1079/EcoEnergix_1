const DB = require("../db/connection");
const { hashPassword } = require("../utils/password");

DB.query("SELECT ID_usuario, Contraseña FROM usuarios", async (err, results) => {
  if (err) throw err;

  for (const user of results) {
    // Solo hashea si no parece un hash de bcrypt
    if (!user.Contraseña.startsWith("$2")) {
      const hashed = await hashPassword(user.Contraseña);
      DB.query("UPDATE usuarios SET Contraseña = ? WHERE ID_usuario = ?", [hashed, user.ID_usuario], (err) => {
        if (err) console.error(err);
      });
    }
  }

  console.log("Contraseñas existentes actualizadas a hash");
  process.exit();
});
