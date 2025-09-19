// src/admin/componentes/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Users as UsersIcon,
  Package,
  ShoppingCart,
  Truck,
  Home,
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, toggle, isMobile, closeMobile }) {
  return (
    <div
      className="h-full flex flex-col text-white justify-between"
      style={{
        background: "linear-gradient(180deg,#00C9A7 0%, #4375b2 50%, #7D5FFF 100%)",
        boxShadow: "rgba(2,6,23,0.2) 0px 10px 30px",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      {/* ---------- HEADER CON LOGO ---------- */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/EcoEnergixLog.png"
            alt="EcoEnergix"
            className="object-contain cursor-pointer"
            style={{ width: 40, height: 40 }}
            onClick={toggle}
            title={isOpen ? "Colapsar" : "Expandir"}
          />
          {isOpen && <span className="font-extrabold text-lg">EcoEnergix</span>}
        </div>
      </div>

      {/* ---------- MENÚ PRINCIPAL CENTRADO ---------- */}
      <nav className="flex-1 flex items-center justify-center">
        <ul className="space-y-2 w-full px-4">
          <li>
            <Link
              to="/"
              onClick={() => isMobile && closeMobile()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <Home size={20} />
              {isOpen && <span>Bienvenida</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/usuarios"
              onClick={() => isMobile && closeMobile()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <UsersIcon size={20} />
              {isOpen && <span>Usuarios</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/productos"
              onClick={() => isMobile && closeMobile()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <Package size={20} />
              {isOpen && <span>Productos</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/pedidos"
              onClick={() => isMobile && closeMobile()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <ShoppingCart size={20} />
              {isOpen && <span>Pedidos</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/domicilios"
              onClick={() => isMobile && closeMobile()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <Truck size={20} />
              {isOpen && <span>Domicilios</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* ---------- SECCIÓN INFERIOR ---------- */}
      <div className="p-4 border-t border-white/10">
        {/* Botón cerrar sesión */}
        <button
          onClick={() => alert("Cerrar sesión")}
          className="w-full flex items-center gap-3 p-3 mb-3 rounded-lg hover:bg-red-500/20 transition text-white"
        >
          <LogOut size={20} />
          {isOpen && <span>Cerrar sesión</span>}
        </button>

        {/* Copyright */}
        {isOpen ? (
          <div className="text-sm text-white/90">© 2025 EcoEnergix</div>
        ) : (
          <div className="text-xs text-white/60">© 2025</div>
        )}
      </div>
    </div>
  );
}