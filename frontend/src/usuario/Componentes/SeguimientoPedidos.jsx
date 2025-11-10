import React from "react";

const pedidos = [
  {
    id: "PED-001",
    producto: "Panel Solar 450W",
    estado: "En camino",
    fecha: "08/11/2025",
    estimado: "12/11/2025",
  },
  {
    id: "PED-002",
    producto: "Inversor Solar 5kW",
    estado: "Entregado",
    fecha: "02/11/2025",
    estimado: "05/11/2025",
  },
];

export default function SeguimientoPedidos() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Seguimiento de <span className="text-green-600">Pedidos</span>
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="border-b last:border-none py-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {pedido.producto}
              </h3>
              <p className="text-sm text-gray-500">
                Pedido ID: {pedido.id} | Fecha: {pedido.fecha}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  pedido.estado === "Entregado"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {pedido.estado}
              </p>
              <p className="text-gray-500 text-sm">
                Entrega estimada: {pedido.estimado}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
