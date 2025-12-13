import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingBag, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaEye,
  FaSearch,
  FaFilter,
  FaArrowLeft
} from "react-icons/fa";

export default function MisCompras() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      // Reemplaza con tu endpoint real
      // const response = await fetch('http://localhost:5000/api/compras/usuario');
      // const data = await response.json();
      // setCompras(data);

      // Datos de ejemplo mientras conectas con el backend
      setTimeout(() => {
        setCompras([
          {
            id: 1,
            numeroOrden: "ORD-2025-001",
            fecha: "2025-01-15",
            productos: [
              { nombre: "Panel Solar 450W Monocristalino", cantidad: 2, precio: 850000 },
              { nombre: "Inversor 5kW", cantidad: 1, precio: 1200000 }
            ],
            total: 2900000,
            estado: "entregado",
            metodoPago: "Tarjeta de crédito",
            direccion: "Calle 123 #45-67, Bogotá"
          },
          {
            id: 2,
            numeroOrden: "ORD-2025-002",
            fecha: "2025-01-18",
            productos: [
              { nombre: "Panel Solar 550W Bifacial", cantidad: 4, precio: 1200000 }
            ],
            total: 4800000,
            estado: "en_camino",
            metodoPago: "Transferencia bancaria",
            direccion: "Carrera 45 #12-34, Medellín"
          },
          {
            id: 3,
            numeroOrden: "ORD-2025-003",
            fecha: "2025-01-20",
            productos: [
              { nombre: "Kit Solar Residencial 5kW", cantidad: 1, precio: 15000000 },
              { nombre: "Batería Litio 10kWh", cantidad: 2, precio: 8000000 }
            ],
            total: 31000000,
            estado: "procesando",
            metodoPago: "Pago contra entrega",
            direccion: "Avenida 68 #89-12, Bogotá"
          },
          {
            id: 4,
            numeroOrden: "ORD-2025-004",
            fecha: "2025-01-10",
            productos: [
              { nombre: "Panel Solar 300W", cantidad: 6, precio: 650000 }
            ],
            total: 3900000,
            estado: "cancelado",
            metodoPago: "Tarjeta de débito",
            direccion: "Calle 50 #23-45, Cali"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar compras:', error);
      setLoading(false);
    }
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      procesando: {
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        border: "border-yellow-400/50",
        icon: <FaClock className="w-4 h-4" />,
        texto: "Procesando"
      },
      en_camino: {
        color: "text-blue-400",
        bg: "bg-blue-500/20",
        border: "border-blue-400/50",
        icon: <FaTruck className="w-4 h-4" />,
        texto: "En camino"
      },
      entregado: {
        color: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-400/50",
        icon: <FaCheckCircle className="w-4 h-4" />,
        texto: "Entregado"
      },
      cancelado: {
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-400/50",
        icon: <FaTimesCircle className="w-4 h-4" />,
        texto: "Cancelado"
      }
    };
    return configs[estado] || configs.procesando;
  };

  const comprasFiltradas = compras.filter(compra => {
    const cumpleFiltro = filtro === "todas" || compra.estado === filtro;
    const cumpleBusqueda = compra.numeroOrden.toLowerCase().includes(busqueda.toLowerCase()) ||
                           compra.productos.some(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    return cumpleFiltro && cumpleBusqueda;
  });

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#3dc692] border-t-transparent rounded-full animate-spin"></div>
          Cargando compras...
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

      <div className="max-w-7xl mx-auto">
        {/* Header con botón volver */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-blue-200 hover:text-white hover:border-[#3dc692]/50 transition-all"
          >
            <FaArrowLeft className="w-5 h-5" />
            Volver
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-xl">
              <FaShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
              Mis Compras
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-blue-200 text-lg">
            Total de compras: <span className="text-white font-bold">{compras.length}</span>
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número de orden o producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition"
              />
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-blue-200 w-5 h-5" />
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition cursor-pointer"
              >
                <option value="todas" className="bg-slate-900">Todas</option>
                <option value="procesando" className="bg-slate-900">Procesando</option>
                <option value="en_camino" className="bg-slate-900">En camino</option>
                <option value="entregado" className="bg-slate-900">Entregadas</option>
                <option value="cancelado" className="bg-slate-900">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de compras */}
        {comprasFiltradas.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
            <FaBox className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No se encontraron compras</h2>
            <p className="text-blue-200">
              {busqueda || filtro !== "todas" 
                ? "Intenta cambiar los filtros de búsqueda" 
                : "Aún no has realizado ninguna compra"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comprasFiltradas.map((compra) => {
              const estadoConfig = getEstadoConfig(compra.estado);
              
              return (
                <div
                  key={compra.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:border-[#3dc692]/50 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <FaBox className="w-6 h-6 text-[#3dc692]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Orden #{compra.numeroOrden}
                        </h3>
                        <p className="text-blue-200 text-sm">
                          {formatearFecha(compra.fecha)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 ${estadoConfig.bg} ${estadoConfig.border} border rounded-xl`}>
                        {estadoConfig.icon}
                        <span className={`font-semibold ${estadoConfig.color}`}>
                          {estadoConfig.texto}
                        </span>
                      </div>

                      <button
                        onClick={() => setCompraSeleccionada(compra)}
                        className="px-4 py-2 bg-[#3dc692]/20 border border-[#3dc692]/50 text-[#3dc692] rounded-xl hover:bg-[#3dc692] hover:text-white transition-all flex items-center gap-2"
                      >
                        <FaEye className="w-4 h-4" />
                        Ver detalle
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Productos</p>
                      <p className="text-white font-semibold">
                        {compra.productos.length} {compra.productos.length === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Método de pago</p>
                      <p className="text-white font-semibold">{compra.metodoPago}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Total</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
                        ${compra.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {compraSeleccionada && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                Detalle de Orden #{compraSeleccionada.numeroOrden}
              </h2>
              <button
                onClick={() => setCompraSeleccionada(null)}
                className="text-white hover:text-gray-200 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info general */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Fecha de compra</p>
                  <p className="text-white font-semibold">{formatearFecha(compraSeleccionada.fecha)}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Estado</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 ${getEstadoConfig(compraSeleccionada.estado).bg} rounded-lg`}>
                    {getEstadoConfig(compraSeleccionada.estado).icon}
                    <span className={getEstadoConfig(compraSeleccionada.estado).color}>
                      {getEstadoConfig(compraSeleccionada.estado).texto}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Método de pago</p>
                  <p className="text-white font-semibold">{compraSeleccionada.metodoPago}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Dirección de entrega</p>
                  <p className="text-white font-semibold">{compraSeleccionada.direccion}</p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Productos</h3>
                <div className="space-y-3">
                  {compraSeleccionada.productos.map((producto, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">{producto.nombre}</p>
                        <p className="text-blue-200 text-sm">Cantidad: {producto.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-200 text-sm">Precio unitario</p>
                        <p className="text-white font-semibold">${producto.precio.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-[#3dc692]/10 to-[#5f54b3]/10 border border-[#3dc692]/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total pagado</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
                    ${compraSeleccionada.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}