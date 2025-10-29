// src/admin/AdminLayoutAdmin.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "./Componentes/SidebarAdmin.jsx"; // ✅ Asegúrate que exista

export default function AdminLayoutAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // 🔄 Alternar barra lateral
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobile = () => setIsOpen(false);

  // 📱 Detectar tamaño de pantalla (modo móvil)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔒 Función de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user"); // Borra sesión almacenada
    alert("✅ Sesión cerrada correctamente");
    navigate("/"); // 👈 Redirige al Home público
  };

  // 🧱 Estructura del layout del panel admin
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin
        isOpen={isOpen}
        toggle={toggleSidebar}
        isMobile={isMobile}
        closeMobile={closeMobile}
        onLogout={handleLogout} // 👈 Enviamos la función al Sidebar
      />
      <main className="flex-1 p-6 overflow-y-auto transition-all duration-500">
        <Outlet /> {/* 👈 Aquí se renderizan las rutas hijas del Admin */}
      </main>
    </div>
  );
}
