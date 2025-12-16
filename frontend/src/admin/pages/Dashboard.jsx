import React, { useState } from "react";
import { FaUsers, FaShoppingCart, FaDollarSign, FaBox, FaChartLine, FaTruck, FaSolarPanel, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function Dashboard() {
  const [stats] = useState({
    usuariosRegistrados: 145,
    ventasSemana: 23,
    ingresosSemana: 12500000,
    productosVendidos: 67,
    pedidosPendientes: 8,
    instalacionesActivas: 15,
  });

  const [ventasRecientes] = useState([
    { id: 1, cliente: "Juan Pérez", producto: "Panel Solar 300W", monto: 450000, fecha: "Hoy, 10:30 AM", estado: "Completado" },
    { id: 2, cliente: "María González", producto: "Inversor 5kW", monto: 1200000, fecha: "Hoy, 09:15 AM", estado: "Pendiente" },
    { id: 3, cliente: "Carlos Ruiz", producto: "Panel Solar 450W", monto: 680000, fecha: "Ayer, 16:45 PM", estado: "Completado" },
    { id: 4, cliente: "Ana López", producto: "Batería Solar 10kWh", monto: 2500000, fecha: "Ayer, 14:20 PM", estado: "Procesando" },
  ]);

  const statsCards = [
    { title: "Usuarios Registrados", value: stats.usuariosRegistrados, icon: FaUsers, color: "from-blue-500 to-blue-600", change: "+12%", isPositive: true },
    { title: "Ventas esta Semana", value: stats.ventasSemana, icon: FaShoppingCart, color: "from-emerald-500 to-emerald-600", change: "+8%", isPositive: true },
    { title: "Ingresos Semanales", value: `$${(stats.ingresosSemana / 1000000).toFixed(1)}M`, icon: FaDollarSign, color: "from-purple-500 to-purple-600", change: "+15%", isPositive: true },
    { title: "Productos Vendidos", value: stats.productosVendidos, icon: FaBox, color: "from-orange-500 to-orange-600", change: "+5%", isPositive: true },
    { title: "Pedidos Pendientes", value: stats.pedidosPendientes, icon: FaTruck, color: "from-red-500 to-red-600", change: "-3%", isPositive: false },
    { title: "Instalaciones Activas", value: stats.instalacionesActivas, icon: FaSolarPanel, color: "from-yellow-500 to-yellow-600", change: "+10%", isPositive: true },
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case "Completado": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Pendiente": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Procesando": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-blue-200">Bienvenido de nuevo, aquí está el resumen de tu plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${stat.isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {stat.isPositive ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-blue-200 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaChartLine className="w-6 h-6 text-purple-400" />
                Ventas Recientes
              </h2>
            </div>
            <div className="space-y-3">
              {ventasRecientes.map((venta) => (
                <div key={venta.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{venta.cliente}</h3>
                      <p className="text-blue-200 text-sm">{venta.producto}</p>
                      <p className="text-gray-400 text-xs mt-1">{venta.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${venta.monto.toLocaleString()}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(venta.estado)}`}>
                        {venta.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Resumen Rápido</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-blue-200 text-sm">Tasa de conversión</span>
                    <span className="text-white font-bold">4.2%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-blue-200 text-sm">Satisfacción</span>
                    <span className="text-white font-bold">98%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Meta del Mes</h3>
              <p className="text-blue-200 text-sm mb-4">$12.5M de $20M</p>
              <div className="text-4xl font-bold text-white mb-2">62.5%</div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full" style={{ width: "62.5%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Productos Más Vendidos</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-blue-200 text-sm">Panel Solar 300W</span><span className="text-white font-bold">45</span></div>
              <div className="flex justify-between"><span className="text-blue-200 text-sm">Inversor 5kW</span><span className="text-white font-bold">32</span></div>
              <div className="flex justify-between"><span className="text-blue-200 text-sm">Batería 10kWh</span><span className="text-white font-bold">28</span></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Alertas</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 text-sm"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div><span>8 pedidos pendientes</span></div>
              <div className="flex items-center gap-2 text-red-400 text-sm"><div className="w-2 h-2 bg-red-400 rounded-full"></div><span>3 bajo stock</span></div>
              <div className="flex items-center gap-2 text-green-400 text-sm"><div className="w-2 h-2 bg-green-400 rounded-full"></div><span>Sistema OK</span></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actividad</h3>
            <div className="space-y-2 text-sm">
              <p className="text-blue-200"><span className="text-white font-semibold">Admin</span> actualizó inventario</p>
              <p className="text-gray-400 text-xs">Hace 5 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}