import React, { useState } from "react";

export default function ProcederPago() {
  const [metodo, setMetodo] = useState("tarjeta");

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Proceder al <span className="text-green-600">Pago</span>
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* RESUMEN DEL PEDIDO */}
        <h2 className="text-2xl font-semibold mb-6">Resumen del Pedido</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between border-b pb-2">
            <span>Panel Solar 450W</span>
            <span>$850,000</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Inversor 5kW</span>
            <span>$1,200,000</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>$2,050,000</span>
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <h2 className="text-2xl font-semibold mb-4">Método de Pago</h2>

        <form className="space-y-6">
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="tarjeta">Tarjeta (crédito o débito)</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="entrega">Pago contra entrega</option>
          </select>

          {/* PAGO CON TARJETA */}
          {metodo === "tarjeta" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Número de tarjeta"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Nombre en la tarjeta"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* TRANSFERENCIA BANCARIA */}
          {metodo === "transferencia" && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Realiza tu transferencia a la siguiente cuenta bancaria:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p>
                  <strong>Banco:</strong> Bancolombia
                </p>
                <p>
                  <strong>Número de cuenta:</strong> 123-456789-01
                </p>
                <p>
                  <strong>Tipo:</strong> Ahorros
                </p>
                <p>
                  <strong>Titular:</strong> EcoEnergix S.A.S.
                </p>
              </div>
              <label className="block text-sm text-gray-600">
                Adjunta comprobante de pago:
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* PAGO CONTRA ENTREGA */}
          {metodo === "entrega" && (
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 border border-yellow-200">
              <p>
                <strong>Pago contra entrega:</strong> El pago se realizará en
                efectivo o con datáfono al recibir tu pedido en la dirección
                indicada.
              </p>
            </div>
          )}

          {/* BOTÓN CONFIRMAR */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Confirmar Pago
          </button>
        </form>
      </div>
    </div>
  );
}
