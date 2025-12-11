// src/domiciliario/pages/HistorialEntregas.jsx
import React, { useState, useEffect } from "react";

export default function HistorialEntregas() {
  const [history, setHistory] = useState([
    { id: 101, date: "2025-11-01", client: "Carlos Pérez", status: "Entregado", calificacion: 5 },
    { id: 98, date: "2025-10-30", client: "Ana Torres", status: "Entregado", calificacion: 4 },
    { id: 92, date: "2025-10-28", client: "Luis Gómez", status: "Entregado", calificacion: 5 },
  ]);

  useEffect(() => {}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-4">Historial de Entregas</h1>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <table className="w-full text-white">
          <thead>
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Calificación</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-t border-white/10">
                <td className="p-3">{h.id}</td>
                <td className="p-3">{h.date}</td>
                <td className="p-3">{h.client}</td>
                <td className="p-3">{h.status}</td>
                <td className="p-3">{h.calificacion} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
