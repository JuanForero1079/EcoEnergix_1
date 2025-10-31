import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "./Componentes/SidebarAdmin.jsx";

export default function AdminLayoutAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // 🔄 Alternar barra lateral
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobile = () => setIsOpen(false);

  // 📱 Detectar tamaño de pantalla
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

  // 🔒 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("✅ Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden relative">
      {/* 🟦 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-500 ease-in-out transform ${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-20"
        } bg-gradient-to-b from-slate-900 via-blue-900 to-sky-500 text-white shadow-xl`}
      >
        <SidebarAdmin
          isOpen={isOpen}
          toggle={toggleSidebar}
          isMobile={isMobile}
          closeMobile={closeMobile}
          onLogout={handleLogout}
        />
      </div>

      {/* 🧱 Contenido principal */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isOpen && !isMobile ? "lg:ml-64" : "lg:ml-20"
        } p-6 overflow-y-auto`}
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </main>

      {/* 📱 Fondo oscuro cuando el sidebar está abierto en móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobile}
        />
      )}
    </div>
  );
}
