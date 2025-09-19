import React, { useEffect, useState } from "react";
import API from "../services/api"; // importamos la configuración de axios

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/usuarios")
      .then((res) => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div>
      <h2>Lista de usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.ID_usuario}>
              <strong>{u.Nombre}</strong> ({u.Correo_electronico}) – Rol:{" "}
              {u.Rol_usuario}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsuariosList;
