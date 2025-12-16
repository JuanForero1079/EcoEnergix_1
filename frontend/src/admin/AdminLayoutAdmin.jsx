import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "./Componentes/SidebarAdmin.jsx";
import API from "../services/api"; // tu axios con interceptors

export default function AdminLayoutAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null); // <- nuevo estado para admin
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobile = () => setIsOpen(false);

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

  // Obtener datos del perfil del admin
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/perfil"); // tu endpoint
        setUser(data);
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el perfil");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-500 ease-in-out transform ${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-20"
        } bg-gradient-to-b from-purple-700 via-indigo-800 to-cyan-500 text-white shadow-xl`}
      >
        <SidebarAdmin
          isOpen={isOpen}
          toggle={toggleSidebar}
          isMobile={isMobile}
          closeMobile={closeMobile}
          onLogout={handleLogout}
        />
      </div>

      {/* Contenido principal */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isOpen && !isMobile ? "lg:ml-64" : "lg:ml-20"
        } p-6 overflow-y-auto`}
      >
        {user && (
          <h1 className="text-2xl font-bold mb-6">
            Bienvenido al Panel de Administración, {user.Nombre}!
          </h1>
        )}
        <Outlet />
      </main>

      {/* Fondo móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobile}
        />
      )}
    </div>
  );
}
