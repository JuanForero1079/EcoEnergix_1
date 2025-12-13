import React from 'react';
import { useCarrito } from '../context/CarritoContext';

// Componente temporal para debuggear - eliminar en producción
export default function DebugCarrito() {
  const { carrito, total } = useCarrito();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto text-xs z-50">
      <h3 className="font-bold text-lg mb-2 text-[#3dc692]"> Debug Carrito</h3>
      
      <div className="mb-3">
        <strong className="text-yellow-400">Total de productos:</strong> {carrito.length}
      </div>
      
      <div className="mb-3">
        <strong className="text-yellow-400">Total a pagar:</strong> ${total.toLocaleString()}
      </div>

      <div className="space-y-2">
        <strong className="text-yellow-400">Productos en carrito:</strong>
        {carrito.length === 0 ? (
          <div className="text-gray-400 italic">Carrito vacío</div>
        ) : (
          carrito.map((item, index) => (
            <div key={index} className="bg-white/10 p-2 rounded border border-white/20 mb-2">
              <div><strong>Índice:</strong> {index}</div>
              <div><strong>ID:</strong> {item.id || 'Sin ID'}</div>
              <div><strong>_ID:</strong> {item._id || 'Sin _ID'}</div>
              <div><strong>Nombre:</strong> {item.nombre || 'Sin nombre'}</div>
              <div><strong>Precio:</strong> ${item.precio?.toLocaleString() || '0'}</div>
              <div><strong>Cantidad:</strong> {item.cantidad || 0}</div>
              <div><strong>Subtotal:</strong> ${((item.precio || 0) * (item.cantidad || 0)).toLocaleString()}</div>
              
              <details className="mt-2">
                <summary className="cursor-pointer text-[#3dc692] hover:text-[#5f54b3]">
                  Ver objeto completo
                </summary>
                <pre className="mt-1 text-[10px] bg-black/50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </details>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <strong className="text-yellow-400">LocalStorage:</strong>
        <pre className="mt-1 text-[10px] bg-black/50 p-2 rounded overflow-x-auto">
          {localStorage.getItem('carrito') || 'Vacío'}
        </pre>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('carrito');
          window.location.reload();
        }}
        className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold"
      >
         Limpiar LocalStorage y Recargar
      </button>
    </div>
  );
}