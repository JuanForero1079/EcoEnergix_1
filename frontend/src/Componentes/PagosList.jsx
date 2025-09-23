import React, { useEffect, useState } from "react";
import API from "../services/api";

function PagosList() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/pago")
      .then((res) => {
        setPagos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener pagos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div>
      <h2>Lista de pagos</h2>
      {pagos.length === 0 ? (
        <p>No hay pagos registrados</p>
      ) : (
        <ul>
          {pagos.map((p) => (
            <li key={p.ID_pago}>
              #{p.ID_pago} – Usuario: {p.ID_usuario} – Monto: {p.Monto} –
              Estado: {p.Estado_pago}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PagosList;
