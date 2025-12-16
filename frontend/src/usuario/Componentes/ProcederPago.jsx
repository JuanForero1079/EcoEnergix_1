import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCreditCard, 
  FaUniversity, 
  FaMoneyBillWave, 
  FaLock, 
  FaCheckCircle,
  FaShoppingBag,
  FaArrowLeft 
} from "react-icons/fa";
import { useCarrito } from "../context/CarritoContext";

// Servicios usando la instancia API
import { crearPagoCliente } from "../services/pagosCliente";
import { crearPedido } from "../services/pedidosCliente";
import { crearCompra } from "../services/comprasCliente";
import { crearEntrega } from "../services/entregasCliente";

export default function ProcederPago() {
  const navigate = useNavigate();
  const { carrito, total, vaciarCarrito } = useCarrito();
  const [metodo, setMetodo] = useState("tarjeta");
  const [loading, setLoading] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [error, setError] = useState(null);

  // Costos
  const costoEnvio = total >= 500000 ? 0 : 50000;
  const totalFinal = total + costoEnvio;

  if (carrito.length === 0 && !pagoExitoso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-md">
          <FaShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <p className="text-blue-200 mb-6">Agrega productos antes de proceder al pago</p>
          <button
            onClick={() => navigate("/usuario/catalogo")}
            className="px-6 py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Ir al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Crear pago
      const pago = await crearPagoCliente(metodo, totalFinal);
      if (!pago || !pago.pagoId) {
        throw new Error("Respuesta de pago inválida");
      }

      // 2️⃣ Crear pedido con productos del carrito
      const pedido = await crearPedido(carrito, pago.pagoId);
      if (!pedido || !pedido.ID_pedido) throw new Error("Error al crear pedido");

      // 3️⃣ Crear compra
      await crearCompra(carrito, pago.pagoId, pedido.ID_pedido);

      // 4️⃣ Crear entrega
      await crearEntrega(pedido.ID_pedido);

      // Todo OK
      setPagoExitoso(true);

      setTimeout(() => {
        vaciarCarrito();
        navigate("/usuario/catalogo");
      }, 3000);

    } catch (err) {
      console.error("Error al procesar la compra:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Hubo un problema al procesar tu compra"
      );
    }

    setLoading(false);
  };

  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <FaCheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">¡Pago Exitoso!</h2>
          <p className="text-blue-200 mb-2">Tu pedido ha sido procesado correctamente</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent mb-6">
            Total pagado: ${totalFinal.toLocaleString()}
          </p>
          <p className="text-sm text-blue-300">Redirigiendo al catálogo...</p>
        </div>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/usuario/carrito")}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition"
          >
            <FaArrowLeft className="w-5 h-5" />
            Volver al carrito
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-xl">
              <FaLock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
              Proceder al Pago
            </h1>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Método de pago */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                  Método de Pago
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button type="button" onClick={() => setMetodo("tarjeta")} className={`p-4 rounded-xl border-2 transition-all ${metodo === "tarjeta" ? "border-[#3dc692] bg-[#3dc692]/10" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                    <FaCreditCard className={`w-8 h-8 mx-auto mb-2 ${metodo === "tarjeta" ? "text-[#3dc692]" : "text-white"}`} />
                    <p className="text-white font-semibold">Tarjeta</p>
                  </button>

                  <button type="button" onClick={() => setMetodo("transferencia")} className={`p-4 rounded-xl border-2 transition-all ${metodo === "transferencia" ? "border-[#3dc692] bg-[#3dc692]/10" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                    <FaUniversity className={`w-8 h-8 mx-auto mb-2 ${metodo === "transferencia" ? "text-[#3dc692]" : "text-white"}`} />
                    <p className="text-white font-semibold">Transferencia</p>
                  </button>

                  <button type="button" onClick={() => setMetodo("entrega")} className={`p-4 rounded-xl border-2 transition-all ${metodo === "entrega" ? "border-[#3dc692] bg-[#3dc692]/10" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                    <FaMoneyBillWave className={`w-8 h-8 mx-auto mb-2 ${metodo === "entrega" ? "text-[#3dc692]" : "text-white"}`} />
                    <p className="text-white font-semibold">Contra Entrega</p>
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400">{error}</p>}

              {/* Botón confirmar */}
              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#3dc692]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaLock className="w-5 h-5" />
                    Confirmar Pago
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                Resumen del Pedido
              </h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {carrito.map((item) => (
                  <div key={item.id || item._id} className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{item.nombre || item.name || 'Producto'}</p>
                      <p className="text-blue-200 text-xs">Cantidad: {item.cantidad}</p>
                    </div>
                    <span className="text-white font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/20 pt-4">
                <div className="flex justify-between text-blue-200"><span>Subtotal</span><span className="text-white font-semibold">${total.toLocaleString()}</span></div>
                <div className="flex justify-between text-blue-200"><span>Envío</span><span className={`font-semibold ${costoEnvio === 0 ? 'text-[#3dc692]' : 'text-white'}`}>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span></div>
                <div className="flex justify-between text-lg pt-3 border-t border-white/10"><span className="text-white font-bold">Total</span><span className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">${totalFinal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
