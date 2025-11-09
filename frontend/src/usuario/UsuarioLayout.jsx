import { Outlet } from "react-router-dom";
import FondoSlider from "../Componentes/FondoSlider.jsx";
import NavBarUsuario from "./Componentes/NavbarUsuario.jsx";

export default function UsuarioLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fondo dinámico del slider */}
      <FondoSlider />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Navbar del usuario */}
      <NavBarUsuario />

      {/* Contenido dinámico */}
      <main className="pt-20 flex-grow relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
