import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  Package,
  ShoppingCart,
  Truck,
  Hammer,
  DollarSign,
  ClipboardList,
  Wrench,
  Home,
  LogOut,
} from "lucide-react";
import Logo from "../../assets/logo.png";

export default function SidebarAdmin({
  isOpen,
  toggle,
  isMobile,
  closeMobile,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: "/admin", label: "Bienvenida", Icon: Home },
    { to: "/admin/usuarios", label: "Usuarios", Icon: UsersIcon },
    { to: "/admin/productos", label: "Productos", Icon: Package },
    { to: "/admin/compras", label: "Compras", Icon: ShoppingCart },
    { to: "/admin/entregas", label: "Entregas", Icon: Truck },
    { to: "/admin/instalaciones", label: "Instalaciones", Icon: Hammer },
    { to: "/admin/pagos", label: "Pagos", Icon: DollarSign },
    { to: "/admin/proveedores", label: "Proveedores", Icon: ClipboardList },
    { to: "/admin/soporte", label: "Soporte Técnico", Icon: Wrench },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex flex-col justify-between h-full transition-all duration-500 overflow-hidden
                  ${isOpen ? "w-64" : "w-20"}
                  bg-gradient-to-b from-purple-600 via-blue-600 to-teal-400`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(91,33,182,0.9), rgba(37,99,235,0.9), rgba(13,148,136,0.9))",
      }}
    >
      {/* Fondo blur semitransparente sin invadir el resto del layout */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10 z-0" />

      {/* Contenido del Sidebar */}     
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header con logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="EcoEnergix"
              className="object-contain cursor-pointer drop-shadow-md hover:scale-110 transition-transform"
              style={{ width: 40, height: 40 }}
              onClick={toggle}
              title={isOpen ? "Colapsar menú" : "Expandir menú"}
            />
            {isOpen && (
              <span className="font-extrabold text-lg text-white drop-shadow-sm">
                EcoEnergix
              </span>
            )}
          </div>
        </div>

        {/* Menú principal */}
        <nav className="flex-1 flex items-center justify-center">
          <ul className="space-y-2 w-full px-4">
            {menuItems.map(({ to, label, Icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => isMobile && closeMobile()}
                    title={!isOpen ? label : ""}
                    className={`group flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-white/25 text-teal-300 shadow-inner"
                                    : "text-white hover:bg-white/10 hover:text-teal-300"
                                }`}
                  >
                    <Icon size={22} />
                    {isOpen && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 mb-3 rounded-xl 
                       text-white font-medium hover:bg-red-500/30
                       transition-all duration-300"
            title={!isOpen ? "Cerrar sesión" : ""}
          >
            <LogOut size={22} />
            {isOpen && <span>Cerrar sesión</span>}
          </button>
          {isOpen ? (
            <div className="text-sm text-white/80">© 2025 EcoEnergix</div>
          ) : (
            <div className="text-xs text-white/60 text-center">© 2025</div>
          )}
        </div>
      </div>
    </aside>
  );
}
