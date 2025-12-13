import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera, FaShieldAlt } from "react-icons/fa";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: "Emmanuel Piñeros",
    correo: "emmanuel@ecoenergix.com",
    telefono: "+57 310 000 0000",
    direccion: "Calle 123 #45-67, Bogotá, Colombia",
  });

  const [tempUsuario, setTempUsuario] = useState(usuario);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    setTempUsuario(usuario);
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => {
    setTempUsuario(usuario);
    setEditando(true);
  };

  const handleGuardar = () => {
    setUsuario(tempUsuario);
    setEditando(false);
    alert("Información actualizada correctamente");
  };

  const handleCancelar = () => {
    setTempUsuario(usuario);
    setEditando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-blue-200">Gestiona tu información personal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2]">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3dc692] to-[#5f54b3] p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-white" />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] rounded-full shadow-lg hover:scale-110 transition-transform">
                  <FaCamera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-1">
                {editando ? tempUsuario.nombre : usuario.nombre}
              </h2>
              <p className="text-blue-200 flex items-center justify-center gap-2">
                <FaShieldAlt className="w-4 h-4" />
                Cliente Premium
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
                    <FaUser className="w-4 h-4 text-[#3dc692]" />
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      value={editando ? tempUsuario.nombre : usuario.nombre}
                      onChange={handleChange}
                      disabled={!editando}
                      className={`w-full p-4 rounded-xl border transition-all ${
                        editando
                          ? "border-[#3dc692] bg-white/10 text-white focus:ring-2 focus:ring-[#3dc692] focus:outline-none"
                          : "bg-white/5 border-white/10 text-gray-300 cursor-not-allowed"
                      }`}
                    />
                    {editando && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaEdit className="w-4 h-4 text-[#3dc692]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
                    <FaEnvelope className="w-4 h-4 text-[#3dc692]" />
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="correo"
                      value={editando ? tempUsuario.correo : usuario.correo}
                      onChange={handleChange}
                      disabled={!editando}
                      className={`w-full p-4 rounded-xl border transition-all ${
                        editando
                          ? "border-[#3dc692] bg-white/10 text-white focus:ring-2 focus:ring-[#3dc692] focus:outline-none"
                          : "bg-white/5 border-white/10 text-gray-300 cursor-not-allowed"
                      }`}
                    />
                    {editando && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaEdit className="w-4 h-4 text-[#3dc692]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
                    <FaPhone className="w-4 h-4 text-[#3dc692]" />
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="telefono"
                      value={editando ? tempUsuario.telefono : usuario.telefono}
                      onChange={handleChange}
                      disabled={!editando}
                      className={`w-full p-4 rounded-xl border transition-all ${
                        editando
                          ? "border-[#3dc692] bg-white/10 text-white focus:ring-2 focus:ring-[#3dc692] focus:outline-none"
                          : "bg-white/5 border-white/10 text-gray-300 cursor-not-allowed"
                      }`}
                    />
                    {editando && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaEdit className="w-4 h-4 text-[#3dc692]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-blue-200 text-sm font-semibold">
                    <FaMapMarkerAlt className="w-4 h-4 text-[#3dc692]" />
                    Dirección
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="direccion"
                      value={editando ? tempUsuario.direccion : usuario.direccion}
                      onChange={handleChange}
                      disabled={!editando}
                      className={`w-full p-4 rounded-xl border transition-all ${
                        editando
                          ? "border-[#3dc692] bg-white/10 text-white focus:ring-2 focus:ring-[#3dc692] focus:outline-none"
                          : "bg-white/5 border-white/10 text-gray-300 cursor-not-allowed"
                      }`}
                    />
                    {editando && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaEdit className="w-4 h-4 text-[#3dc692]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white mb-1">12</p>
                  <p className="text-sm text-blue-200">Compras Realizadas</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white mb-1">3</p>
                  <p className="text-sm text-blue-200">Instalaciones</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white mb-1">45 kWh</p>
                  <p className="text-sm text-blue-200">Energía Ahorrada</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                {!editando ? (
                  <button
                    onClick={handleEditar}
                    className="px-6 py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3dc692]/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaEdit className="w-5 h-5" />
                    Editar Información
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancelar}
                      className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimes className="w-5 h-5" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleGuardar}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaSave className="w-5 h-5" />
                      Guardar Cambios
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Seguridad</h3>
            <p className="text-blue-200 text-sm mb-4">Protege tu cuenta con contraseña segura</p>
            <button className="text-[#3dc692] font-semibold hover:text-[#2aa876] transition">
              Cambiar Contraseña
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Notificaciones</h3>
            <p className="text-blue-200 text-sm mb-4">Configura tus preferencias de notificación</p>
            <button className="text-[#3dc692] font-semibold hover:text-[#2aa876] transition">
              Gestionar Notificaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}