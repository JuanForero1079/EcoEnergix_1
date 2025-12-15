const DB = require("../db/connection");

const Admin = {
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      DB.query(
        "SELECT ID_usuario, Nombre, Correo_electronico, Rol_usuario FROM usuarios WHERE ID_usuario = ? AND Rol_usuario = 'admin' LIMIT 1",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },
};

module.exports = Admin;
