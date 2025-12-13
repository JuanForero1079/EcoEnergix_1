import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHome, FaThLarge, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useCarrito } from "../context/CarritoContext";

export default function NavBarUsuario() {
  const navigate = useNavigate();
  const location = useLocation();
  const { carrito } = useCarrito();
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calcular el total de productos (suma de todas las cantidades)
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  const navLinks = [
    { path: "/usuario", label: "Inicio", icon: FaHome },
    { path: "/usuario/catalogo", label: "Catálogo", icon: FaThLarge },
    { path: "/usuario/perfil", label: "Perfil", icon: FaUser },
  ];

  const linkClasses = (path) =>
    `group relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
      location.pathname === path
        ? "text-[#3dc692] bg-[#3dc692]/10"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-white/10"
          : "bg-slate-900/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo + Nombre */}
        <Link to="/usuario" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <img
              src="/src/Image/logo.png"
              alt="Logo"
              className="relative h-10 w-auto object-contain"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
            EcoEnergix
          </span>
        </Link>

        {/* Enlaces */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
              <link.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{link.label}</span>

              {location.pathname === link.path && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] rounded-full" />
              )}
            </Link>
          ))}

          {/* Carrito con contador corregido */}
          <Link to="/usuario/carrito" className={`relative ${linkClasses("/usuario/carrito")}`}>
            <FaShoppingCart className="w-5 h-5" />

            {totalProductos > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-bounce">
                {totalProductos}
              </span>
            )}

            {location.pathname === "/usuario/carrito" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] rounded-full" />
            )}
          </Link>

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/50 hover:scale-105"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#3dc692] to-transparent opacity-50" />
    </nav>
  );
}