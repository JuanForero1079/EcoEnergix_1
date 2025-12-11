// src/domiciliario/pages/InstalacionesAsignadas.jsx
import React from "react";

export default function InstalacionesAsignadas() {
  const tareas = [
    { id: 301, cliente: "Empresa X", direccion: "Cll 20 #10-30", fecha: "2025-11-05", estado: "Programada" },
    { id: 302, cliente: "Casa Y", direccion: "Av 15 #7-12", fecha: "2025-11-06", estado: "En ruta" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-4">Instalaciones Asignadas</h1>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <ul className="space-y-3">
          {tareas.map(t => (
            <li key={t.id} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">{t.cliente} — {t.direccion}</div>
                <div className="text-sm text-white/70">{t.fecha} • {t.estado}</div>
              </div>
              <div>
                <button className="px-3 py-2 rounded-md bg-blue-600 text-white">Ver detalles</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
