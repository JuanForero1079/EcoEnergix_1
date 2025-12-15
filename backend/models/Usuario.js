const DB = require("../db/connection");

const Usuario = {
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      DB.query(
        `SELECT ID_usuario, Nombre, Correo_electronico, Tipo_documento, Numero_documento, Rol_usuario, Foto_usuario 
         FROM usuarios WHERE ID_usuario = ? LIMIT 1`,
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  updatePerfil: async (id, Nombre, Tipo_documento, Numero_documento) => {
    return new Promise((resolve, reject) => {
      DB.query(
        `UPDATE usuarios 
         SET Nombre = ?, Tipo_documento = ?, Numero_documento = ? 
         WHERE ID_usuario = ?`,
        [Nombre, Tipo_documento, Numero_documento, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  updateFoto: async (id, rutaFoto) => {
    return new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET Foto_usuario = ? WHERE ID_usuario = ?",
        [rutaFoto, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
};

module.exports = Usuario;
