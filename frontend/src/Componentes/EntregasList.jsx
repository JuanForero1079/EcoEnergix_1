import React, { useEffect, useState } from "react";
import API from "../services/api";

function EntregasList() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/entrega")
      .then((res) => {
        setEntregas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener entregas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando entregas...</p>;

  return (
    <div>
      <h2>Lista de entregas</h2>
      {entregas.length === 0 ? (
        <p>No hay entregas registradas</p>
      ) : (
        <ul>
          {entregas.map((e) => (
            <li key={e.ID_entrega}>
              #{e.ID_entrega} – Usuario: {e.ID_usuario} – Producto: {e.ID_producto} – Cantidad: {e.Cantidad}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EntregasList;
