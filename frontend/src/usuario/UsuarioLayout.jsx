import { Outlet } from "react-router-dom";
import NavBarUsuario from "./Componentes/NavBarUsuario.jsx";

export default function UsuarioLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0f24]">
      {/* Capa para eliminar cualquier fondo heredado */}
      <div className="absolute inset-0 bg-[#0a0f24] -z-10" />

      {/* Navbar */}
      <NavBarUsuario />

      {/* Contenido */}
      <main className="pt-20 flex-grow relative z-10 bg-transparent">
        <Outlet />
      </main>
    </div>
  );
}
