// src/domiciliario/pages/PagosDomiciliario.jsx
import React, { useState } from "react";

export default function PagosDomiciliario() {
  const [pagos] = useState([
    { id: 1, fecha: "2025-11-01", monto: 120000, tipo: "Efectivo", estado: "Entregado" },
    { id: 2, fecha: "2025-10-31", monto: 45000, tipo: "Tarjeta", estado: "Revisado" },
  ]);

  const total = pagos.reduce((s, p) => s + p.monto, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-4">Pagos y Liquidaciones</h1>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
        <p className="text-white/80">Total periodo: <strong className="text-white">{total.toLocaleString()}</strong></p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <table className="w-full text-white">
          <thead>
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.fecha}</td>
                <td className="p-3">${p.monto.toLocaleString()}</td>
                <td className="p-3">{p.tipo}</td>
                <td className="p-3">{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
