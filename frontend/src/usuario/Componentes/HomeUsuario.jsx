import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaCreditCard,
  FaTools,
  FaSolarPanel,
  FaChartLine,
  FaUser,
  FaBolt,
  FaLeaf,
  FaArrowRight
} from "react-icons/fa";
import API from "../../services/api";

export default function HomeUsuario() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [energySaved, setEnergySaved] = useState(0);
  const [user, setUser] = useState(null); // <- aquí guardaremos el usuario desde la API

  // Función cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // Traer usuario desde la API al cargar la página
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/perfil"); // Endpoint para obtener perfil
        setUser(data);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };
    fetchUser();
  }, []);

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animación energía ahorrada
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergySaved((prev) => Number((prev + 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const quickStats = [
    { label: "Energía Ahorrada Hoy", value: `${energySaved} kWh`, icon: FaBolt, color: "from-yellow-400 to-orange-500" },
    { label: "CO₂ Reducido", value: "2.5 kg", icon: FaLeaf, color: "from-green-400 to-emerald-500" },
    { label: "Ahorro Mensual", value: "$45.000", icon: FaChartLine, color: "from-blue-400 to-cyan-500" },
  ];

  const mainActions = [
    { title: "Mis Compras", description: "Revisa tus pedidos y seguimiento", icon: FaShoppingCart, path: `/usuario/mis-compras/${user?.id || ""}`, gradient: "from-[#3dc692] to-[#2aa876]" },
    { title: "Mis Pagos", description: "Gestiona tus facturas y métodos de pago", icon: FaCreditCard, path: `/usuario/mis-pagos/${user?.id || ""}`, gradient: "from-[#5f54b3] to-[#4a3f8f]" },
    { title: "Soporte Técnico", description: "Solicita ayuda especializada", icon: FaTools, path: `/usuario/soporte/${user?.id || ""}`, gradient: "from-[#4375b2] to-[#2d5a8f]" },
  ];

  const infoCards = [
    { title: "Panel Solar Inteligente", description: "Monitorea el rendimiento de tus paneles en tiempo real con nuestro sistema IoT integrado.", icon: FaSolarPanel, color: "text-[#3dc692]", bgGradient: "from-[#3dc692]/20 to-[#3dc692]/5" },
    { title: "Análisis de Consumo", description: "Obtén reportes detallados de tu consumo energético y recomendaciones personalizadas.", icon: FaChartLine, color: "text-[#5f54b3]", bgGradient: "from-[#5f54b3]/20 to-[#5f54b3]/5" },
    { title: "Mi Perfil", description: "Actualiza tu información, cambia contraseña y personaliza tu experiencia.", icon: FaUser, color: "text-[#4375b2]", bgGradient: "from-[#4375b2]/20 to-[#4375b2]/5" },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 -z-10" />
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header usuario */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <p className="text-blue-200 text-lg mb-2">{getGreeting()}</p>
              {user && (
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
                  ¡Hola,{" "}
                  <span className="bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
                    {user.Nombre}
                  </span>
                  !
                </h1>
              )}
              <p className="text-lg text-gray-200 max-w-2xl">
                Bienvenido a tu panel de control energético. Gestiona todo desde un solo lugar.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-full animate-spin-slow opacity-20" />
                <div className="absolute inset-2 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-full flex items-center justify-center">
                  <FaSolarPanel className="w-16 h-16 text-white" />
                </div>
              </div>
              <p className="text-sm text-blue-200">Sistema Activo</p>
            </div>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-blue-200 text-sm">{stat.label}</p>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 animate-pulse`} style={{ width: "75%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Acciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainActions.map((action, index) => (
            <Link key={index} to={action.path} className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{action.title}</h3>
                <p className="text-blue-200 mb-4">{action.description}</p>
                <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Ver más</span>
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <action.icon className="w-32 h-32 text-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* Info cards */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Herramientas y Servicios</h2>
            <div className="hidden md:block h-1 flex-1 ml-6 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, index) => (
              <div key={index} className={`group relative bg-gradient-to-br ${card.bgGradient} border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${card.color}`}>{card.title}</h3>
                </div>
                <p className="text-gray-200 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje final */}
        <div className="bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] rounded-3xl p-8 text-center shadow-2xl">
          <FaLeaf className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Impacto Ambiental Positivo</h3>
          <p className="text-white/90 max-w-2xl mx-auto">
            Con tu contribución, has ayudado a reducir la huella de carbono equivalente a plantar 15 árboles este mes.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
