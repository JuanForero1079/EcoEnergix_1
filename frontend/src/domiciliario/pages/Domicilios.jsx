// src/domiciliario/pages/Domicilios.jsx
import React, { useState, useEffect } from "react";
import { getDeliveries, updateDeliveryStatus } from "../services/domicilioService";

export default function Domicilios() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    setDeliveries(getDeliveries());
  }, []);

  const handleSelectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleUpdateStatus = (status) => {
    if (!selectedDelivery) return;
    updateDeliveryStatus(selectedDelivery.id, status);
    setDeliveries(getDeliveries());
  };

  const glass = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
  };

  return (
    <div className="p-8 space-y-8 text-white relative">
      <span className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 opacity-20 blur-xl" />

      <div style={glass} className="p-6">
        <h2 className="text-3xl font-bold">Gestión de Domicilios</h2>
        <p className="text-white/70">Ver, seleccionar y registrar entregas</p>
      </div>

      {/* TABLA */}
      <div style={glass} className="p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-teal-400">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} className="hover:bg-white/20 transition">
                <td className="p-3">{d.id}</td>
                <td className="p-3">{d.client}</td>
                <td className="p-3">{d.address}</td>
                <td className="p-3">{d.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleSelectDelivery(d)}
                    className="px-4 py-2 rounded-xl border border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white"
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETALLES */}
      {selectedDelivery && (
        <div style={glass} className="p-6 space-y-3">
          <h3 className="text-xl font-bold">Domicilio Seleccionado</h3>

          <p><strong>ID:</strong> {selectedDelivery.id}</p>
          <p><strong>Cliente:</strong> {selectedDelivery.client}</p>
          <p><strong>Dirección:</strong> {selectedDelivery.address}</p>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleUpdateStatus("En proceso")}
              className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              Marcar En Proceso
            </button>

            <button
              onClick={() => handleUpdateStatus("Entregado")}
              className="px-4 py-2 rounded-xl border border-green-400 text-green-400 hover:bg-green-500 hover:text-white"
            >
              Registrar Entrega
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
