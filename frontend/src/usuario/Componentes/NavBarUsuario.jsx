import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCarrito } from "../context/CarritoContext";

export default function NavBarUsuario() {
  const location = useLocation();
  const { carrito } = useCarrito();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md font-semibold transition ${
      location.pathname === path
        ? "text-green-600 font-bold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <img
            src="/src/Image/logo.png"
            alt="Logo"
            className="h-13 sm:h-12 w-auto object-contain"
          />
        <Link
          to="/usuario"
          className="text-2xl font-bold text-green-600 tracking-wide"
        >
          EcoEnergix
        </Link>

        {/* Enlaces */}
        <div className="flex items-center gap-6">
          <Link to="/usuario" className={linkClasses("/usuario/home")}>
            Inicio
          </Link>

          <Link to="/usuario/catalogo" className={linkClasses("/usuario/catalogo")}>
            Catálogo
          </Link>

          <Link to="/usuario/perfil" className={linkClasses("/usuario/perfil")}>
            Perfil
          </Link>

          {/* Ícono del carrito */}
          <Link to="/usuario/carrito" className="relative flex items-center">
            
            <FaShoppingCart
              size={22}
              className="text-green-600 hover:text-green-700 transition"
            />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {carrito.length}
              </span>
            )}
          </Link>

          {/* Cerrar sesión */}
          <Link
            to="/"
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Cerrar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
