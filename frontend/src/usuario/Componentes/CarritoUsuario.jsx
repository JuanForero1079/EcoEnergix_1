import React from "react";
import { 
  FaShoppingCart, FaTrash, FaArrowRight, FaBoxOpen, FaMinus, FaPlus 
} from "react-icons/fa";
import { useCarrito } from "../context/CarritoContext";
import { getFullImageUrl } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

export default function CarritoUsuario() {
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    total,
    aumentarCantidad,
    disminuirCantidad,
    cargando
  } = useCarrito();

  const navigate = useNavigate();

  // Solo navega al paso de pago, no crea pedido aquí
  const procederPago = () => {
    if(carrito.length === 0) return;
    navigate("/usuario/pago");
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Cargando carrito...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-xl">
            <FaShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
            Carrito de Compras
          </h1>
        </div>

        {carrito.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <FaBoxOpen className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-blue-200 mb-6">Agrega productos desde nuestro catálogo</p>
            <a
              href="/usuario/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3dc692]/50 transition-all hover:scale-105"
            >
              Ir al Catálogo
              <FaArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {carrito.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:border-[#3dc692]/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-white/5 rounded-xl p-2 overflow-hidden">
                      <img
                        src={getFullImageUrl(item.imagen)}
                        alt={item.nombre}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">{item.nombre}</h2>
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent mb-2">
                          ${item.precio?.toLocaleString() || '0'}
                        </p>
                        <div className="flex items-center gap-2 text-blue-200 text-sm">
                          <span>Cantidad:</span>
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
                            <button 
                              onClick={() => disminuirCantidad(item.id)}
                              disabled={item.cantidad <= 1}
                              className={`text-white transition ${item.cantidad <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#3dc692]'}`}
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="text-white font-semibold min-w-[2rem] text-center">{item.cantidad}</span>
                            <button 
                              onClick={() => aumentarCantidad(item.id)}
                              className="text-white hover:text-[#3dc692] transition"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-blue-200">
                          Subtotal: <span className="text-white font-bold">${(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-400/50 text-red-300 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                        >
                          <FaTrash className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                  Resumen de Compra
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-blue-200">
                    <span>Productos ({carrito.length})</span>
                    <span className="text-white font-semibold">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-200">
                    <span>Envío</span>
                    <span className="text-[#3dc692] font-semibold">{total >= 5000 ? 'Gratis' : `$${(50).toLocaleString()}`}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
                        ${(total >= 5000 ? total : total + 50).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={procederPago}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#3dc692]/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Proceder al Pago
                    <FaArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={vaciarCarrito}
                    className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-300 transition-all flex items-center justify-center gap-2"
                  >
                    <FaTrash className="w-4 h-4" />
                    Vaciar Carrito
                  </button>
                </div>

                <div className="mt-6 p-4 bg-[#3dc692]/10 border border-[#3dc692]/30 rounded-xl">
                  <p className="text-sm text-[#3dc692] font-semibold flex items-center gap-2">
                    {total >= 5000 
                      ? '¡Envío gratis aplicado!' 
                      : `Agrega $${(5000 - total).toLocaleString()} más para envío gratis`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
