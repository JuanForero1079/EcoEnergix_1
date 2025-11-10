import React from "react";

export default function MisPagos() {
  const pagos = [
    { id: 1, referencia: "ECO1234", fecha: "05/11/2025", valor: 1500000, estado: "Aprobado" },
    { id: 2, referencia: "ECO1235", fecha: "02/11/2025", valor: 700000, estado: "Pendiente" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Mis <span className="text-green-600">Pagos</span>
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3">Referencia</th>
              <th className="py-3">Fecha</th>
              <th className="py-3">Valor</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td>{p.referencia}</td>
                <td>{p.fecha}</td>
                <td>${p.valor.toLocaleString()}</td>
                <td className="text-green-600">{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
