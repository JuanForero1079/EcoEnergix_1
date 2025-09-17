import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/Image/EcoEnergixSINFONDO.png" alt="Logo" className="h-10 sm:h-12 w-auto object-contain" />
          <h1 className="text-xl font-extrabold sm:text-2xl bg-gradient-to-r from-[#4375b2] via-[#5f54b3] to-[#3dc692] bg-clip-text text-transparent  drop-shadow-md  absolute left-1/2 -translate-x-1/2
            md:static md:translate-x-0 md:ml-3"><Link to="/">EcoEnergix</Link></h1>
        </div>

        <ul className="hidden md:flex gap-6 lg:gap-8 text-sm sm:text-base lg:text-lg text-white font-medium">
          <li><Link to="/" className="hover:underline hover:text-[#3dc692]">Inicio</Link></li>
           <li><Link to="/about" className="hover:underline hover:text-[#3dc692]">Nosotros</Link></li>
          <li><Link to="/services" className="hover:underline hover:text-[#3dc692]">Servicios</Link></li>
          <li><Link to="/contact" className="hover:underline hover:text-[#3dc692]">Contacto</Link></li>
          <li><Link to="/login" className="hover:underline hover:text-[#3dc692]">Inicio de Sesión</Link></li>
        </ul>

        <button className="md:hidden text-white text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </div>

      {open && (
      <div className="md:hidden bg-white/20 backdrop-blur-md shadow-md">
          <ul className="flex flex-col items-center gap-4 py-6 text-white font-medium text-base">
            <li><Link to="/" onClick={() => setOpen(false)} className="hover:underline hover:text-[#3dc692]">Inicio</Link></li>
             <li><Link to="/about" onClick={() => setOpen(false)}className="hover:underline hover:text-[#3dc692]">Nosotros</Link></li>
            <li><Link to="/services" onClick={() => setOpen(false)}className="hover:underline hover:text-[#3dc692]">Servicios</Link></li>
            <li><Link to="/contact" onClick={() => setOpen(false)}className="hover:underline hover:text-[#3dc692]">Contacto</Link></li>
            <li><Link to="/login" onClick={() => setOpen(false)}className="hover:underline hover:text-[#3dc692]">Inicio de Sesión</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
