import { Link, useLocation } from "react-router-dom";

export default function NavBarUsuario() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg font-semibold transition ${
      location.pathname === path
        ? "bg-green-600 text-white"
        : "text-white hover:bg-green-500/30"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-700 to-green-500 bg-opacity-90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo o nombre */}
        <Link
          to="/usuario/home"
          className="text-2xl font-extrabold text-white tracking-wide drop-shadow-md"
        >
          EcoEnergix
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/usuario/home" className={linkClasses("/usuario/home")}>
            Inicio
          </Link>
          <Link to="/usuario/catalogo" className={linkClasses("/usuario/catalogo")}>
            Catálogo
          </Link>
          <Link to="/usuario/perfil" className={linkClasses("/usuario/perfil")}>
            Perfil
          </Link>
          <Link
            to="/"
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
