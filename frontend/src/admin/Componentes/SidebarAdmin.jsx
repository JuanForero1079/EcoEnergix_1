// src/admin/Componentes/SidebarAdmin.jsx
import React from "react";
import { Link } from "react-router-dom";
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

export default function SidebarAdmin({
  isOpen,
  toggle,
  isMobile,
  closeMobile,
  onLogout,
}) {
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

  return (
    <div
      className={`h-full flex flex-col justify-between transition-all duration-500 
                  ${isOpen ? "w-64" : "w-20"} relative`}
    >
      {/* Fondo con efecto de vidrio */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-600 via-blue-600 to-teal-400 opacity-70" />
      <div className="absolute inset-0 -z-10 backdrop-blur-2xl bg-white/10" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/EcoEnergixLog.png"
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
          {menuItems.map(({ to, label, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => isMobile && closeMobile()}
                className="group flex items-center gap-3 p-3 rounded-xl 
                           text-white font-medium
                           hover:bg-white/10 hover:backdrop-blur-md
                           transition-all duration-300"
              >
                <Icon
                  size={22}
                  className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] 
                             group-hover:text-teal-300 transition-colors duration-300"
                />
                {isOpen && (
                  <span className="group-hover:text-teal-300 transition-colors duration-300">
                    {label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 mb-3 rounded-xl 
                     text-white font-medium
                     hover:bg-red-500/30 hover:backdrop-blur-md
                     transition-all duration-300"
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
  );
}
