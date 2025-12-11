import React from "react";

export default function Auditoria() {
  const logs = [
    "Inicio de sesión - 12/02/2025",
    "Entrega completada - Pedido 1034",
    "Actualización de perfil",
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Auditoría</h1>

      <ul className="space-y-3">
        {logs.map((log, i) => (
          <li
            key={i}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white"
          >
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
}
