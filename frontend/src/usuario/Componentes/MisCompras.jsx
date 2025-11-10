import React from "react";

export default function MisCompras() {
  const compras = [
    { id: 1, producto: "Panel solar 300W", fecha: "05/11/2025", estado: "Entregado" },
    { id: 2, producto: "Batería solar 12V", fecha: "02/11/2025", estado: "En camino" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Mis <span className="text-green-600">Compras</span>
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3">Producto</th>
              <th className="py-3">Fecha</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{c.producto}</td>
                <td>{c.fecha}</td>
                <td className="text-green-600">{c.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
