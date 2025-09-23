import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routeNames = {
  "/": "Inicio",
  "/contact": "Contáctanos",
  "/catalogo": "Catálogo",
  "/services": "Servicios",
  "/about": "Nosotros",
  "/login": "Login",
  "/register": "Registro",
  "/terms": "Términos y Condiciones",
  "/privacy": "Política de Privacidad",
};

export default function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint de Tailwind
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Agregar la ruta actual al historial
  useEffect(() => {
    const current = location.pathname;
    setHistory((prev) => {
      if (prev[prev.length - 1] === current) return prev;
      return [...prev, current];
    });
  }, [location.pathname]);

  // Evitar mostrar breadcrumb en páginas específicas
  if (location.pathname === "/" || location.pathname === "/login") return null;

  // Breadcrumb colapsado solo en móviles
  const displayedHistory =
    isMobile && history.length > 3
      ? [history[0], "...", history[history.length - 1]]
      : history;

  const handleClick = (index, path) => {
    if (path === "...") return;
    setHistory((prev) => prev.slice(0, index + 1));
    navigate(path);
  };

  return (
    <nav
      className="absolute top-20 left-1 z-50
                 bg-white/30 backdrop-blur-md rounded-lg p-3 flex flex-wrap
                 items-center gap-1 text-gray-700 shadow-sm max-w-[90%] sm:max-w-[300px] overflow-x-auto
                 text-sm sm:text-base"
      aria-label="breadcrumb"
    >
      {displayedHistory.map((path, index) => {
        const isLast = index === displayedHistory.length - 1;
        return (
          <span
            key={index}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {!isLast ? (
              <>
                <button
                  onClick={() => handleClick(index, path)}
                  className={`${
                    path === "..."
                      ? "cursor-default text-gray-400"
                      : "text-gray-600 hover:text-green-600 transition font-medium"
                  }`}
                >
                  {routeNames[path] || path}
                </button>
                <span className="text-gray-400 select-none">→</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold">
                {routeNames[path] || path}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
