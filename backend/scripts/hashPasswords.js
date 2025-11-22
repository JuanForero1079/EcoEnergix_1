// scripts/hashPasswords.js
const DB = require("../db/connection"); // Ajusta la ruta según tu proyecto
const { hashPassword } = require("../utils/password"); // Tu módulo de hash

(async () => {
  try {
    // Obtener todos los usuarios
    DB.query("SELECT ID_usuario, Contraseña FROM usuarios", async (err, users) => {
      if (err) throw err;

      for (const user of users) {
        const { ID_usuario, Contraseña } = user;

        // Saltar si ya está hasheada
        if (!Contraseña.startsWith("$2b$")) {
          const hashed = await hashPassword(Contraseña);
          DB.query(
            "UPDATE usuarios SET Contraseña = ? WHERE ID_usuario = ?",
            [hashed, ID_usuario],
            (err2) => {
              if (err2) console.error(`Error actualizando usuario ${ID_usuario}:`, err2);
              else console.log(`Usuario ${ID_usuario} actualizado correctamente.`);
            }
          );
        } else {
          console.log(`Usuario ${ID_usuario} ya tiene contraseña hasheada.`);
        }
      }
    });
  } catch (error) {
    console.error("Error al hashear contraseñas:", error);
  } finally {
    // Cerrar conexión si tu DB lo requiere
    // DB.end();
  }
})();
