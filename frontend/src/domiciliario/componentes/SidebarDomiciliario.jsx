import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home, Truck, MapPin, User, LogOut,
  History, ClipboardList, Map, HelpCircle, Shield
} from "lucide-react";

export default function SidebarDomiciliario({
  isOpen,
  toggle,
  isMobile,
  closeMobile,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const menuItems = [
    { to: "/domiciliario/inicio", label: "Inicio", Icon: Home },
    { to: "/domiciliario/asignados", label: "Asignados", Icon: ClipboardList },
    { to: "/domiciliario/domicilios", label: "Mis Domicilios", Icon: Truck },
    { to: "/domiciliario/historial", label: "Historial", Icon: History },
    { to: "/domiciliario/direcciones", label: "Direcciones", Icon: MapPin },
    { to: "/domiciliario/mapa", label: "Mapa", Icon: Map },
    { to: "/domiciliario/soporte", label: "Soporte", Icon: HelpCircle },
    { to: "/domiciliario/auditoria", label: "Auditoría", Icon: Shield },
    { to: "/domiciliario/perfil", label: "Perfil", Icon: User },
  ];

  return (
    <>
      {/* ======= OVERLAY (solo móvil) ======= */}
      {isMobile && isOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
        />
      )}

      {/* ======= SIDEBAR ======= */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col justify-between
          transition-all duration-500 
          ${isMobile
            ? isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
            : isOpen ? "w-64" : "w-20"
          }
          relative overflow-hidden
        `}
      >
        {/* Fondos animados */}
        <div
          className="absolute inset-0 -z-20 animate-gradient opacity-80"
          style={{
            background:
              "linear-gradient(140deg, #8B5CF6, #6D28D9, #4F46E5, #0EA5E9)",
            backgroundSize: "400% 400%",
          }}
        />
        <div className="absolute inset-0 -z-10 backdrop-blur-2xl bg-white/10" />

        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/logo.png"
              alt="EcoEnergix"
              className="object-contain cursor-pointer hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
              onClick={toggle}
            />
            {isOpen && (
              <span className="font-extrabold text-lg text-white">Domiciliario</span>
            )}
          </div>
        </div>

        {/* MENÚ */}
        <nav className="flex-1 flex items-center justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
          <ul className="space-y-2 w-full px-4">
            {menuItems.map(({ to, label, Icon }) => {
              const active = pathname === to;

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => isMobile && closeMobile()}
                    className={`group flex items-center gap-3 p-3 rounded-xl 
                      font-medium transition-all duration-300
                      ${
                        active
                          ? "bg-white/30 text-teal-200 shadow-lg"
                          : "text-white hover:bg-white/10 hover:backdrop-blur-md"
                      }
                    `}
                  >
                    <Icon
                      size={22}
                      className={`${
                        active ? "text-teal-200" : "group-hover:text-teal-300"
                      }`}
                    />

                    {isOpen && (
                      <span
                        className={`${
                          active ? "text-teal-200" : "group-hover:text-teal-300"
                        }`}
                      >
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 mb-3 rounded-xl text-white hover:bg-red-500/30 transition-all"
          >
            <LogOut size={22} />
            {isOpen && <span>Cerrar sesión</span>}
          </button>

          <div className={`${isOpen ? "text-sm" : "text-xs"} text-white/70 text-center`}>
            © 2025 EcoEnergix
          </div>
        </div>
      </div>
    </>
  );
}
