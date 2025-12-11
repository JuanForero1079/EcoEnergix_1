// src/domiciliario/pages/SoporteTraslados.jsx
import React, { useState } from "react";

export default function SoporteTraslados() {
  const [items, setItems] = useState([
    { id: "S-101", cliente: "María", tarea: "Recoger equipo", status: "Asignado" },
    { id: "S-102", cliente: "Andrés", tarea: "Entregar equipo reparado", status: "Pendiente" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-4">Soporte Técnico (Traslados)</h1>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-white font-semibold">{it.tarea}</div>
                <div className="text-sm text-white/70">{it.cliente} • {it.id}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-md bg-green-600 text-white">Marcar como lista</button>
                <button className="px-3 py-2 rounded-md bg-red-600 text-white">Reportar incidencia</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
