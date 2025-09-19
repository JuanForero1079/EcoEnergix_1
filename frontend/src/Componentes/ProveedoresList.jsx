import React, { useEffect, useState } from "react";
import API from "../services/api";

function ProveedoresList() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/proveedor")
      .then((res) => {
        setProveedores(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener proveedores:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando proveedores...</p>;

  return (
    <div>
      <h2>Lista de proveedores</h2>
      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados</p>
      ) : (
        <ul>
          {proveedores.map((p) => (
            <li key={p.ID_proveedor}>
              {p.Nombre_empresa} – {p.Correo_electronico} – Tel: {p.Teléfono}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProveedoresList;
