import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "./Componentes/SidebarAdmin.jsx";
import API from "../services/api";

export default function AdminLayoutAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeMobile = () => isMobile && setIsOpen(false);

  /* ==============================
     SOLO detectar mobile (NO tocar isOpen)
     ============================== */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ==============================
     Perfil admin
     ============================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/perfil");
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white overflow-hidden">
      {/* ==============================
          Sidebar (NUNCA desaparece)
         ============================== */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full
          transition-all duration-300 ease-in-out
          bg-transparent
          ${
            isOpen ? "w-64" : "w-20"
          }
          ${isMobile ? "lg:translate-x-0" : "translate-x-0"}
        `}
      >
        <SidebarAdmin
          isOpen={isOpen}
          toggle={toggleSidebar}
          isMobile={isMobile}
          closeMobile={closeMobile}
          onLogout={handleLogout}
        />
      </aside>

      {/* ==============================
          Contenido
         ============================== */}
      <main
        className={`
          flex-1 p-6 transition-all duration-300 ease-in-out
          ${isOpen ? "ml-64" : "ml-20"}
          ${isMobile ? "ml-0" : ""}
        `}
      >
        {user && (
          <h1 className="text-2xl font-bold mb-6">
            Bienvenido al Panel de Administración, {user.Nombre} 👋
          </h1>
        )}
        <Outlet />
      </main>

      {/* ==============================
          Overlay SOLO mobile
         ============================== */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}
    </div>
  );
}
