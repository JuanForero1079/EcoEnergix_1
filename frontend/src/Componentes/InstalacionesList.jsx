import React, { useEffect, useState } from "react";
import API from "../services/api";

function InstalacionesList() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/instalacion")
      .then((res) => {
        setInstalaciones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener instalaciones:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando instalaciones...</p>;

  return (
    <div>
      <h2>Lista de instalaciones</h2>
      {instalaciones.length === 0 ? (
        <p>No hay instalaciones registradas</p>
      ) : (
        <ul>
          {instalaciones.map((i) => (
            <li key={i.ID_instalacion}>
              #{i.ID_instalacion} – Usuario: {i.ID_usuario} – Producto: {i.ID_producto} – Estado: {i.Estado_instalacion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InstalacionesList;
