import React from "react";

export default function Agenda() {
  const actividades = [
    "Revisión de moto - 10:00 AM",
    "Entrega prioritaria - 12:00 PM",
    "Instalación solar - 3:00 PM",
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Agenda del Día</h1>

      <div className="space-y-4">
        {actividades.map((a, i) => (
          <div
            key={i}
            className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white"
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}
