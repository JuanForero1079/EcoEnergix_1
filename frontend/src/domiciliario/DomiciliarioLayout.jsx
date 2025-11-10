// src/domiciliario/DomiciliarioLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function DomiciliarioLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar simple */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel Domiciliario</h1>
        <div>
          <Link
            to="/"
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }}
          >
            Cerrar sesión
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-semibold mb-4">Pedidos asignados</h2>

        {/* Lista simulada */}
        <ul className="space-y-3">
          <li className="bg-gray-800 p-3 rounded shadow flex justify-between">
            <span>Pedido #001 - Cliente: Juan</span>
            <button className="bg-green-600 px-2 py-1 rounded hover:bg-green-500">
              Entregado
            </button>
          </li>
          <li className="bg-gray-800 p-3 rounded shadow flex justify-between">
            <span>Pedido #002 - Cliente: María</span>
            <button className="bg-green-600 px-2 py-1 rounded hover:bg-green-500">
              Entregado
            </button>
          </li>
          <li className="bg-gray-800 p-3 rounded shadow flex justify-between">
            <span>Pedido #003 - Cliente: Carlos</span>
            <button className="bg-green-600 px-2 py-1 rounded hover:bg-green-500">
              Entregado
            </button>
          </li>
        </ul>

        {/* Outlet para rutas hijas si quieres agregar más páginas */}
        <Outlet />
      </main>
    </div>
  );
}
