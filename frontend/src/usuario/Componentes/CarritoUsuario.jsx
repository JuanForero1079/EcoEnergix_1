import React from "react";
import { useCarrito } from "../context/CarritoContext";

export default function CarritoUsuario() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Tu <span className="text-green-600">Carrito de Compras</span>
      </h1>

      {carrito.length === 0 ? (
        <p className="text-center text-gray-600">Tu carrito está vacío </p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-6">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.nombre}</h2>
                  <p className="text-green-600">{item.precio}</p>
                  <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                </div>
              </div>
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex justify-between mt-8 text-lg font-medium">
            <span>Total:</span>
            <span className="text-green-600">${total.toLocaleString()}</span>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button
              onClick={vaciarCarrito}
              className="px-4 py-2 border rounded-xl hover:bg-gray-100"
            >
              Vaciar carrito
            </button>
            <a
             href="/usuario/pago"
             className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
              Proceder al pago
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
