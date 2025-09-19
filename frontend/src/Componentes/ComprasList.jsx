import React, { useEffect, useState } from "react";
import API from "../services/api";

function ComprasList() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/compras")
      .then((res) => {
        setCompras(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener compras:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando compras...</p>;
  }

  return (
    <div>
      <h2>Lista de compras</h2>
      {compras.length === 0 ? (
        <p>No hay compras registradas</p>
      ) : (
        <ul>
          {compras.map((c) => (
            <li key={c.ID_compra}>
              Compra #{c.ID_compra} – Usuario: {c.ID_usuario} – Monto:{" "}
              {c.Monto_total} – Estado: {c.Estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComprasList;
