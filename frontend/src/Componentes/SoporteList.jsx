import React, { useEffect, useState } from "react";
import API from "../services/api";

function SoporteList() {
  const [soportes, setSoportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/soporte")
      .then((res) => {
        setSoportes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener soporte técnico:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando solicitudes de soporte...</p>;

  return (
    <div>
      <h2>Soporte técnico</h2>
      {soportes.length === 0 ? (
        <p>No hay solicitudes registradas</p>
      ) : (
        <ul>
          {soportes.map((s) => (
            <li key={s.ID_soporte}>
              #{s.ID_soporte} – Usuario: {s.ID_usuarioFK} – Problema: {s.Descripcion_problema}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SoporteList;
