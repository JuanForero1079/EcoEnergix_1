import React, { useEffect, useState } from "react";
import { getUsuarios } from "../services/usersServiceAdmin";
import ecoLogo from "../../assets/EcoEnergixLog.png";
import fondoAdmin from "../../assets/camion-solar-1.jpg";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        console.log("📋 Usuarios cargados:", data);
        setUsuarios(data);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div
      className="p-8 space-y-8 relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${fondoAdmin})` }}
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* Encabezado */}
      <div style={glassStyle} className="p-6 flex items-center gap-4">
        <img
          src={ecoLogo}
          alt="EcoEnergix Logo"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="text-sm text-white/70 mt-1">
            Visualiza todos los usuarios registrados en el sistema
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white text-sm">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo Electrónico</th>
              <th className="p-3 text-left">Contraseña</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Tipo Documento</th>
              <th className="p-3 text-left">Número Documento</th>
              <th className="p-3 text-left">Foto</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/20 text-white transition-colors"
                >
                  <td className="p-3">{u.ID_usuario}</td>
                  <td className="p-3">{u.Nombre}</td>
                  <td className="p-3">{u.Correo_electronico}</td>
                  <td className="p-3">{u.Contraseña}</td>
                  <td className="p-3">{u.Rol_usuario}</td>
                  <td className="p-3">{u.Tipo_documento}</td>
                  <td className="p-3">{u.Numero_documento}</td>
                  <td className="p-3 text-center">
                    {u.Foto_usuario ? (
                      <img
                        src={u.Foto_usuario}
                        alt={u.Nombre}
                        className="w-10 h-10 rounded-full object-cover mx-auto border border-white/30"
                      />
                    ) : (
                      <span className="text-white/50">Sin foto</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.Estado_usuario === "Activo"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.Estado_usuario}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-white/60">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
