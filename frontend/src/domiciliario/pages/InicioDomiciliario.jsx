// src/pages/domiciliario/InicioDomiciliario.jsx
import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function InicioDomiciliario() {
  const stats = [
    { title: "Domicilios Completados", value: 48, icon: <CheckCircle size={26} /> },
    { title: "Pendientes Hoy", value: 6, icon: <Clock size={26} /> },
    { title: "En Curso", value: 2, icon: <Package size={26} /> },
    { title: "Rendimiento del Mes", value: "92%", icon: <TrendingUp size={26} /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Inicio</h1>

      {/* Tarjetas de estadísticas estilo glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-3 bg-white/20 rounded-xl text-white">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-white/80">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de próximas tareas */}
      <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Próximos Domicilios</h2>

        <div className="space-y-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-white">
            Pedido #1122 — Cra 45 #12  
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-white">
            Pedido #1123 — Calle 9 #27  
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-white">
            Pedido #1124 — Av 68  
          </div>
        </div>
      </div>
    </div>
  );
}
