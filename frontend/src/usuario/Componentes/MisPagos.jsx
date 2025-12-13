import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaMoneyCheckAlt, 
  FaCreditCard, 
  FaUniversity, 
  FaMoneyBillWave,
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaReceipt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaArrowLeft
} from "react-icons/fa";

export default function MisPagos() {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [rangoFecha, setRangoFecha] = useState("todos");

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      // Reemplaza con tu endpoint real
      // const response = await fetch('http://localhost:5000/api/pagos/usuario');
      // const data = await response.json();
      // setPagos(data);

      // Datos de ejemplo
      setTimeout(() => {
        setPagos([
          {
            id: 1,
            referencia: "ECO-2025-001",
            numeroOrden: "ORD-2025-001",
            fecha: "2025-01-15T10:30:00",
            valor: 2900000,
            metodoPago: "tarjeta",
            estado: "aprobado",
            ultimosCuatro: "4532",
            comprobante: "COMP-001.pdf",
            descripcion: "Pago por Panel Solar 450W y accesorios"
          },
          {
            id: 2,
            referencia: "ECO-2025-002",
            numeroOrden: "ORD-2025-002",
            fecha: "2025-01-18T14:20:00",
            valor: 4800000,
            metodoPago: "transferencia",
            estado: "aprobado",
            banco: "Bancolombia",
            comprobante: "COMP-002.pdf",
            descripcion: "Pago por Kit Solar Residencial"
          },
          {
            id: 3,
            referencia: "ECO-2025-003",
            numeroOrden: "ORD-2025-003",
            fecha: "2025-01-20T09:15:00",
            valor: 31000000,
            metodoPago: "entrega",
            estado: "pendiente",
            descripcion: "Pago contra entrega - Pendiente de recibir"
          },
          {
            id: 4,
            referencia: "ECO-2025-004",
            numeroOrden: "ORD-2025-004",
            fecha: "2025-01-10T16:45:00",
            valor: 3900000,
            metodoPago: "tarjeta",
            estado: "rechazado",
            ultimosCuatro: "8765",
            motivoRechazo: "Fondos insuficientes",
            descripcion: "Intento de pago por paneles solares"
          },
          {
            id: 5,
            referencia: "ECO-2025-005",
            numeroOrden: "ORD-2025-005",
            fecha: "2025-01-22T11:00:00",
            valor: 1850000,
            metodoPago: "tarjeta",
            estado: "aprobado",
            ultimosCuatro: "3456",
            comprobante: "COMP-005.pdf",
            descripcion: "Pago por Panel Solar 300W"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setLoading(false);
    }
  };

  const getMetodoPagoConfig = (metodo) => {
    const configs = {
      tarjeta: {
        icon: <FaCreditCard className="w-5 h-5" />,
        texto: "Tarjeta",
        color: "text-blue-400"
      },
      transferencia: {
        icon: <FaUniversity className="w-5 h-5" />,
        texto: "Transferencia",
        color: "text-purple-400"
      },
      entrega: {
        icon: <FaMoneyBillWave className="w-5 h-5" />,
        texto: "Contra entrega",
        color: "text-green-400"
      }
    };
    return configs[metodo] || configs.tarjeta;
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      aprobado: {
        color: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-400/50",
        icon: <FaCheckCircle className="w-4 h-4" />,
        texto: "Aprobado"
      },
      pendiente: {
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        border: "border-yellow-400/50",
        icon: <FaClock className="w-4 h-4" />,
        texto: "Pendiente"
      },
      rechazado: {
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-400/50",
        icon: <FaTimesCircle className="w-4 h-4" />,
        texto: "Rechazado"
      }
    };
    return configs[estado] || configs.pendiente;
  };

  const filtrarPorFecha = (pago) => {
    const fechaPago = new Date(pago.fecha);
    const hoy = new Date();
    
    switch(rangoFecha) {
      case "hoy":
        return fechaPago.toDateString() === hoy.toDateString();
      case "semana":
        const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        return fechaPago >= semanaAtras;
      case "mes":
        const mesAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
        return fechaPago >= mesAtras;
      default:
        return true;
    }
  };

  const pagosFiltrados = pagos.filter(pago => {
    const cumpleFiltro = filtro === "todos" || pago.estado === filtro;
    const cumpleBusqueda = pago.referencia.toLowerCase().includes(busqueda.toLowerCase()) ||
                           pago.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleFecha = filtrarPorFecha(pago);
    return cumpleFiltro && cumpleBusqueda && cumpleFecha;
  });

  const calcularTotales = () => {
    const aprobados = pagos.filter(p => p.estado === "aprobado");
    const totalAprobado = aprobados.reduce((sum, p) => sum + p.valor, 0);
    return {
      total: totalAprobado,
      cantidad: aprobados.length
    };
  };

  const totales = calcularTotales();

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const descargarComprobante = (pago) => {
    // Aquí implementarías la descarga real del comprobante
    console.log('Descargando comprobante:', pago.comprobante);
    alert(`Descargando comprobante: ${pago.comprobante}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#3dc692] border-t-transparent rounded-full animate-spin"></div>
          Cargando pagos...
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
              <FaMoneyCheckAlt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
              Mis Pagos
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-200">Total de pagos</p>
              <FaMoneyCheckAlt className="w-6 h-6 text-[#3dc692]" />
            </div>
            <p className="text-3xl font-bold text-white">{pagos.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-200">Pagos aprobados</p>
              <FaCheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{totales.cantidad}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-200">Total pagado</p>
              <FaReceipt className="w-6 h-6 text-[#5f54b3]" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
              ${totales.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por referencia..."
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
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition cursor-pointer"
              >
                <option value="todos" className="bg-slate-900">Todos los estados</option>
                <option value="aprobado" className="bg-slate-900">Aprobados</option>
                <option value="pendiente" className="bg-slate-900">Pendientes</option>
                <option value="rechazado" className="bg-slate-900">Rechazados</option>
              </select>
            </div>

            {/* Filtro por fecha */}
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-200 w-5 h-5" />
              <select
                value={rangoFecha}
                onChange={(e) => setRangoFecha(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition cursor-pointer"
              >
                <option value="todos" className="bg-slate-900">Todas las fechas</option>
                <option value="hoy" className="bg-slate-900">Hoy</option>
                <option value="semana" className="bg-slate-900">Última semana</option>
                <option value="mes" className="bg-slate-900">Último mes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de pagos */}
        {pagosFiltrados.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
            <FaReceipt className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No se encontraron pagos</h2>
            <p className="text-blue-200">
              {busqueda || filtro !== "todos" || rangoFecha !== "todos"
                ? "Intenta cambiar los filtros de búsqueda" 
                : "Aún no has realizado ningún pago"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagosFiltrados.map((pago) => {
              const estadoConfig = getEstadoConfig(pago.estado);
              const metodoConfig = getMetodoPagoConfig(pago.metodoPago);
              
              return (
                <div
                  key={pago.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:border-[#3dc692]/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-white/5 rounded-xl">
                        {metodoConfig.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {pago.referencia}
                          </h3>
                          <div className={`flex items-center gap-2 px-3 py-1 ${estadoConfig.bg} ${estadoConfig.border} border rounded-lg`}>
                            {estadoConfig.icon}
                            <span className={`text-sm font-semibold ${estadoConfig.color}`}>
                              {estadoConfig.texto}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-blue-200 text-sm mb-2">
                          {formatearFecha(pago.fecha)}
                        </p>
                        
                        <p className="text-gray-300 text-sm">
                          {pago.descripcion}
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className={metodoConfig.color}>
                              {metodoConfig.texto}
                            </span>
                            {pago.ultimosCuatro && (
                              <span className="text-blue-200">
                                •••• {pago.ultimosCuatro}
                              </span>
                            )}
                            {pago.banco && (
                              <span className="text-blue-200">
                                {pago.banco}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-blue-200">
                            Orden: {pago.numeroOrden}
                          </span>
                        </div>

                        {pago.motivoRechazo && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-400/30 rounded-lg">
                            <p className="text-red-300 text-sm">
                              <strong>Motivo:</strong> {pago.motivoRechazo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-blue-200 text-sm mb-1">Monto</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
                          ${pago.valor.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setPagoSeleccionado(pago)}
                          className="px-4 py-2 bg-[#3dc692]/20 border border-[#3dc692]/50 text-[#3dc692] rounded-xl hover:bg-[#3dc692] hover:text-white transition-all flex items-center gap-2"
                        >
                          <FaEye className="w-4 h-4" />
                          Ver
                        </button>

                        {pago.comprobante && pago.estado === "aprobado" && (
                          <button
                            onClick={() => descargarComprobante(pago)}
                            className="px-4 py-2 bg-[#5f54b3]/20 border border-[#5f54b3]/50 text-[#5f54b3] rounded-xl hover:bg-[#5f54b3] hover:text-white transition-all flex items-center gap-2"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {pagoSeleccionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                Detalle de Pago
              </h2>
              <button
                onClick={() => setPagoSeleccionado(null)}
                className="text-white hover:text-gray-200 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Referencia</p>
                  <p className="text-white font-semibold">{pagoSeleccionado.referencia}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Número de orden</p>
                  <p className="text-white font-semibold">{pagoSeleccionado.numeroOrden}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Fecha y hora</p>
                  <p className="text-white font-semibold">{formatearFecha(pagoSeleccionado.fecha)}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Método de pago</p>
                  <p className="text-white font-semibold">{getMetodoPagoConfig(pagoSeleccionado.metodoPago).texto}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Estado</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 ${getEstadoConfig(pagoSeleccionado.estado).bg} rounded-lg`}>
                    {getEstadoConfig(pagoSeleccionado.estado).icon}
                    <span className={getEstadoConfig(pagoSeleccionado.estado).color}>
                      {getEstadoConfig(pagoSeleccionado.estado).texto}
                    </span>
                  </div>
                </div>
                {pagoSeleccionado.comprobante && (
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Comprobante</p>
                    <p className="text-white font-semibold">{pagoSeleccionado.comprobante}</p>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-blue-200 text-sm mb-2">Descripción</p>
                <p className="text-white">{pagoSeleccionado.descripcion}</p>
              </div>

              <div className="bg-gradient-to-r from-[#3dc692]/10 to-[#5f54b3]/10 border border-[#3dc692]/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Monto total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent">
                    ${pagoSeleccionado.valor.toLocaleString()}
                  </span>
                </div>
              </div>

              {pagoSeleccionado.comprobante && pagoSeleccionado.estado === "aprobado" && (
                <button
                  onClick={() => descargarComprobante(pagoSeleccionado)}
                  className="w-full py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaDownload className="w-5 h-5" />
                  Descargar Comprobante
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}